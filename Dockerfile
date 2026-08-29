# 1
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

COPY . .
# 2
FROM node:20-alpine AS runner

ENV NODE_ENV=production

WORKDIR /usr/src/app
COPY package*.json ./

RUN npm ci --only=production

COPY --from=builder /usr/src/app/src ./src
COPY --from=builder /usr/src/app/index.js ./index.js

EXPOSE 3000

CMD ["node", "index.js"]