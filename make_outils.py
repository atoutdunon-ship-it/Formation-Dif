# -*- coding: utf-8 -*-
"""YOSEI-DIF — banque d'exercices, trame de saison, modèle de plan de séance."""
import json
from pathlib import Path
C = Path(__file__).parent
def w(n, o):
    (C/n).write_text(json.dumps(o, ensure_ascii=False, indent=1), encoding="utf-8")
    print(f"  {n:22} {len(o)} entrées")

E = lambda i,n,ph,pub,ax,d,org,cr,var,sec: {"id":i,"nom":n,"phase":ph,"publics":pub,"axe":ax,
  "duree":d,"organisation":org,"critere":cr,"variables":var,"securite":sec}
PH = ("Échauffement","Corps de séance","Opposition","Retour au calme")

w("exercices.json", [
 E("EX01","Réveil articulaire orienté",PH[0],["enfants","ados","adapte"],"Préparation","6-8 min",
   "En dispersion, face à l'enseignant, mobilisation descendante ou ascendante complète.",
   "Amplitude complète sans douleur sur chaque articulation sollicitée par la tâche du jour.",
   ["Ajouter un déplacement","Faire mener par un pratiquant","Associer une respiration comptée"],
   "Aucune amplitude forcée ; adapter en cas d'antécédent articulaire."),
 E("EX02","Le miroir",PH[0],["baby","enfants"],"Attention","4-6 min",
   "Par deux, face à face. L'un mène un mouvement lent, l'autre reproduit, puis inversion.",
   "Le suiveur reste synchrone pendant 20 secondes consécutives.",
   ["Fermer les yeux du suiveur un instant","Imposer un thème gestuel","Accélérer le meneur"],
   "Pas de contact ; distance d'un bras tendu."),
 E("EX03","Gestion de la distance aux plots",PH[1],["enfants","ados"],"Distance","8-10 min",
   "Deux lignes de plots matérialisant longue, moyenne et courte distance. Aller-retour sur signal.",
   "Le pratiquant se place à la bonne distance en moins d'une seconde après le signal.",
   ["Signal sonore puis visuel","Ajouter un partenaire mobile","Réduire l'espace disponible"],
   "Espacement latéral d'au moins deux mètres entre binômes."),
 E("EX04","Attaque annoncée, riposte libre",PH[1],["ados"],"Défense","10-12 min",
   "Par deux. L'attaquant annonce sa cible, le défenseur choisit sa réponse dans un répertoire donné.",
   "Trois ripostes différentes réussies sur dix attaques.",
   ["Supprimer l'annonce","Ajouter une deuxième attaque possible","Réduire la distance de départ"],
   "Contrôle obligatoire ; intensité annoncée et vérifiée avant le départ."),
 E("EX05","Chute arrière depuis la position assise",PH[1],["baby","enfants","adapte"],"Chute","8 min",
   "Assis, menton rentré, bras en diagonale, bascule contrôlée puis frappe des bras.",
   "Menton rentré et frappe simultanée des deux bras sur cinq répétitions consécutives.",
   ["Passer accroupi","Puis debout","Ajouter un déséquilibre léger du partenaire"],
   "Un seul rang à la fois ; vérifier l'absence de voisin dans l'axe de chute."),
 E("EX06","Parcours des quatre stations",PH[1],["baby","enfants"],"Motricité","10-12 min",
   "Quatre ateliers de 45 secondes, rotation au signal, groupes de trois maximum.",
   "Chaque pratiquant passe aux quatre stations sans temps d'attente supérieur à 10 secondes.",
   ["Chronométrer","Ajouter une contrainte de latéralité","Introduire un déplacement imposé"],
   "Stations éloignées les unes des autres ; un adulte visible depuis chaque station."),
 E("EX07","Saisie et libération progressive",PH[1],["ados"],"Préhension","10 min",
   "Par deux, saisie du poignet. Trois niveaux : consentie, résistante, dynamique.",
   "Libération obtenue sans force sur le niveau consenti, puis sur le niveau résistant.",
   ["Changer la saisie","Saisie à deux mains","Ajouter un déplacement"],
   "Aucune torsion articulaire ; signal d'arrêt par double frappe."),
 E("EX08","Vagues de déplacement orientées",PH[1],["enfants","ados"],"Mobilité","8 min",
   "Le groupe traverse le tatami par vagues de quatre, cible mobile tenue par l'enseignant.",
   "Orientation du corps maintenue vers la cible sur toute la traversée.",
   ["Changer la cible en cours de traversée","Imposer un changement de direction","Ajouter un temps de frappe"],
   "Sens de circulation unique ; retour par l'extérieur du tatami."),
 E("EX09","Randori à thème imposé",PH[2],["ados"],"Opposition","10-12 min",
   "Opposition souple de 90 secondes avec un seul objectif autorisé, rotation des partenaires.",
   "Le thème imposé apparaît au moins trois fois dans la séquence.",
   ["Limiter les cibles","Imposer un handicap à l'un des deux","Réduire l'espace"],
   "Appariement par gabarit ; intensité annoncée ; protections vérifiées."),
 E("EX10","Le roi du tatami",PH[2],["enfants"],"Opposition","8 min",
   "Zones délimitées, opposition de déséquilibre debout, rotation rapide des adversaires.",
   "Chaque pratiquant réalise au moins six oppositions courtes.",
   ["Réduire la zone","Interdire les saisies hautes","Opposition à genoux"],
   "Pas de projection ; sortie de zone = arrêt immédiat."),
 E("EX11","Retour au calme respiratoire",PH[3],["enfants","ados","adapte","baby"],"Récupération","4-5 min",
   "Assis en cercle, respiration guidée en trois temps, puis rappel de l'objectif de la séance.",
   "Le rythme cardiaque redescend et le groupe reformule l'objectif du jour.",
   ["Étirements légers associés","Faire reformuler par un pratiquant","Annoncer la séance suivante"],
   "Sol non froid ; pas d'étirement passif intense après opposition."),
 E("EX12","Observation croisée par binôme",PH[1],["ados","adapte"],"Évaluation","8-10 min",
   "Un pratique, un observe avec deux critères écrits, puis inversion et retour oral.",
   "L'observateur formule un point réussi et un axe de progrès pour son partenaire.",
   ["Trois critères","Observation par groupe de trois","Auto-évaluation préalable"],
   "Cadrer le retour : factuel, sur le geste, jamais sur la personne."),
])

w("saison.json", [
 {"cycle":"Cycle 1 — Rentrée et remise en route","periode":"Septembre → vacances de Toussaint",
  "objectifs":["Réintégrer les fondamentaux : posture, déplacement, distance",
               "Intégrer les nouveaux pratiquants et poser les rituels du dojo",
               "Évaluer le niveau réel du groupe"],
  "reperes":["Portes ouvertes et séances d'essai","Régularisation des licences et de la situation médicale",
             "Réunion d'information aux familles"]},
 {"cycle":"Cycle 2 — Construction technique","periode":"Toussaint → vacances de Noël",
  "objectifs":["Développer le répertoire technique de la tranche d'âge",
               "Introduire l'opposition aménagée","Installer les règles de contrôle"],
  "reperes":["Stage technique de ligue ou de comité départemental","Premier point d'étape individuel"]},
 {"cycle":"Cycle 3 — Mise en opposition","periode":"Janvier → vacances d'hiver",
  "objectifs":["Transférer la technique en situation d'opposition",
               "Développer la lecture de l'adversaire et le timing","Préparer les échéances compétitives"],
  "reperes":["Compétitions et coupes","Formation continue des cadres"]},
 {"cycle":"Cycle 4 — Approfondissement et armes","periode":"Vacances d'hiver → vacances de printemps",
  "objectifs":["Enrichir le répertoire : liaisons, sol, travail avec matériel",
               "Consolider les acquis sous contrainte","Préparer le programme de passage de grade"],
  "reperes":["Stage de discipline","Inscription aux passages de grade"]},
 {"cycle":"Cycle 5 — Évaluation et valorisation","periode":"Printemps → fin de saison",
  "objectifs":["Valider les acquis de la saison","Passer les grades",
               "Valoriser la progression de chaque pratiquant"],
  "reperes":["Passages de grade","Fête du club et démonstration","Assemblée générale",
             "Bilan pédagogique et projection sur la saison suivante"]},
])

w("plan_modele.json", [
 {"id":"contexte","titre":"Contexte","champs":[
   ["public","Public et effectif","select_public"],["niveau","Niveau et grades","text"],
   ["duree","Durée de la séance","text"],["lieu","Lieu et surface disponible","text"],
   ["materiel","Matériel nécessaire","textarea"]]},
 {"id":"objectif","titre":"Objectif et critères","champs":[
   ["theme","Thème tiré au sort","text"],
   ["objectif","Objectif opérationnel — « à la fin de la séance, le pratiquant est capable de… »","textarea"],
   ["critere","Critère de réussite observable","textarea"],
   ["prerequis","Prérequis supposés","textarea"]]},
 {"id":"securite","titre":"Sécurité","champs":[
   ["risques","Risques identifiés","textarea"],
   ["mesures","Mesures de prévention et consignes d'arrêt","textarea"],
   ["verif","Vérifications avant la séance","textarea"]]},
 {"id":"echauffement","titre":"Échauffement","champs":[
   ["ech_duree","Durée","text"],["ech_contenu","Contenu et lien avec l'objectif","textarea"],
   ["ech_org","Organisation du groupe","textarea"]]},
 {"id":"corps","titre":"Corps de séance","champs":[
   ["s1","Situation 1 — consigne, organisation, critère","textarea"],
   ["s1_var","Situation 1 — variables et différenciation","textarea"],
   ["s2","Situation 2 — consigne, organisation, critère","textarea"],
   ["s2_var","Situation 2 — variables et différenciation","textarea"],
   ["s3","Situation 3 — mise en opposition ou application","textarea"],
   ["s3_var","Situation 3 — variables et différenciation","textarea"]]},
 {"id":"retour","titre":"Retour au calme et bilan","champs":[
   ["rac","Contenu du retour au calme","textarea"],
   ["bilan","Bilan avec le groupe et lien avec la séance suivante","textarea"]]},
 {"id":"regulation","titre":"Régulation et plan B","champs":[
   ["planb","Plan B si la situation ne fonctionne pas","textarea"],
   ["diff","Adaptation pour un pratiquant en difficulté","textarea"],
   ["avance","Adaptation pour un pratiquant en avance","textarea"]]},
])
