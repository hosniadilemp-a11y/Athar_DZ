# Athar DZ — Guide de Démarrage & Exécution (Shell & Bash)

Ce dossier contient tous les scripts nécessaires pour exécuter, tester, surveiller et arrêter la plateforme forensique **Athar (v0.1)**.

---

## 📁 Structure du Dossier

```text
app_runner/
├── README.md           # Ce guide complet d'utilisation
├── bash/               # Scripts optimisés pour Bash (avec couleurs et vérifications avancées)
│   ├── start.bash      # Lance la pile complète et attend que les services soient opérationnels
│   ├── stop.bash       # Arrête proprement les conteneurs Docker
│   ├── status.bash     # Affiche l'état des conteneurs et les healthchecks
│   ├── test.bash       # Exécute tous les tests automatisés (Backend 32 tests + Frontend 6 tests)
│   ├── seed.bash       # Réinjecte/vérifie le cas de référence judiciaire (100 nœuds)
│   └── logs.bash       # Affiche les journaux d'exécution en temps réel
└── sh/                 # Scripts conformes au standard POSIX /bin/sh (portabilité maximale)
    ├── start.sh        # Démarrage de la pile
    ├── stop.sh         # Arrêt de la pile
    ├── status.sh       # Vérification de l'état
    ├── test.sh         # Exécution de la suite de tests
    ├── seed.sh         # Exécution du seed
    └── logs.sh         # Suivi des logs
```

---

## 🚀 Utilisation Rapide

### Option 1 : Utilisation avec Bash (Recommandé)

```bash
# 1. Rendre les scripts exécutables (déjà fait)
chmod +x app_runner/bash/*.bash

# 2. Démarrer l'application
./app_runner/bash/start.bash

# 3. Vérifier le statut
./app_runner/bash/status.bash

# 4. Lancer les tests
./app_runner/bash/test.bash

# 5. Consulter les logs en continu
./app_runner/bash/logs.bash

# 6. Arrêter l'application
./app_runner/bash/stop.bash
```

---

### Option 2 : Utilisation avec le shell POSIX `sh`

```bash
# 1. Rendre les scripts exécutables
chmod +x app_runner/sh/*.sh

# 2. Démarrer l'application
sh ./app_runner/sh/start.sh

# 3. Vérifier le statut
sh ./app_runner/sh/status.sh

# 4. Lancer les tests
sh ./app_runner/sh/test.sh

# 5. Arrêter l'application
sh ./app_runner/sh/stop.sh
```

---

## 🌐 Adresses des Services après Démarrage

Une fois le script `start` terminé avec succès :
- **Studio Visuel d'Enquête** : [http://localhost:5173](http://localhost:5173)
- **Documentation API Backend (Swagger)** : [http://localhost:8000/docs](http://localhost:8000/docs)
- **Point de Contrôle Santé (Healthcheck)** : [http://localhost:8000/health](http://localhost:8000/health)
- **Console d'Exploration Neo4j** : [http://localhost:7474](http://localhost:7474)
- **Base PostGIS / TimescaleDB** : `localhost:5432` (`user: athar_admin`, `db: athar_forensics`)
- **Serveur de Cache Redis** : `localhost:6379`
