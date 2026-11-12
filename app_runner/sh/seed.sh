#!/bin/sh
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT_DIR="$(cd "${SCRIPT_DIR}/../.." && pwd)"

cd "${ROOT_DIR}"

echo "Exécution / vérification de l'injection du cas judiciaire 'Candy Wheels'..."
docker exec athar-backend python -m app.db.seed

echo "Opération de seed terminée avec succès (idempotente)."
