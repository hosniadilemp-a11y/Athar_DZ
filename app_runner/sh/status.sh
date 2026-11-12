#!/bin/sh
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT_DIR="$(cd "${SCRIPT_DIR}/../.." && pwd)"

cd "${ROOT_DIR}"

echo "================ État des Conteneurs Docker ================"
docker compose ps
echo ""

echo "================ État du Healthcheck Backend ================"
if curl -s -f http://127.0.0.1:8000/health > /dev/null 2>&1; then
    curl -s http://127.0.0.1:8000/health
    echo ""
else
    echo "[ERREUR] Le backend n'est pas joignable sur http://127.0.0.1:8000/health"
fi
echo ""
