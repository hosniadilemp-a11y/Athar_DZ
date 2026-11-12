FROM node:20-alpine

WORKDIR /app

ENV NODE_OPTIONS="--dns-result-order=ipv4first"

COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

COPY . .
RUN chown -R node:node /app

USER node

EXPOSE 5173

CMD ["npm", "run", "dev"]
