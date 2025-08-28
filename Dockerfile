# Multi-stage build for Next.js (web) and Express API (api)

# ---------- Base Node image ----------
FROM node:20-alpine AS base
WORKDIR /app

# ---------- Build Next.js (web) ----------
FROM base AS web-build
WORKDIR /app/web
COPY web/package*.json ./
RUN npm ci
COPY web .
RUN npm run build && npm prune --omit=dev

# ---------- Install API (api) ----------
FROM base AS api-install
WORKDIR /app/api
COPY api/package*.json ./
RUN npm ci --omit=dev
COPY api .

# ---------- Runtime image ----------
FROM node:20-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production

# Create non-root user
RUN addgroup -S app && adduser -S app -G app

# Copy built web and installed api
# /app/web: .next, node_modules, package.json etc.
COPY --from=web-build /app/web /app/web
COPY --from=api-install /app/api /app/api

# Expose ports
# 3000 -> Next.js server; 4000 -> Express API
EXPOSE 3000 4000

# Simple process manager using a tiny JS script to start both servers
# We could use dumb-init or supervisord, but to keep dependencies minimal,
# we use a node script as the container's main process.
COPY tools /app/tools

# Startup script
COPY <<'EOF' /app/start.js
import { spawn } from 'node:child_process';

function run(cmd, args, cwd, name) {
  const child = spawn(cmd, args, { cwd, stdio: 'inherit', env: process.env });
  child.on('exit', (code) => {
    console.log(`${name} exited with code ${code}`);
    process.exit(code || 0);
  });
  return child;
}

// Start API first, then Next after a short delay
run('node', ['server.js'], '/app/api', 'api');
setTimeout(() => {
  run('node', ['node_modules/next/dist/bin/next', 'start', '-p', '3000'], '/app/web', 'web');
}, 500);

// Keep process alive
setInterval(() => {}, 1 << 30);
EOF

CMD ["node", "/app/start.js"]
