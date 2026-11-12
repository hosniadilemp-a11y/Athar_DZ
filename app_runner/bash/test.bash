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

echo -e "${BLUE}======================================================${NC}"
echo -e "${BLUE}         Exécution de la Suite de Tests Athar         ${NC}"
echo -e "${BLUE}======================================================${NC}"

echo -e "\n${BLUE}[1/5] Tests Backend (Pytest — 32 tests)...${NC}"
docker exec athar-backend pytest -v

echo -e "\n${BLUE}[2/5] Analyse Statique Backend (Ruff)...${NC}"
docker exec -u root athar-backend ruff check app tests

echo -e "\n${BLUE}[3/5] Typage Strict Backend (Mypy)...${NC}"
docker exec -u root athar-backend mypy app

echo -e "\n${BLUE}[4/5] Typage & Lint Frontend (TypeScript & ESLint)...${NC}"
docker exec athar-frontend npm run typecheck
docker exec athar-frontend npm run lint

echo -e "\n${BLUE}[5/5] Tests Frontend (Vitest)...${NC}"
docker exec athar-frontend npm test

echo ""
echo -e "${GREEN}======================================================${NC}"
echo -e "${GREEN}     TOUS LES TESTS ONT RÉUSSI AVEC SUCCÈS (38/38)    ${NC}"
echo -e "${GREEN}======================================================${NC}"
