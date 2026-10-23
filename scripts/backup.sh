#!/usr/bin/env bash
# ==============================================================================
# Database & Media Volume Automated Backup Script
# Usage: ./scripts/backup.sh
# Retention: 7 days by default (configurable via RETENTION_DAYS)
# ==============================================================================

set -euo pipefail

# Configuration with environment variable overrides
POSTGRES_CONTAINER="${POSTGRES_CONTAINER:-shuvo-portfolio-db}"
POSTGRES_USER="${POSTGRES_USER:-postgres}"
POSTGRES_DB="${POSTGRES_DB:-portfolio}"
BACKUP_DIR="${BACKUP_DIR:-./backups}"
UPLOADS_DIR="${UPLOADS_DIR:-./public/uploads}"
RETENTION_DAYS="${RETENTION_DAYS:-7}"

TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
DB_BACKUP_FILE="${BACKUP_DIR}/db_${POSTGRES_DB}_${TIMESTAMP}.dump"
MEDIA_BACKUP_FILE="${BACKUP_DIR}/uploads_${TIMESTAMP}.tar.gz"

echo "======================================================================"
echo " Starting Portfolio Backup: $(date)"
echo " Database: ${POSTGRES_DB} (Container: ${POSTGRES_CONTAINER})"
echo " Target Directory: ${BACKUP_DIR}"
echo "======================================================================"

mkdir -p "${BACKUP_DIR}"

# 1. Database Backup via pg_dump (Custom compressed format -Fc)
echo "==> Dumping PostgreSQL database..."
if docker ps --format '{{.Names}}' | grep -q "^${POSTGRES_CONTAINER}$"; then
  docker exec -t "${POSTGRES_CONTAINER}" pg_dump -U "${POSTGRES_USER}" -d "${POSTGRES_DB}" -Fc > "${DB_BACKUP_FILE}"
  echo "    Database backup saved: ${DB_BACKUP_FILE} ($(du -h "${DB_BACKUP_FILE}" | cut -f1))"
else
  echo "    Warning: Docker container '${POSTGRES_CONTAINER}' not running."
  if command -v pg_dump >/dev/null 2>&1; then
    echo "    Attempting host pg_dump fallback..."
    pg_dump -U "${POSTGRES_USER}" -d "${POSTGRES_DB}" -Fc > "${DB_BACKUP_FILE}"
    echo "    Host pg_dump backup saved: ${DB_BACKUP_FILE}"
  else
    echo "    Error: Cannot dump database. Neither container nor host pg_dump is accessible."
    exit 1
  fi
fi

# 2. Uploads / Media Volume Backup
if [ -d "${UPLOADS_DIR}" ] && [ "$(ls -A "${UPLOADS_DIR}" 2>/dev/null)" ]; then
  echo "==> Archiving media uploads directory..."
  tar -czf "${MEDIA_BACKUP_FILE}" -C "${UPLOADS_DIR}" .
  echo "    Media backup saved: ${MEDIA_BACKUP_FILE} ($(du -h "${MEDIA_BACKUP_FILE}" | cut -f1))"
else
  echo "    Media uploads directory is empty or missing; skipping tar archive."
fi

# 3. Apply Retention Policy
echo "==> Enforcing retention policy: deleting backups older than ${RETENTION_DAYS} days..."
find "${BACKUP_DIR}" -type f \( -name "db_*.dump" -o -name "uploads_*.tar.gz" \) -mtime "+${RETENTION_DAYS}" -exec rm -f {} \; -print || true

echo "======================================================================"
echo " Backup successfully completed at $(date)"
echo "======================================================================"
