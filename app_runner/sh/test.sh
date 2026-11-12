#!/bin/sh
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT_DIR="$(cd "${SCRIPT_DIR}/../.." && pwd)"

cd "${ROOT_DIR}"

echo "======================================================"
echo "         Exécution de la Suite de Tests Athar         "
echo "======================================================"

echo ""
echo "[1/5] Tests Backend (Pytest)..."
docker exec athar-backend pytest -v

echo ""
echo "[2/5] Analyse Statique Backend (Ruff)..."
docker exec -u root athar-backend ruff check app tests

echo ""
echo "[3/5] Typage Strict Backend (Mypy)..."
docker exec -u root athar-backend mypy app

echo ""
echo "[4/5] Typage & Lint Frontend (TypeScript & ESLint)..."
docker exec athar-frontend npm run typecheck
docker exec athar-frontend npm run lint

echo ""
echo "[5/5] Tests Frontend (Vitest)..."
docker exec athar-frontend npm test

echo ""
echo "======================================================"
echo "     TOUS LES TESTS ONT RÉUSSI AVEC SUCCÈS (38/38)    "
echo "======================================================"
