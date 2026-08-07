#!/bin/bash
cd "$(dirname "$0")"
echo ""; echo "  Régénération de index.html..."; echo ""
python3 build.py || { read -p "  Échec. Entrée..."; exit 1; }
echo ""; read -p "  Terminé. Entrée pour fermer..."
