# 1
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build
# 2
FROM node:20-alpine AS runner

ENV NODE_ENV=production

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci --include=dev

COPY --from=builder /usr/src/app/dist ./dist

EXPOSE 3000

CMD ["npm", "start"]