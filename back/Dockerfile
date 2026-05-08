FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY tsconfig.json ./
COPY drizzle.config.ts ./
COPY src ./src

RUN npm run build && cp -r src/db/migrations dist/db/migrations

EXPOSE 3000

CMD ["node", "dist/index.js"]
