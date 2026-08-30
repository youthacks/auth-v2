FROM node:24-slim AS base

# Build dependencies
FROM base AS deps
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml* ./
RUN corepack enable pnpm && pnpm install --frozen-lockfile

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build the application
RUN corepack enable pnpm
RUN pnpm build

# Production image, copy all the files and run the server
FROM node:24-slim AS runner
WORKDIR /app

ENV NODE_ENV=production

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nodejs

# Copy only necessary files
COPY --from=builder /app/.output ./.output

# Expose the port the app will run on
EXPOSE 3000

USER nodejs

# Start the Node.js server
CMD ["node", ".output/server/index.mjs"]