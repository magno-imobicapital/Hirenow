FROM node:22-alpine AS base
WORKDIR /app

# ── deps ──
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

# ── build ──
FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ARG API_URL
ENV API_URL=$API_URL

RUN npm run build

# ── prod ──
FROM base AS runner
ENV NODE_ENV=production

COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static
COPY --from=build /app/public ./public

EXPOSE 3000
CMD ["node", "server.js"]
