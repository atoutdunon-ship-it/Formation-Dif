# Les polices du site

Ce dossier est prévu pour recevoir les fichiers de police du site.

## Pourquoi

Le site chargeait auparavant ses polices depuis les serveurs de Google. Ce
seul chargement transmettait à Google l'adresse IP de chaque visiteur, avant
tout consentement et sans qu'il en soit averti. Plusieurs juridictions
européennes ont jugé cette pratique contraire au RGPD.

Cet appel a été supprimé. **Le site ne transmet plus aucune donnée de
visiteur à un tiers.**

## Le site fonctionne déjà

Tant que ce dossier reste vide, le site s'affiche avec les polices présentes
sur l'ordinateur du visiteur : Georgia pour les titres, la police d'interface
du système pour le texte. C'est élégant, universel, et instantané.

**Vous n'avez donc rien d'obligatoire à faire.** Ce qui suit sert uniquement
à retrouver l'aspect exact d'origine.

## Retrouver les polices d'origine

1. Rendez-vous sur **gwfh.mranftl.com** (Google Webfonts Helper), un outil
   qui prépare les fichiers prêts à héberger.

2. Cherchez **Open Sans**. Dans « Select charsets », cochez `latin`. Dans
   « Select styles », cochez les graisses **300, 400, 600 et 700**.
   Téléchargez, puis décompressez.

3. Recommencez avec **Playfair Display**, charset `latin`, graisses **500**
   et **600**.

4. Renommez les fichiers `.woff2` obtenus et déposez-les ici :

   | Fichier attendu | Provenance |
   |---|---|
   | `open-sans-300.woff2` | Open Sans, graisse 300 |
   | `open-sans-400.woff2` | Open Sans, graisse 400 (regular) |
   | `open-sans-600.woff2` | Open Sans, graisse 600 |
   | `open-sans-700.woff2` | Open Sans, graisse 700 |
   | `playfair-display-500.woff2` | Playfair Display, graisse 500 |
   | `playfair-display-600.woff2` | Playfair Display, graisse 600 |

   Seuls les fichiers `.woff2` sont nécessaires. Tous les navigateurs en
   service aujourd'hui les lisent. Ignorez les `.woff`, `.ttf` et `.eot`.

5. Envoyez le dossier `assets` sur GitHub comme d'habitude, puis rechargez
   avec **Cmd + Maj + R**.

Faites de même dans `asso-core/static/fonts/` pour l'espace membre, qui
utilise en plus **Inter** (graisses 400, 500, 600).

## Licence

Open Sans, Playfair Display et Inter sont diffusées sous licence SIL Open
Font License 1.1. Elles peuvent être hébergées, redistribuées et utilisées
commercialement sans redevance. Conservez le fichier `OFL.txt` fourni dans
chaque archive téléchargée : la licence impose de le joindre.
