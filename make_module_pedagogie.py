# -*- coding: utf-8 -*-
"""YOSEI-DIF — module 03 : la doctrine officielle UF1 placée en tête du contenu existant."""
import json
from pathlib import Path
C = Path(__file__).parent

OFFICIEL = """
<div class="card"><h2>1. Ce qu'est enseigner — la définition officielle</h2>
<div class="cle"><div class="cle-k">Fiche UF1a</div><div class="cle-v">
« L'enseignement est fondé sur l'acquisition d'un ensemble de connaissances à transmettre avec méthode
à un public sous la forme d'objectifs à atteindre. »</div></div>
<p>La fiche décompose cette définition en <strong>quatre conditions</strong>, dans cet ordre :</p>
<div class="table-wrap"><table>
<tr><th>Condition</th><th>Ce qu'elle implique</th></tr>
<tr><td><strong>Connaître la discipline</strong></td>
<td>Analyser en profondeur toutes les techniques. Avoir une réflexion sur l'interaction de tous les
domaines : enchaînements dans le vide et en déplacement, modèle technique codifié, assauts conventionnels,
assauts libres. Cela suppose du <strong>vécu</strong> — une intégration physique et mentale — et un
<strong>esprit d'analyse</strong> en vue d'une organisation pédagogique objective et mesurable.</td></tr>
<tr><td><strong>Transmettre avec méthodologie</strong></td>
<td>« Un ensemble de démarches raisonnées, suivies et ordonnées pour parvenir à un but. » Élaborer des
objectifs précis, une programmation adaptée, un cycle d'enseignement. Établir un tableau d'apprentissage
des différents domaines. Tenir compte des difficultés propres à chacun. Maîtriser les techniques de communication.</td></tr>
<tr><td><strong>Connaître le public</strong></td>
<td>« L'enseignant doit connaître ses élèves pour savoir ce qu'il peut attendre d'eux. » Il doit se poser
sans cesse la question : <em>est-ce que les options pédagogiques choisies correspondent aux besoins de mes
pratiquants ?</em> Cette connaissance permet de répondre à leurs attentes et de renforcer leur motivation.</td></tr>
<tr><td><strong>Fixer un programme d'objectifs</strong></td>
<td>Deux catégories, intimement liées : les objectifs de <strong>progression technique et de performance</strong>
— préparation technique, tactique, physique — et les objectifs liés au <strong>calendrier sportif</strong> —
passages de grades, compétitions, démonstrations — ou au loisir, au bien-être et à la self-défense.
La première catégorie permet de réaliser au mieux la seconde.</td></tr>
</table></div>
<div class="memo"><span class="memo-icon">!</span><div class="memo-body"><strong>La formule à savoir restituer</strong>
Enseigner, c'est : connaître sa discipline — avoir un certain vécu et une bonne analyse de cette discipline —
élaborer des méthodes d'entraînement — établir une progressivité des apprentissages — planifier des objectifs —
déterminer des moyens d'évaluation — soigner ses formes d'expression.</div></div>
</div>

<div class="card"><h2>2. Pourquoi un plan de séance — les six fonctions</h2>
<div class="cle"><div class="cle-k">Fiche UF1b</div><div class="cle-v">
« Le plan de séance est nécessaire comme tableau de bord. Il est le guide de l'action et l'outil
d'évaluation du déroulement du cours. »</div></div>
<p>La fiche officielle énumère six fonctions. Le jury peut demander de les citer.</p>
<div class="table-wrap"><table>
<tr><th>Le plan de séance permet…</th><th>C'est-à-dire</th></tr>
<tr><td><strong>De situer la séance dans un ensemble plus large : la progression</strong></td>
<td>Relier le thème de la séance à l'objectif saisonnier (plan annuel) et prévoir en conséquence une
progressivité des apprentissages.</td></tr>
<tr><td><strong>De créer des activités et des situations de formation</strong></td>
<td>Poursuivre des objectifs concrets et cohérents avec l'échéance à atteindre.</td></tr>
<tr><td><strong>De prévoir l'utilisation des prérequis</strong></td>
<td>Faire émerger la connaissance des élèves : poser des questions, encourager la participation,
reformuler les réponses, faire discuter en fin de séance, faire réaliser par petits groupes.</td></tr>
<tr><td><strong>De repérer les notions essentielles</strong></td>
<td>Analyser les contenus, identifier les difficultés et les obstacles liés à l'apprentissage,
imaginer des solutions en termes d'éducatifs.</td></tr>
<tr><td><strong>De décrire les activités des élèves</strong></td>
<td>Choisir des situations éducatives simples, attractives et motivantes ; encourager, observer,
analyser les productions.</td></tr>
<tr><td><strong>De décrire le déroulement des actions pour enseigner</strong></td>
<td>Fournir des informations, faire des synthèses partielles, démontrer ce que l'on attend,
expérimenter, proposer des exercices, créer une situation de résolution de difficultés.</td></tr>
</table></div>
<div class="info-box">Formulation à retenir : « Le plan de séance est le <strong>tableau de commande</strong>
aidant à concevoir, contrôler et améliorer les activités d'enseignement et d'apprentissage. »</div>
</div>

<div class="card"><h2>3. La pédagogie par objectifs (PPO)</h2>
<div class="cle"><div class="cle-k">Fiche UF1c — le cœur de l'évaluation</div><div class="cle-v">
« L'objectif poursuivi décrit le produit final de l'action : ce que l'apprenant doit être capable de
réaliser à la fin de cette séquence d'apprentissage. »</div></div>
<h3>Trois niveaux à ne jamais confondre</h3>
<div class="table-wrap"><table>
<tr><th>Niveau</th><th>Définition officielle</th><th>Exemple de la fiche (karaté)</th><th>Transposition Yoseikan Budo</th></tr>
<tr><td><strong>Thème de la séance</strong></td>
<td>Indique de manière <strong>générique</strong> le sujet traité. Ne précise ni le type de technique,
ni la manière de l'utiliser.</td>
<td>« Perfectionnement des techniques de poing en situation d'opposition »</td>
<td>« Perfectionnement de la liaison percussion-projection en situation d'opposition »</td></tr>
<tr><td><strong>Objectif principal</strong></td>
<td>Indique <strong>précisément</strong> l'élément technique étudié, en cohérence avec le thème.</td>
<td>« Optimiser la réactivité d'une attaque en coup de poing avant (mae-te) et arrière (gyaku zuki) »</td>
<td>« Optimiser l'entrée qui suit une percussion directe, pour amener la projection »</td></tr>
<tr><td><strong>Objectifs poursuivis</strong></td>
<td>Des <strong>paliers d'apprentissage</strong>, un par séquence. Chacun exprime clairement une
compétence à développer.</td>
<td>« Viser une cible fixe avec un coup de poing avant et arrière, après un signal visuel »</td>
<td>« Entrer dans l'espace ouvert par la percussion, après un signal du partenaire »</td></tr>
</table></div>
<h3>La règle d'univocité</h3>
<p>Un objectif poursuivi est <strong>univoque</strong> : « ce qui est prononcé clairement par l'enseignant,
entendu et appliqué sans équivoque par l'élève ». Il se construit en deux temps :</p>
<ul>
<li><strong>Ce que</strong> vous voulez faire — « viser une cible fixe avec un coup de poing avant et arrière ».
À ce stade, l'énoncé montre seulement l'intention ; il ne dévoile pas encore le résultat final.</li>
<li><strong>Comment</strong> vous voulez le faire — « …à mon signal ». C'est ce complément qui rend l'énoncé univoque.</li>
</ul>
<div class="memo"><span class="memo-icon">!</span><div class="memo-body"><strong>Le test à s'appliquer</strong>
« Il est impossible pour l'élève de faire autre chose que ce que vous lui avez demandé de faire. »
Si votre objectif poursuivi laisse une marge d'interprétation, il n'est pas univoque — donc pas évaluable,
donc insuffisant. « Travailler les déplacements » échoue au test ; « se déplacer en gardant la cible dans
l'axe, au signal » le réussit.</div></div>
<div class="info-box">Cette manière de raisonner s'accorde à <strong>tous les compartiments</strong>
du plan de séance : échauffement, corps de séance, opposition, retour au calme. Chacun a son objectif
poursuivi, univoque.</div>
</div>

<div class="card"><h2>4. Les quatre colonnes du plan de séance</h2>
<p>Le plan de séance type comporte <strong>deux parties</strong> : la présentation de la séance avec
l'identification de l'enseignant, placée <em>en haut de page à l'extérieur du tableau</em> ; puis le tableau
à quatre colonnes.</p>
<h3>L'en-tête</h3>
<div class="table-wrap"><table>
<tr><th>Champ</th><th>Ce qu'on y met</th></tr>
<tr><td>Nom et prénom</td><td>Écrits lisiblement — nécessaire au retour de vos exercices corrigés.</td></tr>
<tr><td>Thème de la séance</td><td>Le sujet, de manière générique.</td></tr>
<tr><td>Objectif principal de la séance</td><td>L'élément technique précis.</td></tr>
<tr><td>Élèves concernés</td><td>Le public <strong>et son niveau de pratique</strong>. Exemple officiel :
« public enfants (pupilles) niveau débutant ».</td></tr>
<tr><td>Durée de la séance</td><td>Déterminée en tenant compte de l'âge du public.
Exemple officiel : juniors 16-17 ans = 1 h 30.</td></tr>
</table></div>
<h3>Le tableau</h3>
<div class="table-wrap"><table>
<tr><th>Colonne</th><th>Contenu attendu</th></tr>
<tr><td><strong>Objectifs poursuivis</strong></td><td>Le palier d'apprentissage, énoncé de façon univoque.</td></tr>
<tr><td><strong>Description des exercices</strong></td><td>Décrire <strong>succinctement</strong> l'exercice,
en cohérence avec l'objectif. Exemple officiel : « Par binôme, uke place une cible hauteur jodan et une cible
hauteur chudan. Tori, en garde, porte mae-te / gyaku zuki sur les cibles correspondantes. Série de cinq
répétitions côté droit et côté gauche. »</td></tr>
<tr><td><strong>Organisation matérielle et consignes</strong></td><td>Le <strong>matériel pédagogique</strong>
utilisé — dans l'exemple, « une cible rouge ou bleue ». Puis les points essentiels à respecter :
critères de réalisation technique, niveau de rapidité et de puissance, intensité de l'effort,
temps de récupération.</td></tr>
<tr><td><strong>Minutage</strong></td><td>Le temps nécessaire à la réalisation de l'exercice, fixé de manière
appropriée. Exemple officiel : « pour ces deux éducatifs = 10 minutes ».</td></tr>
</table></div>
<div class="btn-row"><button class="btn btn-primary" onclick="showPage('plan')">Ouvrir le constructeur au format officiel</button></div>
</div>
"""

mods = json.loads((C / "modules.json").read_text(encoding="utf-8"))
for m in mods:
    if m["id"] == "m3":
        ancien = m["html"]
        transition = ('<div class="card"><h2>Compléments méthodologiques</h2>'
                      '<p>Ce qui suit prolonge la doctrine officielle sans la contredire : méthodes '
                      'd\'enseignement, adaptation aux publics, sécurité au dojo, gestion de groupe.</p></div>')
        m.update({
            "titre": "Enseignement et animation (UF1)",
            "sous_titre": "Doctrine officielle, pédagogie par objectifs, plan de séance au format fédéral",
            "tags": ["UF1", "Cœur du DIF", "Officiel"],
            "html": OFFICIEL.strip() + "\n" + transition + "\n" + ancien})
(C / "modules.json").write_text(json.dumps(mods, ensure_ascii=False, indent=1), encoding="utf-8")
for m in mods:
    print(f"  {m['id']}  {m['statut']:12} {len(m['html']):>6} o  {m['titre']}")
