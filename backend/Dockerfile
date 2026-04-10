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
RUN npx prisma generate && npm run build

# ── prod ──
FROM base AS runner
ENV NODE_ENV=production

COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/libs/shared/src/database/generated ./libs/shared/src/database/generated
COPY --from=build /app/libs/shared/src/mail/templates ./libs/shared/src/mail/templates
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/apps/api/src/modules/positions/extract-pdf-text.js ./apps/api/src/modules/positions/extract-pdf-text.js
COPY package.json ./

EXPOSE 4000
CMD ["node", "dist/apps/api/main.js"]
