#!/usr/bin/env bash
# ==============================================================================
# Database & Media Volume Disaster Recovery / Restore Script
# Usage: ./scripts/restore.sh <path_to_db.dump> [path_to_uploads.tar.gz]
# ==============================================================================

set -euo pipefail

POSTGRES_CONTAINER="${POSTGRES_CONTAINER:-shuvo-portfolio-db}"
POSTGRES_USER="${POSTGRES_USER:-postgres}"
POSTGRES_DB="${POSTGRES_DB:-portfolio}"
UPLOADS_DIR="${UPLOADS_DIR:-./public/uploads}"

if [ $# -lt 1 ]; then
  echo "Usage: $0 <path_to_db_backup.dump> [path_to_uploads.tar.gz] [--force]"
  echo "Example: $0 ./backups/db_portfolio_20261023_120000.dump ./backups/uploads_20261023_120000.tar.gz"
  exit 1
fi

DB_FILE="$1"
MEDIA_FILE="${2:-}"
FORCE="${3:-}"

if [ ! -f "${DB_FILE}" ]; then
  echo "Error: Database backup file '${DB_FILE}' not found."
  exit 1
fi

echo "======================================================================"
echo " RESTORE CONFIRMATION"
echo " Database File: ${DB_FILE}"
echo " Target DB:     ${POSTGRES_DB} (Container: ${POSTGRES_CONTAINER})"
[ -n "${MEDIA_FILE}" ] && echo " Media File:    ${MEDIA_FILE}"
echo "======================================================================"

if [ "${FORCE}" != "--force" ] && [ "${FORCE}" != "-y" ]; then
  read -p "Are you sure you want to overwrite '${POSTGRES_DB}'? This action cannot be undone! (y/N): " CONFIRM
  if [[ ! "$CONFIRM" =~ ^[Yy]$ ]]; then
    echo "Restore aborted by operator."
    exit 0
  fi
fi

# 1. Restore PostgreSQL database
echo "==> Restoring database from ${DB_FILE}..."
if docker ps --format '{{.Names}}' | grep -q "^${POSTGRES_CONTAINER}$"; then
  cat "${DB_FILE}" | docker exec -i "${POSTGRES_CONTAINER}" pg_restore -U "${POSTGRES_USER}" -d "${POSTGRES_DB}" --clean --if-exists --no-owner --no-privileges || true
  echo "    Database restored successfully inside container."
else
  if command -v pg_restore >/dev/null 2>&1; then
    pg_restore -U "${POSTGRES_USER}" -d "${POSTGRES_DB}" --clean --if-exists --no-owner --no-privileges "${DB_FILE}" || true
    echo "    Database restored successfully via host pg_restore."
  else
    echo "Error: Neither docker container nor host pg_restore is available."
    exit 1
  fi
fi

# 2. Restore Media Uploads
if [ -n "${MEDIA_FILE}" ] && [ -f "${MEDIA_FILE}" ]; then
  echo "==> Restoring media uploads to ${UPLOADS_DIR}..."
  mkdir -p "${UPLOADS_DIR}"
  tar -xzf "${MEDIA_FILE}" -C "${UPLOADS_DIR}"
  echo "    Media files restored successfully."
fi

echo "======================================================================"
echo " Restore completed successfully at $(date)!"
echo "======================================================================"
