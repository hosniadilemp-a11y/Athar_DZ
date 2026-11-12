#!/bin/sh
set -e

# Athar DZ — Démarrage de la Plateforme (POSIX sh)
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT_DIR="$(cd "${SCRIPT_DIR}/../.." && pwd)"

cd "${ROOT_DIR}"

echo "======================================================"
echo "        Athar DZ (أثر) — Démarrage du Studio          "
echo "======================================================"

# 1. Vérification des prérequis Docker
if ! command -v docker > /dev/null 2>&1; then
    echo "[ERREUR] Docker n'est pas installé ou n'est pas dans le PATH."
    exit 1
fi

if ! docker compose version > /dev/null 2>&1; then
    echo "[ERREUR] 'docker compose' (V2) n'est pas disponible."
    exit 1
fi

# 2. Vérification du fichier d'environnement .env
if [ ! -f .env ]; then
    echo "[INFO] Fichier .env absent. Création depuis .env.example..."
    cp .env.example .env
fi

# 3. Lancement des conteneurs
echo "[1/3] Construction et démarrage des conteneurs Docker..."
docker compose up -d --build

# 4. Attente active de la disponibilité des services (Healthcheck)
echo "[2/3] Vérification de la disponibilité du backend..."
MAX_RETRIES=40
COUNT=0
HEALTHY=0

while [ "$COUNT" -lt "$MAX_RETRIES" ]; do
    if curl -s -f http://127.0.0.1:8000/health > /dev/null 2>&1; then
        HEALTHY=1
        break
    fi
    COUNT=$((COUNT + 1))
    printf "."
    sleep 2
done
echo ""

if [ "$HEALTHY" -eq 1 ]; then
    echo "[3/3] Tous les services sont opérationnels !"
    echo ""
    echo "======================================================"
    echo "       Plateforme Athar démarrée avec succès          "
    echo "======================================================"
    echo "  - Studio Web (Frontend) : http://localhost:5173"
    echo "  - Documentation API     : http://localhost:8000/docs"
    echo "  - Contrôle Santé        : http://localhost:8000/health"
    echo "  - Console Graphe Neo4j  : http://localhost:7474"
    echo ""
    echo "Pour voir les logs :   sh ./app_runner/sh/logs.sh"
    echo "Pour lancer les tests: sh ./app_runner/sh/test.sh"
    echo "Pour arrêter :         sh ./app_runner/sh/stop.sh"
else
    echo "[AVERTISSEMENT] Le service n'a pas répondu à temps."
    echo "Consultez les logs avec : sh ./app_runner/sh/logs.sh"
fi
