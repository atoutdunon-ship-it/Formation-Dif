# YOSEI-DIF

Nom de code du module : **YOSEI-DIF**.
Dispositif de préparation au Diplôme d'Instructeur Fédéral, spécialité **Yoseikan Budo**.

## Principe

Le DIF n'évalue pas un stock de connaissances, il évalue une **compétence** : concevoir,
animer, planifier et adapter un enseignement. Le site est donc organisé autour de cinq
outils actifs, les modules de connaissances venant en appui — et non l'inverse.

| Outil | Ce qu'il travaille | Objectif DIF couvert |
|---|---|---|
| A — Simulateur d'épreuve | Tirage au sort du thème, chronomètre 30' / 20' / 10' | 1, 3 |
| B — Constructeur de plan de séance | Trame complète, enregistrement, impression | 1 |
| C — Entretien avec le jury | 63 questions classées, chronomètre, éléments attendus | 1, 3, 4, 5 |
| D — Planification de saison | 5 cycles annuels éditables | 2 |
| E — Banque d'exercices | 12 situations filtrables, avec critères et variables | 1, 3 |

## Utilisation

Double-cliquez sur `Demarrer_YOSEI_DIF.command` (macOS) ou `.bat` (Windows),
ou ouvrez directement `indexYoseikan.html`.

Le fichier est **autonome** : aucun serveur, aucune dépendance, fonctionne hors ligne.

## Régénérer le site

```bash
python3 yosei_dif/build.py                    # écrit ../indexYoseikan.html
python3 yosei_dif/build.py --out /chemin.html # sortie personnalisée
```

## Architecture

```
yosei_dif/
├── build.py            générateur (assemblage HTML)
├── style.css           charte : noir + bleu navy + blanc, sans pictogramme
├── app.js              moteur (navigation, quiz, chronos, formulaires, persistance)
├── make_content.py     génère config.json et themes.json
├── make_jury.py        génère jury.json
├── make_outils.py      génère exercices.json, saison.json, plan_modele.json
├── make_modules.py     génère modules.json
├── content/            les données — c'est ici qu'on édite
│   ├── _raw_pages.json          extrait brut du site karaté (source de make_modules.py)
│   └── quiz_tronc_commun.json   idem pour make_quiz.py
└── sources/            déposez ici vos documents officiels
```

Éditer le **contenu** = modifier `content/*.json`, puis relancer `build.py`.
Éditer la **présentation** = modifier `style.css` ou `app.js`, puis relancer `build.py`.

## État du contenu

| Module | Statut |
|---|---|
| 01 — Yoseikan Budo : histoire, filiation, principes | à compléter |
| 02 — Contenu technique Yoseikan Budo | à compléter |
| 03 — Pédagogie et méthodologie | prêt |
| 04 — Environnement fédéral, réglementation, vie du club | prêt |
| 05 — Anatomie, physiologie et sécurité | prêt |
| 06 — Vocabulaire et terminologie | à compléter |

Les modules 01, 02 et 06 sont volontairement laissés en attente de vos **documents
officiels** : programme technique, passages de grade, lexique, textes fédéraux.
Déposez-les dans `sources/`, ils seront intégrés dans `content/modules.json`
et `content/quiz.json`.

## Données personnelles

Plans de séance, planification et progression sont stockés dans le navigateur.
La page **Sauvegarde et restauration** permet d'exporter et de réimporter
l'ensemble au format JSON. Exportez avant tout changement de navigateur ou de machine.

## Réimplantation

Pour décliner ce dispositif vers une autre discipline ou une autre formation :
citez le nom de code **YOSEI-DIF**. Seul `content/` change ; `build.py`, `style.css`
et `app.js` sont indépendants de la discipline.
