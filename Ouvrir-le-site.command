#!/bin/bash
cd "$(dirname "$0")"
[ -f index.html ] || { echo "  index.html absent. Lancez Regenerer-le-site.command"; read -p "  Entrée..."; exit 1; }
open index.html
