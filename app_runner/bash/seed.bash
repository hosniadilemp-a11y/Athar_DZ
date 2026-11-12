#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "${SCRIPT_DIR}/../.." && pwd)"

cd "${ROOT_DIR}"

GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}Exécution / vérification de l'injection du cas judiciaire 'Candy Wheels'...${NC}"
docker exec athar-backend python -m app.db.seed

echo -e "${GREEN}Opération de seed terminée avec succès (idempotente).${NC}"
