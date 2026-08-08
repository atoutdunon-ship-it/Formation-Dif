# -*- coding: utf-8 -*-
"""YOSEI-DIF — plans de séance au format officiel FFKDA (UF1c), rédigés nativement.

Chaque séquence porte un OBJECTIF POURSUIVI univoque, construit en deux temps :
ce que l'élève doit faire, puis comment il doit le faire. La colonne organisation
reprend l'énumération exacte de la fiche : matériel, critères de réalisation
technique, rapidité et puissance, intensité de l'effort, temps de récupération.
"""
import json
from pathlib import Path
C = Path(__file__).parent

def L(minutage, objectifs, exercices, organisation, critere="", variables=None):
    return {"minutage": minutage, "objectifs": objectifs, "exercices": exercices,
            "organisation": organisation, "critere": critere, "variables": variables or []}

PLANS = {}

# ══════════════════════════════════════════ CO1 — Enfants / ma-ai — 50 min
PLANS["CO1"] = [
 L("0 – 4′ (4 min)",
   "Entrer sur le tatami et saluer selon le rituel du dojo, en moins de trente secondes et sans rappel de l'enseignant.",
   "Entrée en file par le bord du tatami, alignement face à l'enseignant, salut collectif. Annonce de l'objectif du jour en une phrase, puis reformulation demandée à un enfant.",
   "<b>Matériel :</b> aucun. <b>Dispositif :</b> une ligne face à l'enseignant, tatami entièrement dégagé. "
   "<b>Critères de réalisation :</b> alignement tenu, silence obtenu, salut simultané. "
   "<b>Intensité :</b> nulle. <b>Récupération :</b> sans objet. "
   "<b>Sécurité :</b> contrôle des ongles et retrait des bijoux réalisé pendant l'alignement ; effectif compté à voix haute.",
   "Tout le groupe est aligné et salue en même temps ; un enfant reformule l'objectif.",
   ["Faire mener le comptage par un enfant"]),
 L("4 – 10′ (6 min)",
   "Élever sa température corporelle et mobiliser l'ensemble de ses articulations, en suivant le rythme annoncé, jusqu'à un essoufflement léger.",
   "Course en dispersion sur le tatami avec changements de sens au signal, puis mobilisation articulaire descendante réalisée sur place : nuque, épaules, coudes, poignets, bassin, genoux, chevilles.",
   "<b>Matériel :</b> aucun. <b>Dispositif :</b> dispersion libre, enseignant au centre et tournant sur lui-même pour voir tout le groupe. "
   "<b>Critères de réalisation :</b> amplitude complète sans à-coup, regard levé pendant la course. "
   "<b>Rapidité et puissance :</b> allure de footing, jamais de sprint. <b>Intensité :</b> faible à modérée. "
   "<b>Récupération :</b> continue, aucun arrêt. <b>Sécurité :</b> sens de circulation libre mais interdiction de couper la trajectoire d'un camarade.",
   "Chaque enfant mobilise toutes les articulations sans douleur et présente un essoufflement léger.",
   ["Ajouter un signal d'arrêt", "Imposer un déplacement latéral"]),
 L("10 – 16′ (6 min)",
   "Se figer à une distance annoncée d'un camarade — un bras, deux bras, hors de portée — en moins de deux secondes après le signal.",
   "Déplacements libres en dispersion. Au signal de la voix, l'enseignant annonce une distance ; chaque enfant se place aussitôt à cette distance du camarade le plus proche, bras tendu pour vérifier.",
   "<b>Matériel :</b> aucun. <b>Dispositif :</b> dispersion sur toute la surface, densité maximale de 1 enfant pour 6 m². "
   "<b>Critères de réalisation :</b> vérification par le bras tendu, appuis stables au moment de l'arrêt, regard sur le partenaire. "
   "<b>Rapidité :</b> arrêt franc, sans glissade. <b>Intensité :</b> modérée. <b>Récupération :</b> 10 s entre deux annonces. "
   "<b>Sécurité :</b> aucun contact ; en cas de doute sur la distance, l'enfant recule plutôt qu'il n'avance.",
   "8 placements corrects sur 10 annonces, vérifiés bras tendu.",
   ["Signal visuel au lieu de sonore", "Réduire l'espace disponible", "Interdire de reculer"]),
 L("16 – 25′ (9 min)",
   "Se placer dans la zone correspondant à la distance annoncée par l'enseignant, face à un partenaire immobile, sans franchir la ligne de plots.",
   "Trois zones matérialisées par des plots : loin (hors de portée), moyenne (touche avec un pas), près (touche sans bouger). L'enseignant annonce une zone, l'enfant s'y place par rapport à son partenaire. Rôles fixes 4 minutes, puis inversion.",
   "<b>Matériel :</b> 12 plots, 2 par binôme. <b>Dispositif :</b> binômes appariés par gabarit, alignés sur deux rangs espacés de 2 m. "
   "<b>Critères de réalisation :</b> garde maintenue pendant le déplacement, pieds jamais croisés, distance vérifiée du regard et non au jugé. "
   "<b>Rapidité :</b> déplacement en pas glissés, sans saut. <b>Intensité :</b> modérée. <b>Récupération :</b> 15 s à l'inversion des rôles. "
   "<b>Sécurité :</b> aucun contact à ce stade ; 2 m minimum entre binômes ; le partenaire reste strictement immobile.",
   "8 placements corrects sur 10 annonces, sans franchir la ligne de plots.",
   ["Le partenaire se déplace lentement", "Annonce remplacée par un geste", "Ajouter une quatrième zone"]),
 L("25 – 32′ (7 min)",
   "Conserver la distance moyenne face à un partenaire qui se déplace lentement, pendant trente secondes consécutives, sans se laisser rattraper ni décrocher.",
   "Un partenaire avance et recule lentement en ligne droite. L'autre doit maintenir en permanence la distance moyenne, sans jamais toucher. Séries de 30 secondes, puis inversion.",
   "<b>Matériel :</b> les plots restent en place comme repère. <b>Dispositif :</b> couloirs parallèles de 4 m, un binôme par couloir. "
   "<b>Critères de réalisation :</b> déplacement en miroir, buste orienté vers le partenaire, aucun croisement de pieds. "
   "<b>Rapidité :</b> vitesse imposée par le meneur, contrôlée par l'enseignant. <b>Intensité :</b> modérée. "
   "<b>Récupération :</b> 20 s entre chaque série. <b>Sécurité :</b> sens de déplacement unique par couloir ; arrêt immédiat au signal « yame ».",
   "La distance moyenne est tenue sur 30 secondes, sans contact ni décrochage de plus d'un mètre.",
   ["Autoriser les changements de direction", "Fermer le couloir progressivement"]),
 L("32 – 39′ (7 min)",
   "Toucher une cible tenue par un partenaire mobile, d'un direct du bras avant, bras tendu au moment de l'impact, sept fois sur dix tentatives.",
   "Le partenaire tient la cible et se déplace lentement. L'attaquant ajuste sa distance et frappe. Séries de 10 tentatives, puis inversion des rôles.",
   "<b>Matériel :</b> 7 cibles souples, une par binôme. <b>Dispositif :</b> colonnes espacées de 2 m, cible tenue à hauteur de poitrine et sur le côté du porteur. "
   "<b>Critères de réalisation :</b> bras tendu sans hyperextension au moment de l'impact, appui arrière poussé, retour immédiat en garde. "
   "<b>Rapidité et puissance :</b> geste rapide, impact contrôlé — la cible ne doit pas être repoussée. <b>Intensité :</b> modérée à soutenue. "
   "<b>Récupération :</b> 30 s entre deux séries. <b>Sécurité :</b> touche sur cible uniquement, jamais sur le corps ; le porteur garde la cible loin de son visage ; vitesse du porteur imposée par l'enseignant.",
   "7 touches nettes sur 10, bras tendu, sans cible repoussée.",
   ["Cible plus rapide", "Cible qui recule", "Départ de plus loin", "Deux cibles au choix"]),
 L("39 – 46′ (7 min)",
   "Toucher la cible de son adversaire sans être touché, au cours de séquences de quarante secondes, en utilisant la distance comme seul moyen.",
   "Chaque pratiquant tient une cible de la main avant. Il s'agit de toucher celle de l'autre. Séquences de 40 secondes, rotation des partenaires à chaque séquence.",
   "<b>Matériel :</b> 7 cibles souples. <b>Dispositif :</b> 5 binômes en simultané maximum, appariés par gabarit ; les autres observent avec la consigne de compter les touches. "
   "<b>Critères de réalisation :</b> garde maintenue, retour en distance longue après chaque tentative, aucune saisie. "
   "<b>Rapidité et puissance :</b> vitesse libre, puissance contrôlée — toucher, pas frapper. <b>Intensité :</b> soutenue. "
   "<b>Récupération :</b> 40 s de repos et d'observation entre deux séquences. "
   "<b>Sécurité :</b> intensité annoncée avant chaque séquence, cibles seules autorisées, arrêt immédiat au moindre contact hors cible, appariement décidé par l'enseignant.",
   "Au moins 6 touches réussies sur 10 échanges sans être touché en retour.",
   ["Interdire le recul", "Réduire la zone", "Un seul attaque, l'autre esquive"]),
 L("46 – 48′ (2 min)",
   "Retrouver un rythme respiratoire calme, assis en cercle, en suivant le comptage de l'enseignant sur dix respirations.",
   "Assis en cercle, respiration guidée en trois temps : inspiration sur trois temps, blocage sur un, expiration sur cinq.",
   "<b>Matériel :</b> aucun. <b>Dispositif :</b> cercle assis au centre du tatami, à distance des bords. "
   "<b>Critères de réalisation :</b> dos droit, épaules relâchées, expiration plus longue que l'inspiration. "
   "<b>Intensité :</b> nulle. <b>Récupération :</b> c'est la phase de récupération. "
   "<b>Sécurité :</b> sol non froid ; pas d'étirement passif après le travail d'opposition.",
   "Le rythme cardiaque redescend visiblement et le groupe tient la respiration guidée sur dix cycles.",
   ["Faire mener le comptage par un enfant"]),
 L("48 – 50′ (2 min)",
   "Formuler avec ses propres mots ce qui a permis de toucher sans être touché, avant de saluer et de quitter le tatami.",
   "Question ouverte au groupe. Deux ou trois réponses recueillies, reformulation par l'enseignant, annonce du contenu de la séance suivante, puis salut final.",
   "<b>Matériel :</b> aucun. <b>Dispositif :</b> cercle assis. <b>Critères de réalisation :</b> écoute des réponses des autres, prise de parole sans se couper. "
   "<b>Intensité :</b> nulle. <b>Sécurité :</b> sortie du tatami en file, par un seul côté.",
   "Deux enfants au moins formulent la notion de distance avec leurs propres mots.",
   ["Faire montrer plutôt que dire"]),
]

# ══════════════════════════════════════ CO2 — Enfants / chutes — 50 min
PLANS["CO2"] = [
 L("0 – 3′ (3 min)",
   "Se placer en ligne et saluer, puis restituer les deux consignes de sécurité du jour — menton rentré, bras qui frappent — avant tout déplacement.",
   "Salut, annonce : « aujourd'hui on apprend à tomber sans se faire mal ». La consigne « menton sur la poitrine, je regarde ma ceinture » est énoncée puis reformulée par trois enfants.",
   "<b>Matériel :</b> aucun. <b>Dispositif :</b> ligne face à l'enseignant. "
   "<b>Critères de réalisation :</b> la consigne est reformulée correctement par trois enfants différents. "
   "<b>Intensité :</b> nulle. <b>Sécurité :</b> vérification du tatami — aucun interstice, aucun bord relevé ; retrait des lunettes ; comptage de l'effectif.",
   "Trois enfants reformulent la consigne de protection sans aide.", []),
 L("3 – 9′ (6 min)",
   "Se déplacer au sol dans quatre positions différentes sans poser la tête, jusqu'à un essoufflement léger.",
   "Déplacements en quadrupédie, en crabe, assis-fessier, à plat ventre. Changement de mode au signal.",
   "<b>Matériel :</b> aucun. <b>Dispositif :</b> dispersion, sens de circulation unique annoncé. "
   "<b>Critères de réalisation :</b> tête toujours au-dessus du niveau des épaules, appuis mains à plat. "
   "<b>Rapidité :</b> allure lente à modérée. <b>Intensité :</b> modérée. <b>Récupération :</b> continue. "
   "<b>Sécurité :</b> interdiction de se croiser ; aucune roulade arrière à ce stade.",
   "Chaque enfant enchaîne les quatre modes sans jamais poser la tête au sol.", ["Ajouter un signal de figement"]),
 L("9 – 14′ (5 min)",
   "Basculer d'assis à couché puis revenir assis, menton rentré, dix fois de suite sans que la tête ne touche le tatami.",
   "Assis jambes fléchies, bascule lente vers l'arrière jusqu'au dos, retour assis par enroulement. Mains posées sur les cuisses, sans aide des bras.",
   "<b>Matériel :</b> aucun. <b>Dispositif :</b> deux rangs de 8, espacés de 2 m, un seul rang actif. "
   "<b>Critères de réalisation :</b> menton maintenu au contact du sternum sur toute la bascule, dos rond, mouvement continu sans à-coup. "
   "<b>Rapidité :</b> lente et contrôlée. <b>Intensité :</b> faible. <b>Récupération :</b> le rang au repos observe et compte. "
   "<b>Sécurité :</b> axe de bascule unique imposé et vérifié avant chaque série ; 1,5 m minimum entre deux enfants.",
   "10 bascules consécutives, menton rentré, sans contact de la tête.", ["Ajouter un comptage à voix haute"]),
 L("14 – 23′ (9 min)",
   "Chuter en arrière depuis la position assise en frappant le tatami des deux bras au moment où le dos touche, cinq fois de suite.",
   "Assis, jambes fléchies, bras tendus en diagonale devant soi. Bascule contrôlée vers l'arrière ; les deux bras frappent le tatami à plat au moment du contact du dos.",
   "<b>Matériel :</b> aucun. <b>Dispositif :</b> deux rangs alternés, un rang actif, l'autre observe avec deux critères écrits au tableau. "
   "<b>Critères de réalisation :</b> menton rentré, bras à 45° du corps, paume vers le sol, frappe simultanée des deux bras, jambes qui restent fléchies. "
   "<b>Rapidité :</b> bascule lente ; la frappe des bras, elle, est vive. <b>Intensité :</b> faible. "
   "<b>Récupération :</b> 30 s d'observation entre deux séries de 5. "
   "<b>Sécurité :</b> un seul rang chute à la fois ; axe unique vérifié avant chaque série ; consigne répétée avant chaque répétition.",
   "5 chutes consécutives, menton rentré, deux bras frappant, tête ne touchant jamais.",
   ["Enseignant qui donne le tempo", "Observateur qui annonce l'erreur", "Yeux fixés sur la ceinture"]),
 L("23 – 32′ (9 min)",
   "Chuter en arrière depuis la position accroupie en passant d'abord par le fessier, cinq fois de suite, après validation individuelle de l'enseignant.",
   "Accroupi, talons décollés. L'enfant s'assoit d'abord — le fessier touche avant le dos — puis bascule et frappe des deux bras.",
   "<b>Matériel :</b> aucun. <b>Dispositif :</b> mêmes rangs. Le passage au niveau 2 est validé <i>individuellement</i> par l'enseignant après observation. "
   "<b>Critères de réalisation :</b> ordre imposé fessier puis dos puis frappe des bras, menton rentré sur toute la trajectoire, aucun appui de la main derrière. "
   "<b>Rapidité :</b> lente. <b>Intensité :</b> faible à modérée. <b>Récupération :</b> 30 s entre deux séries. "
   "<b>Sécurité :</b> aucun enfant ne passe au niveau 2 sans validation ; ceux qui ne sont pas validés poursuivent au niveau assis, sans commentaire devant le groupe.",
   "5 chutes consécutives avec passage par le fessier, sans que la tête ne touche.",
   ["Ralentir le tempo", "Départ légèrement plus haut pour les plus à l'aise"]),
 L("32 – 40′ (8 min)",
   "Observer la chute de son partenaire et lui annoncer, sur cinq chutes, lequel des deux critères — menton ou bras — a manqué.",
   "Par deux, face à face. L'un chute depuis l'accroupi, l'autre observe et annonce « menton » ou « bras » selon ce qui a manqué, ou « juste » si tout est correct. Inversion après 5 chutes.",
   "<b>Matériel :</b> aucun. <b>Dispositif :</b> binômes espacés, axes de chute strictement parallèles, jamais opposés. "
   "<b>Critères de réalisation :</b> l'observateur annonce à voix haute et immédiatement ; le chuteur corrige à la répétition suivante. "
   "<b>Intensité :</b> faible. <b>Récupération :</b> l'observation fait office de récupération. "
   "<b>Sécurité :</b> les deux ne chutent jamais en même temps ; l'observateur est debout, hors de l'axe de chute.",
   "L'observateur donne un retour juste sur au moins 3 chutes sur 5.",
   ["Ajouter un troisième critère", "Chute sur signal inattendu"]),
 L("40 – 45′ (5 min)",
   "Enchaîner trois chutes arrière depuis l'accroupi sur un rythme donné, sans reprendre la position de départ entre chaque.",
   "Trois chutes consécutives : chuter, se relever sans les mains, chuter à nouveau. L'enseignant donne le tempo.",
   "<b>Matériel :</b> aucun. <b>Dispositif :</b> un rang actif, l'autre au repos. "
   "<b>Critères de réalisation :</b> qualité de protection maintenue à la troisième chute comme à la première ; relevé sans appui des mains. "
   "<b>Rapidité :</b> tempo modéré, jamais précipité. <b>Intensité :</b> soutenue. <b>Récupération :</b> 60 s entre deux séries de 3. "
   "<b>Sécurité :</b> arrêt immédiat de la série si la qualité se dégrade — la fatigue est le premier facteur de mauvaise chute.",
   "Les trois chutes conservent le menton rentré et la frappe des deux bras.", ["Réduire le tempo si dégradation"]),
 L("45 – 48′ (3 min)",
   "Retrouver un rythme respiratoire calme, allongé sur le dos, en suivant le comptage de l'enseignant.",
   "Allongé sur le dos, jambes fléchies, respiration guidée. Relâchement segmentaire guidé à la voix.",
   "<b>Matériel :</b> aucun. <b>Dispositif :</b> allongés en étoile, têtes vers le centre. "
   "<b>Critères de réalisation :</b> épaules au sol, mâchoire relâchée. <b>Intensité :</b> nulle. "
   "<b>Sécurité :</b> sol non froid ; pas de sollicitation cervicale.",
   "Le groupe reste immobile et silencieux pendant deux minutes.", []),
 L("48 – 50′ (2 min)",
   "Citer les deux éléments qui protègent la tête lors d'une chute, avant de saluer.",
   "Question au groupe, réponses recueillies, reformulation, rappel que la chute se travaille à chaque séance. Salut final.",
   "<b>Matériel :</b> aucun. <b>Dispositif :</b> cercle assis. <b>Critères de réalisation :</b> les deux consignes sont citées sans aide. "
   "<b>Intensité :</b> nulle. <b>Sécurité :</b> sortie du tatami en file.",
   "Le groupe énonce les deux consignes clés : menton rentré, bras qui frappent.",
   ["Faire démontrer par un volontaire"]),
]

# ══════════════════════════════════════ CO3 — Enfants / contrôle — 55 min
PLANS["CO3"] = [
 L("0 – 3′ (3 min)",
   "Énoncer la règle du jour — « celui qui frappe le plus fort perd » — après le salut, sans que l'enseignant ait à la répéter.",
   "Salut, annonce de la règle, reformulation demandée à deux enfants. Test à blanc du signal d'arrêt : au « yame », tout le monde s'immobilise.",
   "<b>Matériel :</b> aucun. <b>Dispositif :</b> ligne face à l'enseignant. "
   "<b>Critères de réalisation :</b> arrêt obtenu en moins d'une seconde au test à blanc. "
   "<b>Intensité :</b> nulle. <b>Sécurité :</b> le signal d'arrêt est testé avant toute mise en action ; ongles et bijoux vérifiés.",
   "Le groupe s'immobilise en moins d'une seconde au signal test.", []),
 L("3 – 9′ (6 min)",
   "Élever sa température corporelle et mobiliser ses articulations en suivant le rythme donné, jusqu'à un essoufflement léger.",
   "Course en dispersion avec changements de direction, puis mobilisation articulaire complète sur place.",
   "<b>Matériel :</b> aucun. <b>Dispositif :</b> dispersion, enseignant au centre. "
   "<b>Critères de réalisation :</b> amplitude complète, regard levé. <b>Rapidité :</b> allure de footing. "
   "<b>Intensité :</b> faible à modérée. <b>Récupération :</b> continue. <b>Sécurité :</b> interdiction de couper la trajectoire d'un camarade.",
   "Amplitude complète sur toutes les articulations, essoufflement léger.", []),
 L("9 – 16′ (7 min)",
   "Exécuter la même technique sur trois tempos annoncés — lent, normal, explosif — en arrêtant le geste net au bout de sa course.",
   "Techniques à vide sur place. L'enseignant annonce le tempo avant chaque série de cinq. Consigne finale : explosif mais arrêté net, sans rebond.",
   "<b>Matériel :</b> aucun. <b>Dispositif :</b> lignes espacées de 2 m, tous face à l'enseignant. "
   "<b>Critères de réalisation :</b> trajectoire identique quel que soit le tempo, arrêt franc sans oscillation du bras en fin de geste, retour en garde. "
   "<b>Rapidité et puissance :</b> la vitesse varie, l'amplitude ne varie jamais. <b>Intensité :</b> modérée. "
   "<b>Récupération :</b> 20 s entre deux séries. <b>Sécurité :</b> aucun partenaire, distance de 2 m entre pratiquants.",
   "Le geste explosif s'arrête net, sans rebond, sur 8 répétitions sur 10.",
   ["Comptage plus rapide", "Arrêt sur signal inattendu"]),
 L("16 – 26′ (10 min)",
   "Toucher un ballon de baudruche tenu par un partenaire sans le faire éclater ni le repousser de plus de vingt centimètres, huit fois sur dix.",
   "Le partenaire tient un ballon au bout du bras tendu sur le côté. L'attaquant frappe d'un direct. Séries de 10, puis inversion.",
   "<b>Matériel :</b> 6 ballons de baudruche, gonflés aux deux tiers seulement. <b>Dispositif :</b> un ballon par binôme, colonnes espacées de 2 m. "
   "<b>Critères de réalisation :</b> contact franc mais arrêt au contact, poignet verrouillé, retour immédiat en garde. "
   "<b>Rapidité et puissance :</b> vitesse d'exécution normale, puissance dosée — l'éclatement sanctionne l'excès. "
   "<b>Intensité :</b> modérée. <b>Récupération :</b> 30 s à l'inversion. "
   "<b>Sécurité :</b> ballon tenu bras tendu sur le côté, jamais devant le visage du porteur ; ballons gonflés modérément pour éviter l'éclatement par surpression.",
   "8 touches sur 10 sans éclatement ni recul supérieur à 20 cm.",
   ["Ballon tenu plus haut ou plus bas", "Ballon mobile", "Deux techniques enchaînées"]),
 L("26 – 34′ (8 min)",
   "Frapper la zone annoncée par le porteur de cible et s'arrêter au contact, sans le faire reculer d'un pas, sur dix tentatives.",
   "Le porteur annonce une zone — ventre, côté, épaule — juste avant la frappe. L'attaquant touche cette zone et s'arrête au contact.",
   "<b>Matériel :</b> 6 cibles souples. <b>Dispositif :</b> par deux, rotation des partenaires toutes les 90 s. "
   "<b>Critères de réalisation :</b> zone touchée conforme à l'annonce, appui arrière stable, le porteur ne recule pas. "
   "<b>Rapidité et puissance :</b> geste rapide, poussée absente — on touche, on ne pousse pas. <b>Intensité :</b> modérée. "
   "<b>Récupération :</b> 20 s entre deux séries. "
   "<b>Sécurité :</b> zones limitées au tronc, aucune technique au visage ; le porteur peut interrompre à tout moment.",
   "Le porteur ne recule pas d'un pas sur au moins 8 frappes sur 10.",
   ["Annonce au dernier moment", "Deux zones possibles", "Porteur qui se déplace"]),
 L("34 – 45′ (11 min)",
   "Toucher le ballon de son adversaire sans le faire éclater ni faire éclater le sien, au cours de séquences de quarante-cinq secondes.",
   "Chacun tient un ballon de la main avant. Il faut toucher celui de l'autre. Un ballon éclaté fait perdre le point. Séquences de 45 s, rotation des adversaires.",
   "<b>Matériel :</b> 6 ballons, un par pratiquant en action. <b>Dispositif :</b> 4 binômes en simultané, appariés par gabarit ; les autres arbitrent et comptent. "
   "<b>Critères de réalisation :</b> garde maintenue, main libre en protection, retour en distance après chaque tentative. "
   "<b>Rapidité et puissance :</b> vitesse libre, puissance strictement contrôlée. <b>Intensité :</b> soutenue. "
   "<b>Récupération :</b> 45 s d'arbitrage entre deux séquences. "
   "<b>Sécurité :</b> intensité annoncée avant chaque séquence ; arrêt immédiat si un enfant cherche la puissance ; rotation systématique pour éviter l'installation d'un duel.",
   "Au moins 3 touches valides et aucun ballon éclaté par séquence.",
   ["Interdire le recul", "Zone réduite", "Arbitrage confié à un tiers"]),
 L("45 – 50′ (5 min)",
   "Réaliser dix répétitions techniques au ralenti, en s'arrêtant à un centimètre d'une cible fixe, sans jamais la toucher.",
   "Face à une cible posée ou tenue immobile, techniques exécutées au ralenti avec arrêt volontaire juste avant le contact.",
   "<b>Matériel :</b> 6 cibles. <b>Dispositif :</b> par deux, porteur immobile. "
   "<b>Critères de réalisation :</b> arrêt à distance constante, aucun contact, respiration continue. "
   "<b>Rapidité :</b> très lente. <b>Intensité :</b> faible — c'est déjà une phase de retour au calme actif. "
   "<b>Récupération :</b> intégrée à la lenteur du geste. <b>Sécurité :</b> aucun contact autorisé.",
   "Dix arrêts consécutifs sans contact, à distance constante.", ["Yeux fermés du porteur"]),
 L("50 – 53′ (3 min)",
   "Retrouver un rythme respiratoire calme, assis en cercle, sur dix cycles guidés.",
   "Respiration guidée en trois temps, assis en cercle.",
   "<b>Matériel :</b> aucun. <b>Dispositif :</b> cercle assis. <b>Critères de réalisation :</b> expiration plus longue que l'inspiration. "
   "<b>Intensité :</b> nulle. <b>Sécurité :</b> sol non froid ; pas d'étirement passif après opposition.",
   "Le groupe tient les dix cycles sans agitation.", []),
 L("53 – 55′ (2 min)",
   "Expliquer en une phrase, avec ses mots, pourquoi on apprend à s'arrêter, avant de saluer et de sortir du tatami.",
   "Question ouverte, deux ou trois réponses, reformulation faisant le lien entre contrôle et respect du partenaire. Salut final.",
   "<b>Matériel :</b> aucun. <b>Dispositif :</b> cercle. <b>Critères de réalisation :</b> le lien avec le partenaire est formulé par les enfants, pas par l'enseignant. "
   "<b>Intensité :</b> nulle. <b>Sécurité :</b> sortie en file.",
   "Deux enfants au moins relient le contrôle au respect du partenaire.", []),
]

# ══════════════════════════════════════ CO4 — Baby 4-6 ans — 45 min
PLANS["CO4"] = [
 L("0 – 4′ (4 min)",
   "Entrer sur le tatami en file, se placer sur la ligne et saluer, sans être repris individuellement.",
   "Entrée en file par un côté unique, placement sur des repères au sol, salut collectif court, comptage à voix haute par les enfants, annonce : « aujourd'hui on est des explorateurs ».",
   "<b>Matériel :</b> 8 plots servant de repères de placement. <b>Dispositif :</b> ligne matérialisée par les plots, un plot par enfant. "
   "<b>Critères de réalisation :</b> chaque enfant trouve seul son plot, salut simultané. "
   "<b>Intensité :</b> nulle. <b>Sécurité :</b> effectif compté à voix haute ; entrée par un seul côté du tatami.",
   "Les dix enfants se placent seuls et saluent en même temps.", ["Faire compter par un enfant"]),
 L("4 – 9′ (5 min)",
   "Se déplacer en imitant quatre animaux annoncés et se figer immédiatement au signal, quatre fois de suite.",
   "Déplacements imités : le chat qui se réveille, la grenouille, le crabe, le géant. Au signal sonore : statue.",
   "<b>Matériel :</b> une clochette. <b>Dispositif :</b> dispersion libre, enseignant au centre et tournant. "
   "<b>Critères de réalisation :</b> figement en moins de deux secondes, immobilité tenue trois secondes. "
   "<b>Rapidité :</b> déplacement libre, jamais de course franche. <b>Intensité :</b> modérée. "
   "<b>Récupération :</b> les temps de statue font office de récupération. "
   "<b>Sécurité :</b> yeux ouverts, interdiction de se toucher, limites du tatami rappelées.",
   "Chaque enfant se fige en moins de deux secondes aux quatre signaux.",
   ["Changer d'animal plus vite", "Imposer une direction"]),
 L("9 – 14′ (5 min)",
   "Franchir un banc bas en s'asseyant dessus puis en passant les deux jambes, trois fois de suite, sans poser les mains au sol.",
   "Passage du banc en atelier collectif guidé par l'enseignant, avant l'installation du parcours complet. Démonstration puis passages successifs.",
   "<b>Matériel :</b> 2 bancs de 25 cm maximum. <b>Dispositif :</b> deux colonnes de 5, un banc par colonne, réception sur tatami dégagé. "
   "<b>Critères de réalisation :</b> assise complète sur le banc avant passage des jambes, aucun appui des mains au sol à la réception. "
   "<b>Rapidité :</b> lente et contrôlée. <b>Intensité :</b> faible. <b>Récupération :</b> attente inférieure à 10 s dans la colonne. "
   "<b>Sécurité :</b> bancs testés avant la séance, un seul enfant sur le banc à la fois, enseignant placé pour voir les deux colonnes.",
   "Trois franchissements sans appui des mains au sol.", ["Banc plus haut pour les plus grands"]),
 L("14 – 22′ (8 min)",
   "Enchaîner les quatre stations du parcours dans l'ordre et dans le sens imposé, deux fois de suite, sans doubler un camarade.",
   "Parcours à quatre stations : franchir le banc, sauter à pieds joints dans les cerceaux, ramper sous la corde, toucher la cible avec la main annoncée. Départ toutes les 15 secondes.",
   "<b>Matériel :</b> 2 bancs, 4 cerceaux, une corde tendue à 50 cm, 6 cibles, 8 plots de balisage. "
   "<b>Dispositif :</b> deux parcours identiques en parallèle, 5 enfants par parcours, sens unique matérialisé par les plots, enseignant au point de croisement. "
   "<b>Critères de réalisation :</b> ordre des stations respecté, saut à pieds joints dans chaque cerceau, main annoncée utilisée. "
   "<b>Rapidité :</b> libre, sans course. <b>Intensité :</b> modérée. <b>Récupération :</b> le retour au départ par l'extérieur fait office de récupération active — aucune attente supérieure à 10 s. "
   "<b>Sécurité :</b> sens unique strict, un seul enfant par station, interdiction de doubler.",
   "Deux parcours complets par enfant, sans attente supérieure à 10 secondes.",
   ["Inverser le sens", "Annoncer la main droite ou gauche"]),
 L("22 – 30′ (8 min)",
   "Refaire le parcours en respectant une contrainte supplémentaire annoncée avant le départ, deux fois de suite.",
   "Même parcours, avec une contrainte ajoutée : toucher la cible de la main gauche uniquement, puis franchir la corde sur le dos.",
   "<b>Matériel :</b> identique. <b>Dispositif :</b> identique, contrainte annoncée et montrée avant chaque série. "
   "<b>Critères de réalisation :</b> contrainte respectée sur les deux passages, ordre des stations maintenu. "
   "<b>Rapidité :</b> libre. <b>Intensité :</b> modérée à soutenue. <b>Récupération :</b> identique, par le retour extérieur. "
   "<b>Sécurité :</b> la contrainte ne doit jamais dégrader la sécurité d'une station ; l'enseignant vérifie chaque passage sous la corde.",
   "Deux parcours complets avec la contrainte respectée.",
   ["Contrainte de latéralité", "Ajouter une couleur de cible"]),
 L("30 – 36′ (6 min)",
   "Transporter une cible d'un bout à l'autre du tatami en marchant, sans toucher un camarade, et s'immobiliser à chaque signal.",
   "Jeu du trésor : rapporter les cibles une par une, en marchant, sans se toucher. Au signal, tout le monde se fige.",
   "<b>Matériel :</b> 6 cibles, corde délimitant les couloirs. <b>Dispositif :</b> deux équipes de 5, couloirs séparés, sens unique. "
   "<b>Critères de réalisation :</b> marche imposée, aucun contact, figement au signal. "
   "<b>Rapidité :</b> marche seulement — la course est sanctionnée par le retour au départ. <b>Intensité :</b> modérée. "
   "<b>Récupération :</b> les temps de figement. <b>Sécurité :</b> couloirs séparés, aucun croisement possible.",
   "Le groupe rapporte toutes les cibles et se fige à chaque signal.",
   ["Réduire le couloir", "Transporter à deux"]),
 L("36 – 40′ (4 min)",
   "Se déplacer lentement en imitant un animal calme, puis s'asseoir en cercle sans qu'on le demande deux fois.",
   "Retour au calme actif : déplacement lent en imitant l'escargot puis la tortue, jusqu'au cercle central.",
   "<b>Matériel :</b> aucun. <b>Dispositif :</b> convergence vers le centre du tatami. "
   "<b>Critères de réalisation :</b> lenteur réelle, silence progressif. <b>Intensité :</b> faible. "
   "<b>Récupération :</b> c'est la phase de récupération. <b>Sécurité :</b> convergence sans bousculade.",
   "Le groupe s'assoit en cercle sans qu'il faille répéter la consigne.", []),
 L("40 – 43′ (3 min)",
   "Souffler longuement cinq fois de suite en suivant le geste de l'enseignant, assis en cercle.",
   "« Respiration du dragon » : inspiration par le nez bras levés, expiration longue par la bouche bras descendants.",
   "<b>Matériel :</b> aucun. <b>Dispositif :</b> cercle assis, éloigné des bancs. "
   "<b>Critères de réalisation :</b> expiration audible et longue, épaules qui descendent. <b>Intensité :</b> nulle. "
   "<b>Sécurité :</b> sol non froid ; matériel déjà rangé pour éviter toute tentation.",
   "Chaque enfant réalise cinq expirations longues en suivant le geste.", ["Faire mener par un enfant"]),
 L("43 – 45′ (2 min)",
   "Dire un mot sur ce qu'on a préféré, puis saluer et sortir du tatami en file.",
   "Tour de parole rapide — un mot par enfant, sans obligation. Salut final, sortie en file par le côté d'entrée.",
   "<b>Matériel :</b> aucun. <b>Dispositif :</b> cercle. <b>Critères de réalisation :</b> chacun écoute celui qui parle. "
   "<b>Intensité :</b> nulle. <b>Sécurité :</b> comptage de l'effectif avant la sortie.",
   "Chaque enfant qui le souhaite s'exprime ; effectif recompté à la sortie.", []),
]

# ══════════════════════════════ CO5 — Ados / percussion-projection — 75 min
PLANS["CO5"] = [
 L("0 – 4′ (4 min)",
   "Restituer l'objectif de la séance et le signal d'arrêt après leur annonce, sans qu'ils soient répétés.",
   "Salut, annonce de l'objectif et du critère de réussite. Rappel du signal d'arrêt, testé à blanc sur l'ensemble du groupe.",
   "<b>Matériel :</b> aucun. <b>Dispositif :</b> ligne face à l'enseignant. "
   "<b>Critères de réalisation :</b> arrêt obtenu en moins d'une seconde au test à blanc ; deux pratiquants reformulent l'objectif. "
   "<b>Intensité :</b> nulle. <b>Sécurité :</b> le test du signal précède toute mise en action ; état de santé du jour demandé au groupe.",
   "Le groupe s'arrête en moins d'une seconde ; deux pratiquants restituent l'objectif.", []),
 L("4 – 12′ (8 min)",
   "Élever sa température corporelle et mobiliser ses articulations jusqu'à transpiration, en suivant la progression annoncée.",
   "Élévation générale par déplacements variés, puis mobilisation articulaire complète, puis gammes de déplacements en garde.",
   "<b>Matériel :</b> aucun. <b>Dispositif :</b> dispersion puis lignes. "
   "<b>Critères de réalisation :</b> amplitude complète, garde tenue sur les déplacements, appuis jamais croisés. "
   "<b>Rapidité :</b> progressive, du lent au rapide. <b>Intensité :</b> croissante, de faible à modérée. "
   "<b>Récupération :</b> continue. <b>Sécurité :</b> aucune amplitude forcée ; adaptation individuelle en cas d'antécédent articulaire signalé.",
   "Transpiration obtenue, amplitude complète sur toutes les articulations.", []),
 L("12 – 20′ (8 min)",
   "Réaliser cinq chutes de chaque type — arrière, latérale, avant roulée — en conservant la protection de la tête, pour être autorisé à projeter.",
   "Batterie de chutes en rangs alternés. Validation individuelle par l'enseignant : c'est la condition d'accès aux situations de projection.",
   "<b>Matériel :</b> aucun. <b>Dispositif :</b> deux rangs, un seul actif, axes de chute parallèles espacés de 2 m. "
   "<b>Critères de réalisation :</b> menton rentré, frappe des bras simultanée au contact, absence de réception sur le coude ou le poignet tendu. "
   "<b>Rapidité :</b> modérée. <b>Intensité :</b> modérée. <b>Récupération :</b> 30 s entre deux types de chute. "
   "<b>Sécurité :</b> <i>aucun binôme non validé ne projettera ensuite</i> ; les non-validés poursuivront sur le travail de déséquilibre contrôlé.",
   "5 chutes de chaque type sans faute de protection — condition d'accès à la suite.", []),
 L("20 – 28′ (8 min)",
   "Nommer, après chaque frappe sur cible, la réaction produite chez le partenaire — recul, protection ou ouverture — sur trois frappes sur cinq.",
   "Uke tient une cible et exagère volontairement sa réaction. Tori frappe, observe et nomme à voix haute ce qui s'ouvre. Rotation toutes les 3 minutes.",
   "<b>Matériel :</b> 6 cibles souples, protections de poings. <b>Dispositif :</b> par deux, appariement par gabarit, colonnes espacées de 2 m. "
   "<b>Critères de réalisation :</b> Tori nomme à voix haute et immédiatement ; Uke exagère franchement sa réaction. "
   "<b>Rapidité et puissance :</b> percussion contrôlée sur cible, vitesse normale. <b>Intensité :</b> modérée. "
   "<b>Récupération :</b> 30 s à chaque rotation. <b>Sécurité :</b> percussion sur cible uniquement, aucune technique au visage.",
   "Tori nomme correctement la réaction sur au moins 3 frappes sur 5.",
   ["Changer la technique de percussion", "Uke réagit différemment sans prévenir"]),
 L("28 – 38′ (10 min)",
   "Entrer dans l'espace ouvert par la percussion et amener la projection, sur un partenaire qui coopère, six fois sur dix.",
   "Niveau 1. Tori frappe, Uke réagit de façon convenue et accompagne. Tori entre immédiatement et amène la projection.",
   "<b>Matériel :</b> cibles rangées, protections de poings conservées. <b>Dispositif :</b> axe de projection imposé et identique pour tous, 3 m entre binômes. "
   "<b>Critères de réalisation :</b> entrée dans le prolongement de la frappe sans temps d'arrêt, déséquilibre obtenu avant la projection, Uke accompagné jusqu'au sol. "
   "<b>Rapidité :</b> lente à modérée. <b>Intensité :</b> modérée. <b>Récupération :</b> 45 s toutes les deux séries de 5. "
   "<b>Sécurité :</b> Uke accompagne et ne résiste pas ; aucune projection sur un binôme non validé en chute.",
   "6 enchaînements sur 10 sans temps d'arrêt marqué entre percussion et entrée.",
   ["Percussion imposée ou libre", "Distance de départ allongée"]),
 L("38 – 46′ (8 min)",
   "Réaliser le même enchaînement sur un partenaire qui réagit normalement, sans annonce préalable, six fois sur dix.",
   "Niveau 2. Uke ne prévient plus de sa réaction et n'accompagne plus volontairement. Tori doit lire la réaction réelle.",
   "<b>Matériel :</b> protections de poings. <b>Dispositif :</b> identique ; le passage au niveau 2 est validé binôme par binôme par l'enseignant. "
   "<b>Critères de réalisation :</b> entrée déclenchée par la réaction observée et non anticipée, contrôle du partenaire jusqu'à la fin de la projection. "
   "<b>Rapidité :</b> modérée. <b>Intensité :</b> modérée à soutenue. <b>Récupération :</b> 60 s entre deux séries de 5. "
   "<b>Sécurité :</b> Uke ne résiste pas encore ; arrêt du binôme si la projection devient une poussée.",
   "6 réussites sur 10 avec entrée déclenchée par la réaction réelle.",
   ["Deux percussions possibles", "Uke qui se déplace"]),
 L("46 – 54′ (8 min)",
   "Obtenir la projection face à un partenaire qui résiste légèrement, en utilisant sa réaction et non la force, cinq fois sur dix.",
   "Niveau 3. Uke résiste légèrement et de façon constante. Tori doit exploiter la réaction plutôt que forcer le passage.",
   "<b>Matériel :</b> protections de poings. <b>Dispositif :</b> identique, validation individuelle du passage au niveau 3. "
   "<b>Critères de réalisation :</b> absence de traction en force, déséquilibre visible avant la projection, Tori change de projection plutôt que d'insister. "
   "<b>Rapidité :</b> modérée. <b>Intensité :</b> soutenue. <b>Récupération :</b> 60 s entre deux séries. "
   "<b>Sécurité :</b> résistance <i>légère et constante</i>, jamais bloquante ; arrêt immédiat si Tori force le passage.",
   "5 projections sur 10 obtenues sans traction en force.",
   ["Niveau de résistance ajustable", "Espace réduit"]),
 L("54 – 66′ (12 min)",
   "Faire apparaître au moins trois fois la liaison percussion-entrée au cours d'une opposition souple de quatre-vingt-dix secondes.",
   "Randori souple. Seule contrainte : toute projection doit être précédée d'une percussion. Rotation des partenaires à chaque séquence.",
   "<b>Matériel :</b> protections de poings. <b>Dispositif :</b> 4 binômes en simultané maximum, appariés par gabarit ; les autres observent avec deux critères écrits. "
   "<b>Critères de réalisation :</b> contrainte respectée, contrôle du partenaire maintenu jusqu'au sol, retour en garde après chaque séquence. "
   "<b>Rapidité et puissance :</b> vitesse libre, percussion contrôlée, projection accompagnée. <b>Intensité :</b> élevée. "
   "<b>Récupération :</b> 90 s d'observation entre deux séquences — récupération complète imposée. "
   "<b>Sécurité :</b> intensité annoncée avant chaque séquence ; l'enseignant surveille et ne corrige pas pendant l'opposition ; arrêt de toute la salle en cas de dérive.",
   "La liaison percussion-entrée apparaît au moins 3 fois par séquence.",
   ["Limiter les cibles de percussion", "Handicaper l'un des deux", "Réduire l'espace"]),
 L("66 – 71′ (5 min)",
   "Réaliser cinq étirements guidés en position basse, en maintenant chaque position dix secondes sans à-coup.",
   "Récupération active par marche, puis étirements guidés des chaînes sollicitées : ischio-jambiers, fessiers, épaules, chaîne postérieure.",
   "<b>Matériel :</b> aucun. <b>Dispositif :</b> cercle assis. "
   "<b>Critères de réalisation :</b> position tenue 10 s, respiration continue, aucun rebond. "
   "<b>Intensité :</b> faible. <b>Récupération :</b> c'est la phase de récupération. "
   "<b>Sécurité :</b> pas d'étirement passif intense après opposition ; amplitude limitée à la sensation, jamais à la douleur.",
   "Chaque position est tenue 10 secondes sans à-coup.", []),
 L("71 – 75′ (4 min)",
   "Formuler en une phrase ce qui rendait la projection possible, devant le groupe, avant de saluer.",
   "Question ouverte au groupe, réponses recueillies, formalisation de la notion de réaction. Annonce du contenu de la séance suivante. Salut final.",
   "<b>Matériel :</b> aucun. <b>Dispositif :</b> cercle. "
   "<b>Critères de réalisation :</b> la réponse attendue vient du groupe, pas de l'enseignant. <b>Intensité :</b> nulle. "
   "<b>Sécurité :</b> vérification que personne ne signale de douleur avant la sortie.",
   "Le groupe formule que c'est la réaction de l'adversaire, non la force, qui ouvre la projection.",
   ["Faire démontrer par un binôme"]),
]

# ══════════════════════════════════════ CO6 — Ados / randori — 75 min
PLANS["CO6"] = [
 L("0 – 5′ (5 min)",
   "Restituer les trois règles d'opposition du jour — cibles autorisées, intensité, signal d'arrêt — avant toute mise en action.",
   "Salut collectif. Annonce de l'objectif. Énoncé explicite des règles, reformulation par trois pratiquants différents. Vérification individuelle des protections.",
   "<b>Matériel :</b> protège-dents, protections de poings et de pieds, coquille, protège-tibias. "
   "<b>Dispositif :</b> ligne, protections déjà portées. "
   "<b>Critères de réalisation :</b> chaque pratiquant a reformulé au moins une règle ; protections contrôlées une par une par l'enseignant. "
   "<b>Intensité :</b> nulle. <b>Sécurité :</b> aucune opposition avant cette étape ; état de santé du jour demandé individuellement ; appariement noté par écrit.",
   "Protections vérifiées individuellement ; trois règles reformulées.", []),
 L("5 – 14′ (9 min)",
   "Élever sa température corporelle jusqu'à transpiration et retrouver la mobilité de ses appuis, en suivant la progression annoncée.",
   "Élévation générale, mobilisation articulaire complète, gammes de déplacements en garde avec changements de direction.",
   "<b>Matériel :</b> aucun. <b>Dispositif :</b> dispersion puis lignes. "
   "<b>Critères de réalisation :</b> garde tenue, appuis jamais croisés, amplitude complète. "
   "<b>Rapidité :</b> progressive. <b>Intensité :</b> croissante. <b>Récupération :</b> continue. "
   "<b>Sécurité :</b> aucune amplitude forcée ; les pratiquants ayant signalé une gêne adaptent l'amplitude.",
   "Transpiration obtenue, appuis mobiles, aucune gêne signalée.", []),
 L("14 – 21′ (7 min)",
   "Reprendre le contact avec un partenaire en touchant son avant-bras sans être touché, au cours de trois séries de soixante secondes.",
   "Travail à deux non opposé : déplacements en miroir, puis jeu des mains — toucher l'avant-bras du partenaire sans être touché.",
   "<b>Matériel :</b> protections portées. <b>Dispositif :</b> binômes définis par l'enseignant, espacés de 2 m. "
   "<b>Critères de réalisation :</b> contact léger uniquement, garde maintenue, aucune saisie. "
   "<b>Rapidité :</b> modérée. <b>Intensité :</b> modérée. <b>Récupération :</b> 30 s entre deux séries. "
   "<b>Sécurité :</b> zone limitée aux avant-bras ; aucune technique portée.",
   "Trois séries tenues, contact léger respecté, aucune saisie.", ["Miroir plus rapide", "Espace réduit"]),
 L("21 – 33′ (12 min)",
   "Faire apparaître au moins trois fois la famille de techniques annoncée, au cours de séquences de quatre-vingt-dix secondes.",
   "Randori à contrainte unique. Une seule famille de techniques est autorisée, annoncée avant chaque séquence. Rotation imposée.",
   "<b>Matériel :</b> protections complètes, chronomètre. <b>Dispositif :</b> 5 binômes en simultané, un binôme observateur qui peut alerter l'enseignant. "
   "<b>Critères de réalisation :</b> contrainte respectée, retour en garde après chaque action, arrêt immédiat au signal. "
   "<b>Rapidité et puissance :</b> vitesse libre, puissance contrôlée, contact autorisé sur les cibles annoncées. "
   "<b>Intensité :</b> élevée. <b>Récupération :</b> <b>60 s complètes</b> entre deux séquences — non négociable. "
   "<b>Sécurité :</b> règles réénoncées avant chaque séquence ; tout pratiquant peut arrêter sans justification ; chronométrage strict.",
   "Le thème imposé apparaît au moins 3 fois par séquence ; aucun arrêt pour intensité.",
   ["Changer la famille autorisée", "Interdire le recul", "Réduire la zone"]),
 L("33 – 45′ (12 min)",
   "Tenir quarante-cinq secondes en défense seule, sans riposter, en n'étant pas touché plus de trois fois.",
   "Randori à rôles dissymétriques. L'un attaque, l'autre défend uniquement : il esquive, contrôle, sort. Inversion à mi-temps.",
   "<b>Matériel :</b> protections complètes, chasubles de deux couleurs pour identifier les rôles. "
   "<b>Dispositif :</b> appariement modifié pour croiser les niveaux — <b>le plus fort ou le plus lourd est placé en défenseur</b>. "
   "<b>Critères de réalisation :</b> le défenseur ne riposte jamais, l'attaquant maintient une pression constante sans excès. "
   "<b>Rapidité et puissance :</b> attaques à vitesse réelle, puissance contrôlée. <b>Intensité :</b> élevée pour l'attaquant, très élevée pour le défenseur. "
   "<b>Récupération :</b> 60 s à chaque inversion de rôle. "
   "<b>Sécurité :</b> l'attribution du rôle de défenseur au plus fort neutralise l'écart de gabarit ; arrêt si l'attaquant profite de l'absence de riposte.",
   "Le défenseur tient 45 s sans être touché plus de 3 fois.",
   ["Autoriser une riposte", "Limiter l'espace du défenseur", "Deux attaquants successifs"]),
 L("45 – 58′ (13 min)",
   "Conduire trois séquences d'opposition complète de quatre-vingt-dix secondes sans qu'aucun arrêt pour intensité excessive ne soit nécessaire.",
   "Randori libre encadré. Toutes techniques autorisées dans les cibles annoncées. Rotation des partenaires à chaque séquence.",
   "<b>Matériel :</b> protections complètes, chronomètre. <b>Dispositif :</b> 4 binômes maximum en simultané, appariement resserré par gabarit. "
   "<b>Critères de réalisation :</b> cibles respectées, contrôle maintenu en fin de séquence comme au début, arrêt immédiat au signal. "
   "<b>Rapidité et puissance :</b> vitesse réelle, puissance contrôlée et annoncée avant chaque séquence. "
   "<b>Intensité :</b> maximale de la séance. <b>Récupération :</b> 90 s complètes entre deux séquences. "
   "<b>Sécurité :</b> <b>l'enseignant surveille et ne corrige personne pendant cette phase</b> ; il note ce qu'il observe pour le retour au calme ; arrêt de toute la salle en cas de dérive, jamais d'un seul binôme.",
   "Aucun arrêt pour intensité excessive sur les trois séquences.",
   ["Revenir à une contrainte unique si l'intensité monte"]),
 L("58 – 64′ (6 min)",
   "Faire redescendre son rythme cardiaque par une marche active de trois minutes, puis réaliser cinq étirements tenus dix secondes.",
   "Marche active en cercle, puis étirements guidés des chaînes sollicitées.",
   "<b>Matériel :</b> protections retirées et rangées. <b>Dispositif :</b> cercle, marche puis assis. "
   "<b>Critères de réalisation :</b> respiration redevenue nasale avant les étirements, positions tenues 10 s. "
   "<b>Intensité :</b> faible. <b>Récupération :</b> c'est la phase de récupération. "
   "<b>Sécurité :</b> étirements seulement après retour du rythme cardiaque ; aucun étirement passif intense.",
   "Respiration nasale retrouvée avant les étirements ; cinq positions tenues.", []),
 L("64 – 71′ (7 min)",
   "Formuler un repère personnel qui a permis d'ajuster son intensité au partenaire, en une phrase, à voix haute devant le groupe.",
   "Tour de cercle : chacun énonce un repère — retour du partenaire, écart de gabarit, signal de l'enseignant, sensation propre. Échange entre binômes sur leur ressenti croisé.",
   "<b>Matériel :</b> aucun. <b>Dispositif :</b> cercle assis. "
   "<b>Critères de réalisation :</b> chacun s'exprime, le repère est formulé de façon concrète et non morale. "
   "<b>Intensité :</b> nulle. <b>Sécurité :</b> cadrage du retour — factuel, sur le comportement, jamais sur la personne.",
   "Chaque pratiquant formule un repère personnel de régulation de l'intensité.",
   ["Faire échanger les binômes sur leur ressenti"]),
 L("71 – 75′ (4 min)",
   "Recevoir un retour individuel de l'enseignant portant sur un point réussi et un axe de progrès, puis saluer.",
   "Retour individuel bref à chaque pratiquant, à partir des observations notées pendant le randori libre. Salut final.",
   "<b>Matériel :</b> notes de l'enseignant. <b>Dispositif :</b> cercle, retours à voix audible mais non appuyée. "
   "<b>Critères de réalisation :</b> chaque pratiquant reçoit un point réussi et un axe. <b>Intensité :</b> nulle. "
   "<b>Sécurité :</b> vérification qu'aucune douleur n'est signalée avant la sortie.",
   "Chacun a reçu un retour personnel comportant une réussite et un axe.", []),
]

# ══════════════════════════════════════ CO7 — Adultes / saisies — 75 min
PLANS["CO7"] = [
 L("0 – 5′ (5 min)",
   "Signaler à l'enseignant toute gêne articulaire du jour et tester le signal d'arrêt tactile, avant toute mise en action.",
   "Salut collectif, puis cercle. Annonce de l'objectif. Question ouverte sur les blessures ou gênes du jour. Annonce de la règle : aucun blocage ni torsion articulaire. Test du signal d'arrêt tactile — double frappe sur le partenaire ou sur soi.",
   "<b>Matériel :</b> aucun. <b>Dispositif :</b> cercle, tous debout. "
   "<b>Critères de réalisation :</b> chacun a répondu, chaque binôme a testé la double frappe. "
   "<b>Intensité :</b> nulle. <b>Sécurité :</b> le sondage conditionne les appariements ; alliances retirées, ongles vérifiés ; les deux pratiquants en reprise sont identifiés.",
   "Chacun a signalé ou non une gêne ; le signal tactile est testé par tous.", []),
 L("5 – 13′ (8 min)",
   "Mobiliser complètement poignets, coudes et épaules sans douleur, en respectant l'amplitude annoncée pour chaque articulation.",
   "Élévation générale par déplacements, puis mobilisation articulaire ascendante centrée sur la chaîne du membre supérieur : poignets en flexion-extension et rotation, coudes, épaules en circumduction.",
   "<b>Matériel :</b> aucun. <b>Dispositif :</b> dispersion. "
   "<b>Critères de réalisation :</b> amplitude progressive, jamais forcée ; arrêt à la première sensation de tension. "
   "<b>Rapidité :</b> lente. <b>Intensité :</b> faible. <b>Récupération :</b> continue. "
   "<b>Sécurité :</b> les pratiquants en reprise réduisent d'eux-mêmes l'amplitude ; aucune circumduction rapide de l'épaule.",
   "Amplitude complète sans douleur sur les trois articulations sollicitées.", []),
 L("13 – 20′ (7 min)",
   "Toucher l'avant-bras de son partenaire sans être touché, en se déplaçant, au cours de trois séries de soixante secondes.",
   "Jeu des mains à deux. Puis même jeu sur un pied, pour solliciter les appuis.",
   "<b>Matériel :</b> aucun. <b>Dispositif :</b> binômes appariés par gabarit, espacés de 2 m. "
   "<b>Critères de réalisation :</b> contact léger, garde des mains maintenue, appuis mobiles. "
   "<b>Rapidité :</b> modérée. <b>Intensité :</b> modérée. <b>Récupération :</b> 30 s entre deux séries. "
   "<b>Sécurité :</b> aucune saisie autorisée à ce stade ; contact limité à l'avant-bras.",
   "Trois séries tenues, sans saisie ni contact hors avant-bras.", ["Sur un pied", "Espace réduit"]),
 L("20 – 30′ (10 min)",
   "Identifier et nommer le point faible d'une saisie du poignet — l'ouverture entre pouce et doigts — après deux minutes de recherche libre.",
   "Saisie du poignet consentie, sans résistance. Recherche libre : le saisi explore où la prise cède. Puis mise en commun des trouvailles devant le groupe.",
   "<b>Matériel :</b> aucun. <b>Dispositif :</b> par deux, rotation à mi-temps. "
   "<b>Critères de réalisation :</b> le pratiquant explore sans forcer, verbalise sa trouvaille, la reproduit devant le groupe. "
   "<b>Rapidité :</b> lente. <b>Intensité :</b> faible. <b>Récupération :</b> 30 s à l'inversion. "
   "<b>Sécurité :</b> aucune résistance à ce niveau ; aucune torsion.",
   "Le pratiquant nomme l'ouverture pouce-doigts comme point de sortie.",
   ["Saisie à deux mains", "Saisie croisée", "Yeux fermés pour privilégier la sensation"]),
 L("30 – 40′ (10 min)",
   "Se libérer d'une saisie ferme mais statique en déplaçant ses appuis, bras relâché, sept fois sur dix.",
   "Niveau 2. Consigne explicite au saisisseur : « tu tiens fermement mais tu ne bouges pas les pieds ». Le saisi sort en déplaçant son corps, sans tirer.",
   "<b>Matériel :</b> aucun. <b>Dispositif :</b> par deux, appariements croisés en force, rotation toutes les 4 minutes. "
   "<b>Critères de réalisation :</b> déplacement du corps visible, bras relâché, aucune traction du biceps, la libération se fait par l'ouverture identifiée. "
   "<b>Rapidité :</b> lente à modérée. <b>Intensité :</b> modérée. <b>Récupération :</b> 30 s à chaque rotation. "
   "<b>Sécurité :</b> le saisisseur a une consigne d'intensité explicite ; aucune torsion ; arrêt sur double frappe.",
   "7 libérations sur 10 obtenues par déplacement, sans traction du bras.",
   ["Saisie plus haute ou plus basse", "Deux mains", "Position de départ désavantageuse"]),
 L("40 – 50′ (10 min)",
   "Se libérer d'une saisie prise en mouvement dans les deux secondes qui suivent le contact, six fois sur dix.",
   "Niveau 3. Le saisisseur se déplace et saisit au moment de son choix. Le saisi doit se libérer sans délai.",
   "<b>Matériel :</b> aucun. <b>Dispositif :</b> espace délimité par binôme, 4 binômes en simultané, rotation toutes les 3 minutes. "
   "<b>Critères de réalisation :</b> libération dans les 2 s, appuis mobiles au moment de la saisie, aucune crispation du bras saisi. "
   "<b>Rapidité :</b> modérée à soutenue. <b>Intensité :</b> soutenue. <b>Récupération :</b> 45 s à chaque rotation. "
   "<b>Sécurité :</b> le saisisseur ne verrouille jamais ; intensité annoncée ; l'enseignant surveille les épaules des pratiquants en reprise.",
   "La libération intervient dans les 2 secondes, 6 fois sur 10.",
   ["Deux saisies possibles", "Espace réduit", "Saisisseur plus rapide"]),
 L("50 – 60′ (10 min)",
   "Enchaîner la libération par une reprise de distance ou un contrôle, sans marquer de temps d'arrêt, six fois sur dix.",
   "Après la libération, action simple imposée : pas de côté avec reprise de distance, ou contrôle du bras du partenaire.",
   "<b>Matériel :</b> aucun. <b>Dispositif :</b> identique, espace élargi pour permettre la sortie. "
   "<b>Critères de réalisation :</b> action enchaînée sans temps d'arrêt, distance de sécurité reprise, garde reformée. "
   "<b>Rapidité :</b> soutenue. <b>Intensité :</b> soutenue. <b>Récupération :</b> 45 s toutes les deux séries. "
   "<b>Sécurité :</b> le contrôle ne devient jamais une clé ; zone de sortie dégagée et vérifiée.",
   "Libération suivie d'une action cohérente dans 6 cas sur 10.",
   ["Imposer le côté de sortie", "Saisisseur qui suit"]),
 L("60 – 68′ (8 min)",
   "Réaliser cinq étirements doux des membres supérieurs, chaque position tenue quinze secondes sans traction sur l'épaule.",
   "Récupération active par marche, puis étirements guidés : avant-bras, biceps, deltoïdes, chaîne postérieure.",
   "<b>Matériel :</b> aucun. <b>Dispositif :</b> cercle. "
   "<b>Critères de réalisation :</b> position tenue 15 s, respiration continue, aucune traction sur l'articulation de l'épaule. "
   "<b>Intensité :</b> faible. <b>Récupération :</b> c'est la phase de récupération. "
   "<b>Sécurité :</b> amplitude limitée à la sensation ; les pratiquants en reprise réduisent encore.",
   "Cinq positions tenues 15 s, sans douleur signalée.", []),
 L("68 – 75′ (7 min)",
   "Formuler en une phrase le principe mécanique découvert — sortir par le point faible en déplaçant le corps — devant le groupe.",
   "Question ouverte, réponses recueillies, formalisation du principe. Un binôme démontre. Annonce de la séance suivante. Salut final.",
   "<b>Matériel :</b> aucun. <b>Dispositif :</b> cercle, un binôme au centre pour la démonstration. "
   "<b>Critères de réalisation :</b> le principe est formulé par les pratiquants, en leurs termes, et démontré. "
   "<b>Intensité :</b> nulle. <b>Sécurité :</b> vérification qu'aucune gêne articulaire n'est apparue pendant la séance.",
   "Le groupe formule le principe mécanique en ses propres termes.",
   ["Faire démontrer par le binôme le plus hétérogène en force"]),
]

# ══════════════════════════════════ CO8 — Public adapté — 75 min
PLANS["CO8"] = [
 L("0 – 6′ (6 min)",
   "Repérer les limites du tatami et identifier son partenaire référent à la voix, avant toute mise en action.",
   "Salut collectif, puis cercle. Annonce de l'objectif commun à tous. Annonce explicite au groupe entier des trois adaptations retenues et de leur raison. Désignation des partenaires référents. Repérage tactile et sonore du tatami avec le pratiquant malvoyant.",
   "<b>Matériel :</b> 2 chaises, 8 plots de balisage, une clochette. <b>Dispositif :</b> cercle, tout le monde ensemble, aucun sous-groupe. "
   "<b>Critères de réalisation :</b> chacun sait ce qu'il va faire et avec qui ; le pratiquant malvoyant a parcouru le périmètre. "
   "<b>Intensité :</b> nulle. <b>Sécurité :</b> espace entièrement libéré, y compris en périphérie ; chaises testées ; point sur l'état du jour avec chacun.",
   "Chacun identifie son référent ; le périmètre a été repéré ; aucun pratiquant n'est mis à part.", []),
 L("6 – 14′ (8 min)",
   "Mobiliser chacune de ses articulations disponibles sur place, debout ou assis au choix, en suivant le rythme donné à la voix.",
   "Échauffement articulaire complet réalisé sur place. Rythme donné à la voix et à la clochette. Aucun déplacement collectif.",
   "<b>Matériel :</b> chaises disponibles pour tous, pas seulement pour ceux qui en ont besoin. "
   "<b>Dispositif :</b> cercle, chacun à son poste fixe, aucun déplacement. "
   "<b>Critères de réalisation :</b> amplitude complète sur les articulations disponibles ; chacun adapte sans avoir à le demander. "
   "<b>Rapidité :</b> lente. <b>Intensité :</b> faible. <b>Récupération :</b> continue. "
   "<b>Sécurité :</b> le travail sur place est un choix délibéré : le déplacement collectif est le premier facteur de désorientation.",
   "Chaque pratiquant mobilise l'ensemble de ses articulations disponibles.",
   ["Rythme accéléré", "Ajouter une rotation du tronc"]),
 L("14 – 24′ (10 min)",
   "Produire une action de protection cohérente après l'annonce vocale « haut » ou « bas », sept fois sur dix attaques.",
   "Par deux. Le partenaire annonce la zone puis attaque lentement avec la cible. Le pratiquant produit une protection : bras, déplacement, esquive du buste — la forme est libre.",
   "<b>Matériel :</b> 6 cibles souples, 2 chaises. <b>Dispositif :</b> postes fixes, chacun à sa place. "
   "<b>Seuls les attaquants se déplacent</b> pour la rotation. "
   "<b>Critères de réalisation :</b> la protection couvre la zone annoncée, quelle que soit sa forme ; le pratiquant assis travaille les mêmes zones. "
   "<b>Rapidité :</b> attaque lente, délai d'une seconde entre annonce et attaque. <b>Intensité :</b> faible. "
   "<b>Récupération :</b> 30 s toutes les 10 attaques. "
   "<b>Sécurité :</b> cible souple uniquement ; les postes ne sont jamais réorganisés en cours de séance.",
   "7 protections cohérentes sur 10 attaques annoncées.",
   ["Réduire le délai entre annonce et attaque", "Ajouter une troisième zone"]),
 L("24 – 36′ (12 min)",
   "Produire une action de protection cohérente sans annonce verbale préalable, sept fois sur dix attaques.",
   "Même dispositif, sans annonce de la zone. Pour le pratiquant malvoyant, l'annonce est remplacée par un contact préalable à l'avant-bras qui signale l'imminence de l'attaque, jamais sa direction.",
   "<b>Matériel :</b> identique. <b>Dispositif :</b> identique, rotation des attaquants toutes les 3 minutes. "
   "<b>Critères de réalisation :</b> réaction dans la seconde, protection couvrant la zone réellement attaquée. "
   "<b>Rapidité :</b> attaque à vitesse modérée. <b>Intensité :</b> modérée. <b>Récupération :</b> 30 s à chaque rotation. "
   "<b>Sécurité :</b> le signal tactile est une adaptation du <i>canal d'information</i>, pas une facilitation de la tâche — l'exigence reste identique pour tous.",
   "7 protections cohérentes sur 10 attaques non annoncées.",
   ["Varier le rythme des attaques", "Deux attaques successives", "Attaquant plus proche"]),
 L("36 – 48′ (12 min)",
   "Enchaîner la protection par une action de dégagement adaptée à ses possibilités, six fois sur dix.",
   "Après la protection, action de dégagement : pas de côté, rotation du buste, ou poussée sur la cible selon les possibilités de chacun.",
   "<b>Matériel :</b> identique, zone de dégagement matérialisée par les plots pour chaque poste. "
   "<b>Dispositif :</b> espace élargi autour de chaque poste, repères conservés à l'identique. "
   "<b>Critères de réalisation :</b> dégagement effectif dans une direction sûre, protection maintenue pendant le dégagement. "
   "<b>Rapidité :</b> modérée. <b>Intensité :</b> modérée. <b>Récupération :</b> 45 s toutes les 10 attaques. "
   "<b>Sécurité :</b> zone de dégagement délimitée et repérée individuellement ; aucun poste déplacé.",
   "La protection est suivie d'une action de dégagement dans 6 cas sur 10.",
   ["Imposer le côté du dégagement", "Attaquant qui suit"]),
 L("48 – 58′ (10 min)",
   "Tenir le rôle d'attaquant en dosant sa vitesse au partenaire, sur une série complète de dix attaques.",
   "Inversion complète des rôles. Chaque pratiquant devient attaquant et doit régler sa vitesse sur les possibilités de son partenaire.",
   "<b>Matériel :</b> identique. <b>Dispositif :</b> identique, rôles inversés. "
   "<b>Critères de réalisation :</b> vitesse adaptée au retour du partenaire, annonce claire si elle est requise, aucune attaque surprise non conventionnelle. "
   "<b>Rapidité :</b> réglée par l'attaquant, contrôlée par l'enseignant. <b>Intensité :</b> modérée. "
   "<b>Récupération :</b> 45 s. <b>Sécurité :</b> le rôle d'attaquant est valorisé au même titre que celui de défenseur — c'est une tâche exigeante, pas un rôle de second plan.",
   "L'attaquant règle sa vitesse sans que l'enseignant ait à intervenir.", ["Deux zones", "Rythme variable"]),
 L("58 – 66′ (8 min)",
   "Réaliser quatre étirements guidés, debout ou assis, chaque position tenue quinze secondes.",
   "Retour au calme : respiration guidée puis étirements doux, réalisables debout comme assis.",
   "<b>Matériel :</b> chaises. <b>Dispositif :</b> cercle, postes conservés. "
   "<b>Critères de réalisation :</b> position tenue 15 s, respiration continue ; chaque étirement est proposé en deux variantes, debout et assis. "
   "<b>Intensité :</b> faible. <b>Récupération :</b> c'est la phase de récupération. "
   "<b>Sécurité :</b> aucune amplitude forcée ; les variantes sont proposées à tous, jamais assignées.",
   "Quatre positions tenues 15 s, chacun dans la variante qui lui convient.", []),
 L("66 – 71′ (5 min)",
   "Énoncer devant le groupe une chose qu'on a réussie pendant la séance.",
   "Tour de cercle. Chacun cite une réussite. L'enseignant relance ceux qui minimisent.",
   "<b>Matériel :</b> aucun. <b>Dispositif :</b> cercle. "
   "<b>Critères de réalisation :</b> chacun cite une réussite concrète, pas une intention. "
   "<b>Intensité :</b> nulle. <b>Sécurité :</b> aucune obligation de parler, mais relance individuelle bienveillante.",
   "Chaque pratiquant énonce une réussite concrète.", []),
 L("71 – 75′ (4 min)",
   "Recevoir un retour individuel portant sur un point réussi et un axe de progrès, puis saluer.",
   "Retour individuel bref de l'enseignant à chaque pratiquant. Annonce de la séance suivante. Salut final.",
   "<b>Matériel :</b> aucun. <b>Dispositif :</b> cercle. "
   "<b>Critères de réalisation :</b> chaque pratiquant reçoit un point réussi et un axe, formulés avec la même exigence pour tous. "
   "<b>Intensité :</b> nulle. <b>Sécurité :</b> accompagnement du pratiquant malvoyant jusqu'à la sortie du tatami.",
   "Chacun a reçu un retour personnel, sans différence de niveau d'exigence.", []),
]

# ══════════════════════════════════════════════════════ Injection
cor = json.loads((C / "corriges.json").read_text(encoding="utf-8"))
manquants = [c["id"] for c in cor if c["id"] not in PLANS]
if manquants:
    raise SystemExit(f"Plans manquants : {manquants}")
for c in cor:
    c["plan"] = PLANS[c["id"]]
(C / "corriges.json").write_text(json.dumps(cor, ensure_ascii=False, indent=1), encoding="utf-8")

print(f"  {len(cor)} plans réécrits au format officiel")
for c in cor:
    fin = c["plan"][-1]["minutage"]
    print(f"    {c['id']}  {len(c['plan'])} séquences   fin {fin:<18} {c['contexte']['duree']}")
