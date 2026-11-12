#!/usr/bin/env bash
set -euo pipefail

# Athar DZ — Démarrage de la Plateforme (Bash)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "${SCRIPT_DIR}/../.." && pwd)"

cd "${ROOT_DIR}"

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}======================================================${NC}"
echo -e "${BLUE}        Athar DZ (أثر) — Démarrage du Studio          ${NC}"
echo -e "${BLUE}======================================================${NC}"

# 1. Vérification des prérequis Docker
if ! command -v docker &> /dev/null; then
    echo -e "${RED}[ERREUR] Docker n'est pas installé ou n'est pas dans le PATH.${NC}"
    exit 1
fi

if ! docker compose version &> /dev/null; then
    echo -e "${RED}[ERREUR] 'docker compose' (V2) n'est pas disponible.${NC}"
    exit 1
fi

# 2. Vérification du fichier d'environnement .env
if [ ! -f .env ]; then
    echo -e "${YELLOW}[INFO] Fichier .env absent. Création depuis .env.example...${NC}"
    cp .env.example .env
fi

# 3. Lancement des conteneurs
echo -e "${BLUE}[1/3] Démarrage des conteneurs Docker...${NC}"
docker compose up -d "$@"

# 4. Attente active de la disponibilité des services (Healthcheck)
echo -e "${BLUE}[2/3] Vérification de la disponibilité du backend et des bases de données...${NC}"
MAX_RETRIES=40
COUNT=0
HEALTHY=false

while [ $COUNT -lt $MAX_RETRIES ]; do
    if curl -s -f http://127.0.0.1:8000/health > /dev/null 2>&1; then
        STATUS=$(curl -s http://127.0.0.1:8000/health | grep -o '"status":"[^"]*"' | cut -d'"' -f4 || echo "error")
        if [ "$STATUS" = "ok" ]; then
            HEALTHY=true
            break
        fi
    fi
    COUNT=$((COUNT + 1))
    echo -n "."
    sleep 2
done
echo ""

if [ "$HEALTHY" = true ]; then
    echo -e "${GREEN}[3/3] Tous les services sont opérationnels et prêts !${NC}"
    echo ""
    echo -e "${GREEN}======================================================${NC}"
    echo -e "${GREEN}       Plateforme Athar démarrée avec succès          ${NC}"
    echo -e "${GREEN}======================================================${NC}"
    echo -e "  - Studio Web (Frontend) : ${BLUE}http://localhost:5173${NC}"
    echo -e "  - Documentation API REST : ${BLUE}http://localhost:8000/docs${NC}"
    echo -e "  - Contrôle Santé        : ${BLUE}http://localhost:8000/health${NC}"
    echo -e "  - Console Graphe Neo4j  : ${BLUE}http://localhost:7474${NC}"
    echo ""
    echo -e "Pour afficher les journaux d'activité en temps réel : ${YELLOW}./app_runner/bash/logs.bash${NC}"
    echo -e "Pour lancer les tests automatisés :                   ${YELLOW}./app_runner/bash/test.bash${NC}"
    echo -e "Pour arrêter la plateforme :                          ${YELLOW}./app_runner/bash/stop.bash${NC}"
else
    echo -e "${RED}[AVERTISSEMENT] Les conteneurs tournent mais le point /health n'a pas répondu OK dans les délais.${NC}"
    echo -e "${YELLOW}Vérifiez les logs avec : ./app_runner/bash/logs.bash${NC}"
fi
