# YOSEI-DIF

Nom de code : **YOSEI-DIF**.
Préparation au Diplôme d'Instructeur Fédéral, spécialité **Yoseikan Budo**.

## Un seul dossier, un seul niveau

Tous les fichiers sont à plat. Aucun sous-dossier. Pour mettre en ligne :
ouvrir le dossier, **Cmd + A**, glisser dans GitHub. Une seule opération.

| Fichier | Rôle |
|---|---|
| `index.html` | **le site**, complet et autonome — c'est ce que GitHub publie |
| `.nojekyll` | fichier vide requis par GitHub Pages |
| `build.py` | reconstruit `index.html` |
| `style.css` | charte : noir + bleu navy + blanc |
| `app.js` | moteur applicatif |
| `*.json` | les données — c'est ici qu'on édite le contenu |
| `make_*.py` | scripts de production des données |
| `Ouvrir-le-site.command` / `.bat` | ouvrir le site en local |
| `Regenerer-le-site.command` | reconstruire après modification |

`index.html` est **autonome** : ni serveur, ni dépendance, fonctionne hors ligne.
CSS et JavaScript y sont intégrés — `style.css` et `app.js` ne servent qu'à la
reconstruction, jamais à l'affichage.

## Mettre en ligne sur GitHub Pages

1. Créer un dépôt sur GitHub.
2. **Add file → Upload files**, puis glisser tout le contenu du dossier.
3. **Settings → Pages → Source : Deploy from a branch → `main` / `(root)`**.

Le site est en ligne en une à deux minutes.

Aucun workflow, aucune configuration : `index.html` et `.nojekyll` sont à la
racine, c'est exactement ce qu'attend GitHub Pages.

### Le fichier `.nojekyll`

Vide, au nom **imposé** — le renommer le rend inopérant. Il neutralise le
moteur Jekyll de GitHub, qui sinon ignore les fichiers commençant par `_`.

Commençant par un point, il est masqué par le Finder. **Cmd + Maj + .** l'affiche
(le même raccourci le remasque). **Affichez-le avant de faire Cmd + A**, sinon il
ne sera pas sélectionné et ne partira pas sur GitHub.

## Modifier le contenu

On n'édite jamais `index.html` à la main : il est régénéré et vos modifications
seraient perdues.

| Je veux changer… | J'édite… |
|---|---|
| les thèmes de tirage au sort | `themes.json` |
| les questions du jury | `jury.json` |
| la banque d'exercices | `exercices.json` |
| les cycles de la saison | `saison.json` |
| la trame du plan de séance | `plan_modele.json` |
| le contenu des modules | `modules.json` |
| les quiz | `quiz.json` |
| l'apparence | `style.css` |
| le comportement | `app.js` |

Puis double-clic sur `Regenerer-le-site.command`, ou :

```bash
python3 build.py
```

`config.json` porte les réglages généraux. `extrait_pages_karate.json`,
`quiz_tronc_commun.json` et `fiches_tronc_commun.json` sont des extraits
techniques alimentant `make_modules.py` et `make_quiz.py` : ne pas les éditer.

## Le dispositif pédagogique

Le DIF n'évalue pas un stock de connaissances mais une **compétence** : concevoir,
animer, planifier et adapter un enseignement. Le site est donc organisé autour de
cinq outils actifs, les modules de connaissances venant en appui.

| Outil | Ce qu'il travaille | Objectif DIF |
|---|---|---|
| A — Simulateur d'épreuve | 16 thèmes tirés au sort, chronomètre 30′ / 20′ / 10′ | 1, 3 |
| B — Constructeur de plan de séance | 7 blocs, 24 champs, export imprimable | 1 |
| C — Entretien avec le jury | 63 questions en 7 domaines, éléments attendus | 1, 3, 4, 5 |
| D — Planification de saison | 5 cycles annuels éditables | 2 |
| E — Banque d'exercices | 12 situations filtrables, critères et variables | 1, 3 |

## État du contenu

| Module | Statut |
|---|---|
| 01 — Yoseikan Budo : histoire, filiation, principes | à compléter |
| 02 — Contenu technique Yoseikan Budo | à compléter |
| 03 — Pédagogie et méthodologie | prêt |
| 04 — Environnement fédéral, réglementation, vie du club | prêt |
| 05 — Anatomie, physiologie et sécurité | prêt |
| 06 — Vocabulaire et terminologie | à compléter |

Les modules 01, 02 et 06 attendent vos documents officiels : programme technique,
passages de grade, lexique, textes fédéraux.

## Données personnelles

Plans de séance, planification et progression sont stockés dans le navigateur.
La page **Sauvegarde et restauration** du site permet de tout exporter et
réimporter au format JSON. Exportez avant tout changement de navigateur.

## Réimplantation

Pour décliner ce dispositif vers une autre discipline ou une autre formation :
citez le nom de code **YOSEI-DIF**. Seuls les `.json` changent ; `build.py`,
`style.css` et `app.js` sont indépendants de la discipline.
