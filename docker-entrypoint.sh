#!/bin/sh
set -e

# ==============================================================================
# Production Docker Entrypoint Script
# Runs database migration/push before starting Next.js standalone server
# ==============================================================================

echo "==> [Entrypoint] Starting application startup sequence..."

# 1. Run database schema sync if DATABASE_URL is configured
if [ -n "$DATABASE_URL" ]; then
  echo "==> [Entrypoint] Checking database connectivity and applying schema..."
  if [ -f "./node_modules/prisma/build/index.js" ]; then
    node ./node_modules/prisma/build/index.js db push --skip-generate || echo "==> [Entrypoint] Warning: prisma db push failed or timed out. Proceeding..."
  fi
else
  echo "==> [Entrypoint] Warning: DATABASE_URL not set. Running in offline/fallback mode."
fi

# 2. Execute primary CMD (typically: node server.js)
echo "==> [Entrypoint] Launching application process: $@"
exec "$@"
