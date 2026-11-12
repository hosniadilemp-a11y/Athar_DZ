#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "${SCRIPT_DIR}/../.." && pwd)"

cd "${ROOT_DIR}"

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}================ État des Conteneurs Docker ================${NC}"
docker compose ps
echo ""

echo -e "${BLUE}================ État du Healthcheck Backend ================${NC}"
if curl -s -f http://127.0.0.1:8000/health > /dev/null 2>&1; then
    HEALTH=$(curl -s http://127.0.0.1:8000/health)
    echo -e "${GREEN}${HEALTH}${NC}"
else
    echo -e "${RED}[ERREUR] Le backend n'est pas joignable sur http://127.0.0.1:8000/health${NC}"
fi
echo ""
