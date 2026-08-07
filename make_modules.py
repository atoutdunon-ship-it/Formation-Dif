# -*- coding: utf-8 -*-
"""YOSEI-DIF — modules de connaissances (content/modules.json)."""
import json, re
from pathlib import Path
C = Path(__file__).parent / "content"
raw = json.loads((C / "_raw_pages.json").read_text(encoding="utf-8"))

EMOJI = re.compile("[\U0001F000-\U0001FAFF\u2190-\u21FF\u2600-\u27BF\u2B00-\u2BFF\uFE0F\u20E3\u2B50\u2757]")

def corps(html: str) -> str:
    """Isole les <div class="card">…</div> d'une page héritée, nettoyée."""
    out, i = [], 0
    while True:
        i = html.find('<div class="card">', i)
        if i < 0: break
        depth, j = 0, i
        for m in re.finditer(r"<(/?)div\b[^>]*>", html[i:]):
            depth += -1 if m.group(1) else 1
            if depth == 0: j = i + m.end(); break
        out.append(html[i:j]); i = j
    s = "\n".join(out)
    s = EMOJI.sub("", s)
    s = s.replace('<span class="memo-icon"></span>', '')
    s = re.sub(r'class="memo-icon"[^>]*>\s*<', 'class="memo-icon">!<', s)
    s = re.sub(r"\bkaraté\b", "Yoseikan Budo", s, flags=re.I)
    s = re.sub(r"\bFFKDA\b", "la fédération", s)
    s = re.sub(r"[ \t]+", " ", s)
    return s.strip()

TODO = lambda quoi: (
 '<div class="card todo"><h2>Contenu à compléter</h2>'
 '<p>Ce module doit être renseigné à partir de vos <strong>documents officiels</strong> '
 f'déposés dans le dossier <code>sources/</code> : {quoi}.</p>'
 '<p>Structure attendue : sections numérotées, tableaux de synthèse, encadrés mémo, '
 'puis fiche de synthèse imprimable. Le générateur reprend automatiquement le contenu '
 'placé dans <code>content/modules.json</code>.</p></div>')

FEDERAL = """
<div class="card"><h2>1. L'architecture du mouvement sportif</h2>
<p>Le jury attend une lecture claire de la chaîne institutionnelle, du pratiquant jusqu'à l'État. Savoir la restituer de mémoire est un attendu de base du DIF.</p>
<div class="table-wrap"><table>
<tr><th>Niveau</th><th>Structure</th><th>Rôle principal</th></tr>
<tr><td>International</td><td>Instances internationales de la discipline</td><td>Règles techniques, calendrier mondial, reconnaissance des grades</td></tr>
<tr><td>National</td><td>Fédération délégataire et discipline associée</td><td>Délégation ministérielle, grades, diplômes fédéraux, réglementation</td></tr>
<tr><td>Régional</td><td>Ligue</td><td>Formation des cadres, compétitions régionales, relais de la politique technique</td></tr>
<tr><td>Départemental</td><td>Comité départemental</td><td>Animation de proximité, stages, détection, soutien aux clubs</td></tr>
<tr><td>Local</td><td>Club (association loi 1901)</td><td>Accueil, enseignement, licences, vie associative</td></tr>
</table></div>
<div class="memo"><span class="memo-icon">!</span><div class="memo-body"><strong>Point de vigilance</strong>Le rattachement exact du Yoseikan Budo, le nom des instances et les intitulés des commissions doivent être vérifiés dans vos documents fédéraux à jour avant l'oral. Une erreur de dénomination est immédiatement relevée par le jury.</div></div>
</div>

<div class="card"><h2>2. Le club, association loi 1901</h2>
<h3>Organes</h3>
<ul>
<li><strong>Assemblée générale</strong> — organe souverain : approuve les comptes, le rapport moral, élit les dirigeants.</li>
<li><strong>Conseil d'administration</strong> — met en œuvre les décisions de l'AG entre deux assemblées.</li>
<li><strong>Bureau</strong> — président, trésorier, secrétaire : gestion courante et représentation.</li>
</ul>
<h3>Documents structurants</h3>
<ul>
<li><strong>Statuts</strong> — objet, fonctionnement, conditions d'adhésion et de radiation.</li>
<li><strong>Règlement intérieur</strong> — règles de vie, tenue, assiduité, sécurité, sanctions. Opposable dès lors qu'il est porté à connaissance.</li>
<li><strong>Projet associatif et projet pédagogique</strong> — ce que le club veut être, et comment l'enseignement le traduit sur le tatami.</li>
</ul>
<div class="memo"><span class="memo-icon">!</span><div class="memo-body"><strong>Place de l'instructeur</strong>L'instructeur fédéral n'est pas un prestataire technique isolé : il traduit le projet du club en progression pédagogique et rend compte au bureau.</div></div>
</div>

<div class="card"><h2>3. Licence, assurance et couverture</h2>
<p>La licence fédérale ouvre trois droits et une protection.</p>
<ul>
<li><strong>Adhésion</strong> à la fédération via le club, pour la saison sportive.</li>
<li><strong>Accès</strong> aux compétitions, stages, formations et passages de grade.</li>
<li><strong>Assurance</strong> en responsabilité civile et garanties de base, avec options complémentaires à la charge du licencié.</li>
</ul>
<h3>Ce que l'instructeur doit vérifier</h3>
<ul>
<li>Aucun pratiquant sur le tatami hors période d'essai sans licence en cours de validité.</li>
<li>Situation médicale conforme à la réglementation en vigueur (certificat ou questionnaire de santé, selon le public et l'année).</li>
<li>Autorisation parentale et personnes à prévenir, pour les mineurs.</li>
</ul>
<div class="memo"><span class="memo-icon">!</span><div class="memo-body"><strong>Conséquence directe</strong>Faire pratiquer une personne non couverte engage la responsabilité du club et celle de l'encadrant. C'est une question classique de l'entretien.</div></div>
</div>

<div class="card"><h2>4. Cadre réglementaire de l'encadrement</h2>
<h3>Bénévolat et rémunération</h3>
<div class="table-wrap"><table>
<tr><th></th><th>Encadrement bénévole</th><th>Enseignement contre rémunération</th></tr>
<tr><td>Titre requis</td><td>Diplôme fédéral (DIF et suite du cursus)</td><td>Certification professionnelle inscrite au répertoire national</td></tr>
<tr><td>Cadre</td><td>Fédéral</td><td>Code du sport</td></tr>
<tr><td>Déclaration</td><td>Via le club et la fédération</td><td>Déclaration d'éducateur sportif, carte professionnelle</td></tr>
</table></div>
<h3>Obligations communes</h3>
<ul>
<li><strong>Honorabilité</strong> — tout encadrant, bénévole ou rémunéré, est soumis au contrôle d'honorabilité.</li>
<li><strong>Obligation de moyens</strong> — sécurité des pratiquants, surveillance effective, adaptation au niveau et à l'âge.</li>
<li><strong>Obligation d'assistance</strong> — porter secours et alerter.</li>
<li><strong>Affichage</strong> — diplômes et attestations d'assurance affichés dans les locaux.</li>
</ul>
<div class="memo"><span class="memo-icon">!</span><div class="memo-body"><strong>Distinction à maîtriser</strong>La responsabilité civile est assurée ; la responsabilité pénale, elle, reste personnelle et ne s'assure pas. Le jury vérifie souvent que le candidat connaît cette différence.</div></div>
</div>

<div class="card"><h2>5. Le cursus fédéral de formation</h2>
<p>Le DIF s'inscrit dans un parcours progressif de formation de cadres. Situer son diplôme dans ce parcours, et savoir dire ce qu'il autorise et ce qu'il n'autorise pas, fait partie de l'évaluation.</p>
<ul>
<li><strong>Prérogatives du DIF</strong> — animer et encadrer des séances en club, à titre bénévole, dans le cadre défini par la fédération.</li>
<li><strong>Limites</strong> — pas d'enseignement contre rémunération, pas de substitution à un éducateur diplômé d'État là où celui-ci est requis.</li>
<li><strong>Suite du cursus</strong> — diplômes fédéraux supérieurs, puis voie professionnelle.</li>
</ul>
<div class="memo"><span class="memo-icon">!</span><div class="memo-body"><strong>À vérifier</strong>L'intitulé exact des diplômes du cursus et leurs prérogatives évoluent. Confirmez-les dans les textes fédéraux de la saison en cours.</div></div>
</div>

<div class="card"><h2>6. La saison et les événements fédéraux</h2>
<p>« À quels événements fédéraux avez-vous participé cette saison ? » est une question quasi certaine. Le jury attend des faits datés, pas des intentions.</p>
<div class="table-wrap"><table>
<tr><th>Période</th><th>Type d'événement</th><th>Ce que l'instructeur y fait</th></tr>
<tr><td>Rentrée</td><td>Assemblées générales, réunions de comité</td><td>Représenter le club, récupérer les informations de saison</td></tr>
<tr><td>Automne</td><td>Stages techniques, formations de cadres</td><td>Se former, faire progresser ses pratiquants</td></tr>
<tr><td>Hiver</td><td>Compétitions et coupes</td><td>Accompagner, encadrer, arbitrer selon les qualifications</td></tr>
<tr><td>Printemps</td><td>Passages de grade, stages de discipline</td><td>Présenter ses pratiquants, participer au jury selon son grade</td></tr>
<tr><td>Fin de saison</td><td>Démonstrations, fête du club, bilan</td><td>Valoriser la progression et préparer la saison suivante</td></tr>
</table></div>
<div class="memo"><span class="memo-icon">!</span><div class="memo-body"><strong>Préparation concrète</strong>Constituez avant l'oral une liste écrite de votre participation réelle sur la saison : dates, lieux, intitulés, rôle tenu. C'est la réponse la plus forte possible à cette question.</div></div>
</div>

<div class="card"><h2>7. Gestion des situations sensibles</h2>
<ul>
<li><strong>Accident</strong> — arrêt du cours, mise en sécurité du groupe, protection et bilan, alerte, information des responsables légaux et du président, déclaration à l'assurance dans les délais prévus.</li>
<li><strong>Comportement violent</strong> — arrêt immédiat, mise à l'écart du tatami, entretien après le cours, information des responsables légaux et du bureau, rappel du règlement intérieur.</li>
<li><strong>Suspicion de situation préoccupante concernant un mineur</strong> — ne pas enquêter soi-même, ne rien promettre de confidentiel, consigner les faits, alerter sans délai le président et les autorités compétentes.</li>
<li><strong>Conflit avec une famille</strong> — jamais au bord du tatami : entretien programmé, en présence d'un dirigeant si nécessaire.</li>
</ul>
</div>
"""

modules = [
 {"id":"m1","num":1,"titre":"Yoseikan Budo — histoire, filiation, principes",
  "sous_titre":"Origines, transmission, esprit de la discipline",
  "tags":["Discipline","Culture"],"statut":"a_completer",
  "html":TODO("historique de la discipline, filiation et transmission, principes directeurs, textes de référence")},
 {"id":"m2","num":2,"titre":"Contenu technique Yoseikan Budo",
  "sous_titre":"Répertoire technique, progression, programme de grades",
  "tags":["Technique","Grades"],"statut":"a_completer",
  "html":TODO("programme technique officiel, progression par grade, nomenclature des techniques, exigences des passages de grade")},
 {"id":"m3","num":3,"titre":"Pédagogie et méthodologie d'enseignement",
  "sous_titre":"Rôle de l'instructeur, structure de séance, méthodes, adaptation aux publics",
  "tags":["Cœur du DIF","Enseignement"],"statut":"pret","html":corps(raw["m3"])},
 {"id":"m4","num":4,"titre":"Environnement fédéral, réglementation et vie du club",
  "sous_titre":"Structure fédérale, licence et assurance, cadre d'encadrement, vie associative",
  "tags":["Fédéral","Réglementation"],"statut":"pret","html":FEDERAL.strip()},
 {"id":"m5","num":5,"titre":"Anatomie, physiologie et sécurité du pratiquant",
  "sous_titre":"Bases physiologiques, charge de travail, prévention et conduite à tenir",
  "tags":["Sécurité","Physiologie"],"statut":"pret","html":corps(raw["m5"])},
 {"id":"m6","num":6,"titre":"Vocabulaire et terminologie",
  "sous_titre":"Termes japonais utilisés dans la discipline et commandements du dojo",
  "tags":["Terminologie"],"statut":"a_completer",
  "html":TODO("lexique officiel de la discipline, commandements du dojo, comptage, nomenclature technique")},
]
(C/"modules.json").write_text(json.dumps(modules, ensure_ascii=False, indent=1), encoding="utf-8")
for m in modules:
    print(f"  {m['id']}  {m['statut']:12} {len(m['html']):>6} o  {m['titre']}")
