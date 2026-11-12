/**
 * Minimalist, high-performance Zustand v5-compatible store engine.
 * Powered by React 19's native useSyncExternalStore.
 */

import { useSyncExternalStore } from 'react';

export type SetStateInternal<T> = (
  partial: Partial<T> | ((state: T) => Partial<T> | T)
) => void;

export type GetStateInternal<T> = () => T;

export type StateCreator<T> = (
  set: SetStateInternal<T>,
  get: GetStateInternal<T>
) => T;

export interface StoreApi<T> {
  (): T;
  <U>(selector: (state: T) => U): U;
  getState: () => T;
  setState: SetStateInternal<T>;
  subscribe: (listener: () => void) => () => void;
}

export function create<T>(initializer: StateCreator<T>): StoreApi<T> {
  let state: T;
  const listeners = new Set<() => void>();

  const getState = (): T => state;

  const setState: SetStateInternal<T> = (partial) => {
    const nextState =
      typeof partial === 'function'
        ? (partial as (state: T) => Partial<T> | T)(state)
        : partial;

    if (nextState !== state) {
      state = Object.assign({}, state, nextState);
      listeners.forEach((listener) => listener());
    }
  };

  const subscribe = (listener: () => void) => {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  };

  state = initializer(setState, getState);

  const useStore = (<U = T>(selector?: (state: T) => U): U => {
    return useSyncExternalStore(
      subscribe,
      () => (selector ? selector(getState()) : (getState() as unknown as U)),
      () => (selector ? selector(getState()) : (getState() as unknown as U))
    );
  }) as StoreApi<T>;

  useStore.getState = getState;
  useStore.setState = setState;
  useStore.subscribe = subscribe;

  return useStore;
}
