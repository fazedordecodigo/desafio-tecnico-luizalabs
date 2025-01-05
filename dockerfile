FROM node:22-alpine AS builder

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./
RUN npm ci --omit=dev

COPY . .

RUN npm run build
RUN npx prisma generate

FROM node:22-alpine@sha256:6e80991f69cc7722c561e5d14d5e72ab47c0d6b6cfb3ae50fb9cf9a7b30fdf97

WORKDIR /app
ENV NODE_ENV production
RUN apk add dumb-init
USER node
COPY --chown=node:node --from=builder /app/node_modules ./node_modules
COPY --chown=node:node --from=builder /app/dist ./dist
COPY --chown=node:node --from=builder /app/package.json ./

EXPOSE 3000
CMD ["dumb-init", "node", "dist/main"]
