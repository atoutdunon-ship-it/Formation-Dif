#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
YOSEI-DIF — générateur du site de préparation au Diplôme d'Instructeur Fédéral,
spécialité Yoseikan Budo.

    python3 build.py [--out ../indexYoseikan.html]

Le contenu vit dans content/*.json ; ce script n'assemble que la présentation.
"""
from __future__ import annotations

import argparse
import html
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
CONTENT = ROOT / "content"

EMOJI = re.compile("[\U0001F000-\U0001FAFF\u2600-\u27BF\u2B00-\u2BFF\uFE0F\u20E3\u2B50\u2757]")
E = html.escape


def load(name: str):
    return json.loads((CONTENT / name).read_text(encoding="utf-8"))


# ─────────────────────────────────────────────────────────── fragments
def sidebar(mods, quiz) -> str:
    def link(pid, num, label, track=False, statut="pret"):
        flag = '<span class="flag"></span>' if track else ""
        attrs = f' data-track="1" data-status="{statut}"' if track else ""
        return (f'<a data-page="{pid}"{attrs} onclick="showPage(\'{pid}\')">'
                f'<span class="n">{num}</span><span>{E(label)}</span>{flag}</a>')

    out = ['<nav id="sidebar">', '<div class="nav-sec">Pilotage</div>',
           link("home", "00", "Tableau de bord"),
           '<div class="nav-sec">Épreuve — outils actifs</div>',
           link("sim", "A", "Simulateur d'épreuve"),
           link("plan", "B", "Plan de séance"),
           link("jury", "C", "Entretien avec le jury"),
           link("saison", "D", "Planification de saison"),
           link("exos", "E", "Banque d'exercices"),
           '<div class="nav-sec">Modules de connaissances</div>']
    out += [link(m["id"], f'{m["num"]:02d}', m["titre"], True, m["statut"]) for m in mods]
    out.append('<div class="nav-sec">Évaluation</div>')
    out += [link(q, f'Q{i+1}', quiz[q]["titre"].replace("Quiz — ", ""), True, quiz[q]["statut"])
            for i, q in enumerate(quiz)]
    out.append(link("exam", "EB", "Examen blanc"))
    out.append('<div class="nav-sec">Données</div>')
    out.append(link("data", "--", "Sauvegarde et restauration"))
    out.append("</nav>")
    return "\n".join(out)


def page(pid: str, body: str) -> str:
    return f'<div id="page-{pid}" class="page">\n{body}\n</div>'


def home(cfg, mods, quiz) -> str:
    objs = "".join(
        f'<div class="obj"><div class="o-n">{i+1}</div><div><div class="o-t">{E(t)}</div>'
        f'<div class="o-d">{E(d)}</div></div></div>'
        for i, (t, d) in enumerate(cfg["objectifs"]))
    cards = "".join(
        f'<div class="mcard" onclick="showPage(\'{m["id"]}\')">'
        f'<div class="m-n">MODULE {m["num"]:02d}</div><div class="m-t">{E(m["titre"])}</div>'
        f'<div class="m-s">{E(m["sous_titre"])}</div>'
        f'<div class="m-st" data-mst="{m["id"]}" data-status="{m["statut"]}"></div></div>'
        for m in mods)
    qcards = "".join(
        f'<div class="mcard" onclick="showPage(\'{q}\')"><div class="m-n">QUIZ {i+1:02d}</div>'
        f'<div class="m-t">{E(quiz[q]["titre"].replace("Quiz — ", ""))}</div>'
        f'<div class="m-s">{len(quiz[q]["questions"])} questions</div>'
        f'<div class="m-st" data-mst="{q}" data-status="{quiz[q]["statut"]}"></div></div>'
        for i, q in enumerate(quiz))
    outils = [
        ("sim", "Simulateur d'épreuve", "Tirage au sort du thème, chronomètre à trois phases, attendus et pièges du jury."),
        ("plan", "Constructeur de plan de séance", "Trame complète conforme aux attendus, enregistrement et impression."),
        ("jury", "Entretien avec le jury", f"{len(load('jury.json'))} questions classées, chronomètre et éléments de réponse."),
        ("saison", "Planification de saison", "Cycles annuels, objectifs et repères fédéraux, notes personnelles."),
        ("exos", "Banque d'exercices", "Situations filtrables par phase et par public, avec critères et variables."),
    ]
    ocards = "".join(
        f'<div class="mcard" onclick="showPage(\'{i}\')"><div class="m-n">OUTIL</div>'
        f'<div class="m-t">{E(t)}</div><div class="m-s">{E(d)}</div></div>' for i, t, d in outils)

    return page("home", f"""
<div class="card hero">
  <div class="kicker">{E(cfg["code"])} — version {E(cfg["version"])}</div>
  <h2>{E(cfg["titre"])}</h2>
  <p>{E(cfg["sous_titre"])}. Cet espace est construit autour d'un principe : le DIF n'évalue pas
  ce que vous savez, il évalue ce que vous êtes capable de concevoir, d'animer et de justifier
  devant un jury. Les outils actifs passent donc avant les modules de connaissances.</p>
</div>

<div class="warn-box" id="warn-storage" style="display:none">
  Votre navigateur n'autorise pas l'enregistrement local sur ce fichier. Vos plans de séance
  resteront disponibles pendant la session mais seront perdus à la fermeture : utilisez
  <strong>Sauvegarde et restauration</strong> pour exporter votre travail.
</div>

<div class="prog">
  <div class="prog-main">
    <div class="prog-lbl"><span>Progression sur les contenus disponibles</span><b id="prog-text">0 / 0</b></div>
    <div class="bar"><div class="fill" id="prog-fill" style="width:0%"></div></div>
  </div>
  <div class="prog-pct" id="prog-pct">0%</div>
</div>

<div class="grid g3" style="margin-bottom:16px">
  <div class="stat"><div class="s-v" id="stat-sim">0</div><div class="s-k">Simulations lancées</div></div>
  <div class="stat"><div class="s-v" id="stat-plans">0</div><div class="s-k">Plans de séance enregistrés</div></div>
  <div class="stat"><div class="s-v" id="stat-jury">0</div><div class="s-k">Questions de jury travaillées</div></div>
</div>

<div class="card">
  <h2>Ce que le jury évalue</h2>
  <p>Cinq objectifs, une seule finalité : votre capacité à concevoir, animer, planifier et adapter
  votre enseignement à différents publics et contextes.</p>
  {objs}
  <div class="divider"></div>
  <h3>Déroulé de l'épreuve</h3>
  <div class="table-wrap"><table>
    <tr><th>Phase</th><th>Durée</th><th>Ce qui se joue</th></tr>
    <tr><td>Préparation écrite</td><td>30 minutes</td><td>Le thème est tiré au sort en tout début d'épreuve. Vous élaborez seul votre plan de séance.</td></tr>
    <tr><td>Animation</td><td>20 minutes</td><td>Mise en situation pédagogique réelle : consignes, organisation, sécurité, régulation.</td></tr>
    <tr><td>Entretien pédagogique</td><td>10 minutes</td><td>Questions sur la séance conduite, votre vision pédagogique et la vie fédérale.</td></tr>
  </table></div>
  <div class="memo"><span class="memo-icon">!</span><div class="memo-body"><strong>Durée totale</strong>
  1 heure si le public tiré au sort concerne les enfants, 1 h 30 pour les adolescents et les adultes.
  Le suivi de l'intégralité de la formation en présentiel conditionne la présentation à l'examen.</div></div>
</div>

<div class="card"><h2>Outils d'entraînement</h2>
  <p>Le cœur du dispositif. Utilisez-les dans l'ordre : simuler, construire, défendre.</p>
  <div class="grid g3">{ocards}</div>
</div>

<div class="card"><h2>Modules de connaissances</h2><div class="grid g3">{cards}</div></div>
<div class="card"><h2>Auto-évaluation</h2><div class="grid g3">{qcards}</div>
  <div class="btn-row"><button class="btn btn-primary" onclick="showPage('exam')">Lancer un examen blanc</button></div>
</div>""")


def page_sim(cfg, themes) -> str:
    chips = "".join(f'<button class="chip" data-p="{k}" onclick="simSetPublic(\'{k}\')">{E(v["label"])}</button>'
                    for k, v in cfg["epreuve"].items())
    return page("sim", f"""
<div class="banner"><div class="b-num">Outil A</div><h2>Simulateur d'épreuve</h2>
  <p>Conditions réelles : tirage au sort du thème, puis les trois phases enchaînées au chronomètre.</p>
  <div class="b-tags"><span class="b-tag">Tirage au sort</span><span class="b-tag">Chronomètre</span>
  <span class="b-tag b-tag-gold">{len(themes)} thèmes</span></div></div>

<div class="card"><h2>1. Choisir le public de l'épreuve</h2>
  <p>Le public conditionne la durée totale et la banque de thèmes mobilisée.</p>
  <div class="chips" id="sim-publics">{chips}</div>
  <div class="info-box" id="sim-format"></div>
  <div class="btn-row"><button class="btn btn-primary btn-lg" onclick="simDraw()">Tirer un thème au sort</button></div>
</div>

<div class="draw" id="sim-draw"><div class="d-kick">En attente</div>
  <div class="d-title">Aucun thème tiré</div>
  <div class="d-meta">Choisissez un public, puis lancez le tirage.</div></div>

<div id="sim-after" style="display:none">
  <div class="chrono" id="sim-chrono"></div>
  <div class="card"><h2>2. Préparation</h2>
    <p>Vous disposez de 30 minutes pour élaborer votre plan de séance. Ouvrez le constructeur :
    le thème et le public y sont déjà reportés.</p>
    <div class="btn-row">
      <button class="btn btn-primary" onclick="showPage('plan')">Ouvrir le constructeur de plan de séance</button>
      <button class="btn btn-ghost" onclick="simRevealHints()">Afficher / masquer les attendus du jury</button>
    </div>
  </div>
  <div id="sim-hints" style="display:none"></div>
  <div id="sim-debrief" style="display:none">
    <div class="card"><h2>3. Auto-analyse à chaud</h2>
      <p>À faire immédiatement après l'animation, avant de consulter quoi que ce soit.</p>
      <ul>
        <li>Mon objectif était-il unique, opérationnel, et l'ai-je annoncé ?</li>
        <li>Quel critère de réussite ai-je réellement observé, et sur combien de pratiquants ?</li>
        <li>Quel a été mon temps de parole cumulé par rapport au temps de pratique ?</li>
        <li>Quelle variable didactique ai-je fait varier, et pourquoi celle-là ?</li>
        <li>Qu'est-ce que je change si je refais cette séance demain ?</li>
      </ul>
      <div class="btn-row"><button class="btn btn-primary" onclick="showPage('jury')">Passer à l'entretien avec le jury</button></div>
    </div>
  </div>
</div>""")


def page_plan(cfg, plan) -> str:
    def field(cid, label, kind):
        if kind == "select_public":
            opts = "".join(f'<option value="{k}">{E(v["label"])}</option>' for k, v in cfg["epreuve"].items())
            ctrl = f'<select id="f-{cid}">{opts}</select>'
        elif kind == "textarea":
            ctrl = f'<textarea id="f-{cid}"></textarea>'
        else:
            ctrl = f'<input type="text" id="f-{cid}">'
        return f'<div class="field"><label for="f-{cid}">{E(label)}</label>{ctrl}</div>'

    blocks = "".join(
        f'<fieldset><legend>{E(s["titre"])}</legend>'
        + "".join(field(*c) for c in s["champs"]) + "</fieldset>" for s in plan)

    return page("plan", f"""
<div class="banner"><div class="b-num">Outil B</div><h2>Constructeur de plan de séance</h2>
  <p>La trame attendue par le jury, champ par champ. Rien de ce qui compte n'y est facultatif.</p>
  <div class="b-tags"><span class="b-tag">Trame complète</span><span class="b-tag">Enregistrement</span>
  <span class="b-tag b-tag-gold">Impression</span></div></div>

<div class="card"><h2>Trois erreurs qui coûtent des points</h2>
  <ul>
    <li><strong>Un thème pris pour un objectif.</strong> Le thème est tiré au sort ; l'objectif, c'est ce dont
    le pratiquant sera capable à la fin. Formulez-le en une phrase, avec un verbe d'action.</li>
    <li><strong>Un critère de réussite non observable.</strong> « Mieux maîtriser » n'est pas un critère.
    « Toucher la cible sans être touché sur six répétitions sur dix » en est un.</li>
    <li><strong>Aucune régulation prévue.</strong> Le jury attend un plan B et une différenciation, dans les
    deux sens : pour celui qui échoue comme pour celui qui a déjà réussi.</li>
  </ul>
</div>

<div class="card">{blocks}
  <div class="btn-row">
    <button class="btn btn-primary" onclick="planSave()">Enregistrer ce plan</button>
    <button class="btn btn-ghost" onclick="planPrint()">Imprimer / exporter en PDF</button>
    <button class="btn btn-ghost" onclick="planClear()">Vider le formulaire</button>
  </div>
</div>

<div class="card"><h2>Plans enregistrés</h2><div id="plan-list"></div></div>""")


def page_jury(jury) -> str:
    cats = ["*"] + sorted({q["cat"] for q in jury}, key=lambda c: [q["cat"] for q in jury].index(c))
    chips = "".join(
        f'<button class="chip{" on" if c == "*" else ""}" data-c="{E(c)}" onclick="juryStart(\'{E(c)}\')">'
        f'{"Toutes les catégories" if c == "*" else E(c)}</button>' for c in cats)
    return page("jury", f"""
<div class="banner"><div class="b-num">Outil C</div><h2>Entretien avec le jury</h2>
  <p>Dix minutes de questions, c'est court. Ce qui se joue : la lucidité sur sa propre séance
  et la cohérence de sa vision pédagogique.</p>
  <div class="b-tags"><span class="b-tag">{len(jury)} questions</span><span class="b-tag">Tirage aléatoire</span>
  <span class="b-tag b-tag-gold">Chronomètre</span></div></div>

<div class="card"><h2>Méthode de réponse en quatre temps</h2>
  <div class="table-wrap"><table>
    <tr><th>Temps</th><th>Ce que vous dites</th></tr>
    <tr><td>1. Le fait</td><td>Ce que j'ai fait, concrètement, dans la séance.</td></tr>
    <tr><td>2. L'intention</td><td>Pourquoi ce choix plutôt qu'un autre.</td></tr>
    <tr><td>3. L'observation</td><td>Ce que j'ai vu se produire, y compris ce qui n'a pas fonctionné.</td></tr>
    <tr><td>4. La régulation</td><td>Ce que j'en tire et ce que je changerais.</td></tr>
  </table></div>
  <div class="memo"><span class="memo-icon">!</span><div class="memo-body"><strong>Ce qui est valorisé</strong>
  L'auto-analyse lucide. Un candidat qui identifie lui-même la faiblesse de sa séance et propose une
  correction pertinente est mieux noté qu'un candidat qui défend une séance imparfaite.</div></div>
</div>

<div class="card"><h2>Choisir un domaine</h2><div class="chips" id="jury-cats">{chips}</div></div>
<div id="jury-box"></div>""")


def page_saison(saison) -> str:
    cycles = "".join(
        f'<div class="cyc"><div class="c-p">{E(c["periode"])}</div><h3>{E(c["cycle"])}</h3>'
        f'<h4>Objectifs</h4><ul>' + "".join(f"<li>{E(o)}</li>" for o in c["objectifs"]) + "</ul>"
        f'<h4>Repères fédéraux et vie du club</h4><ul>' + "".join(f"<li>{E(r)}</li>" for r in c["reperes"]) + "</ul>"
        f'<div class="field"><label>Déclinaison pour mon club</label>'
        f'<textarea data-cyc="c{i}" placeholder="Contenus retenus, créneaux, publics concernés, dates clés…"></textarea></div></div>'
        for i, c in enumerate(saison))
    return page("saison", f"""
<div class="banner"><div class="b-num">Outil D</div><h2>Planification de saison</h2>
  <p>Deuxième objectif du DIF. Le jury vérifie que votre séance n'est pas isolée mais s'inscrit
  dans une progression annuelle assumée.</p>
  <div class="b-tags"><span class="b-tag">5 cycles</span><span class="b-tag">Éditable</span></div></div>

<div class="card"><h2>Les trois niveaux de planification</h2>
  <div class="table-wrap"><table>
    <tr><th>Niveau</th><th>Horizon</th><th>Ce qu'on y décide</th></tr>
    <tr><td>Macrocycle</td><td>La saison</td><td>Grands objectifs, échéances, cycles, évaluation</td></tr>
    <tr><td>Mésocycle</td><td>4 à 8 semaines</td><td>Thème dominant, progression technique, montée en charge</td></tr>
    <tr><td>Microcycle</td><td>La semaine, la séance</td><td>Objectif opérationnel, situations, critères</td></tr>
  </table></div>
  <div class="memo"><span class="memo-icon">!</span><div class="memo-body"><strong>Question fréquente</strong>
  « Où se situe la séance que vous venez de conduire dans votre saison ? » Préparez une réponse
  précise : cycle, semaine, ce qui précède et ce qui suit.</div></div>
</div>

{cycles}
<div class="btn-row"><button class="btn btn-primary" onclick="saisonSave()">Enregistrer ma planification</button>
<button class="btn btn-ghost" onclick="window.print()">Imprimer</button></div>""")


def page_exos(cfg, exos) -> str:
    phases = sorted({e["phase"] for e in exos}, key=lambda p: [e["phase"] for e in exos].index(p))
    ph = '<button class="chip on" data-f="phase" data-v="*" onclick="exFilter(\'phase\',\'*\')">Toutes les phases</button>' + "".join(
        f'<button class="chip" data-f="phase" data-v="{E(p)}" onclick="exFilter(\'phase\',\'{E(p)}\')">{E(p)}</button>' for p in phases)
    pu = '<button class="chip on" data-f="pub" data-v="*" onclick="exFilter(\'pub\',\'*\')">Tous les publics</button>' + "".join(
        f'<button class="chip" data-f="pub" data-v="{k}" onclick="exFilter(\'pub\',\'{k}\')">{E(v["label"])}</button>'
        for k, v in cfg["epreuve"].items())
    return page("exos", f"""
<div class="banner"><div class="b-num">Outil E</div><h2>Banque d'exercices</h2>
  <p>Des situations prêtes à l'emploi, chacune avec son critère de réussite, ses variables
  didactiques et ses consignes de sécurité — exactement ce que le jury vous demandera de justifier.</p>
  <div class="b-tags"><span class="b-tag">{len(exos)} situations</span><span class="b-tag">Filtrable</span></div></div>

<div class="card"><h2>Filtres</h2><div class="chips">{ph}</div><div class="chips">{pu}</div></div>
<div id="ex-list"></div>

<div class="card"><h2>Enrichir cette banque</h2>
  <p>Ajoutez vos propres situations dans <code>content/exercices.json</code>, puis relancez
  <code>python3 build.py</code>. Chaque entrée doit comporter un critère de réussite observable
  et des consignes de sécurité : c'est la grille de lecture du jury.</p></div>""")


def page_module(m) -> str:
    tags = "".join(f'<span class="b-tag">{E(t)}</span>' for t in m["tags"])
    nav_prev = f'<button class="btn btn-ghost" onclick="showPage(\'m{m["num"]-1}\')">Module précédent</button>' if m["num"] > 1 else "<span></span>"
    nav_next = (f'<button class="btn btn-primary" onclick="markDone(\'{m["id"]}\'); showPage(\'m{m["num"]+1}\')">Valider et continuer</button>'
                if m["num"] < 6 else
                f'<button class="btn btn-primary" onclick="markDone(\'{m["id"]}\'); showPage(\'exam\')">Valider et passer à l\'examen blanc</button>')
    quiz_btn = f'<div class="btn-row"><button class="btn btn-ghost" onclick="showPage(\'q{m["num"]}\')">Tester mes connaissances sur ce module</button></div>'
    return page(m["id"], f"""
<div class="banner"><div class="b-num">Module {m["num"]:02d} / 06</div><h2>{E(m["titre"])}</h2>
  <p>{E(m["sous_titre"])}</p><div class="b-tags">{tags}</div></div>
{m["html"]}
{quiz_btn}
<div class="nav-btns">{nav_prev}{nav_next}</div>""")


def page_quiz(qid, q, idx) -> str:
    n = len(q["questions"])
    return page(qid, f"""
<div class="banner"><div class="b-num">Auto-évaluation {idx+1:02d}</div><h2>{E(q["titre"].replace("Quiz — ", ""))}</h2>
  <p>{n} questions, seuil de réussite 70 %. Les questions sont tirées dans un ordre aléatoire à chaque tentative.</p></div>
<div id="quiz-{qid}"></div>
<div class="nav-btns"><button class="btn btn-ghost" onclick="showPage('{q["module"]}')">Revenir au module</button>
<button class="btn btn-ghost" onclick="renderQuiz('{qid}')">Réinitialiser</button></div>""")


def page_exam(quiz) -> str:
    dispo = [q for q in quiz.values() if q["questions"]]
    return page("exam", f"""
<div class="banner"><div class="b-num">Évaluation générale</div><h2>Examen blanc</h2>
  <p>Dix questions par section disponible, tirées au sort. Seuil de réussite : 70 %.</p></div>
<div id="exam-intro">
  <div class="card"><h2>Sections mobilisées</h2>
  <div class="table-wrap"><table><tr><th>Section</th><th>Banque</th><th>Tirées</th></tr>""" +
    "".join(f'<tr><td>{E(q["titre"].replace("Quiz — ", ""))}</td><td>{len(q["questions"])}</td><td>10</td></tr>' for q in dispo) +
    f"""</table></div>
  <div class="info-box">L'examen blanc porte sur les connaissances. Il ne remplace pas le
  simulateur d'épreuve, qui travaille la compétence réellement évaluée le jour J.</div>
  <div class="btn-row"><button class="btn btn-primary btn-lg" onclick="examStart()">Démarrer l'examen blanc</button></div>
  </div>
</div>
<div id="exam-body" style="display:none"></div>""")


def page_data(cfg) -> str:
    return page("data", f"""
<div class="banner"><div class="b-num">Données</div><h2>Sauvegarde et restauration</h2>
  <p>Vos plans de séance, votre planification et votre progression sont stockés dans le navigateur.
  Exportez-les régulièrement.</p></div>
<div class="card"><h2>Exporter</h2>
  <p>Génère un fichier JSON contenant l'intégralité de votre travail.</p>
  <div class="btn-row"><button class="btn btn-primary" onclick="exportData()">Télécharger ma sauvegarde</button></div>
  <h3>Restaurer</h3>
  <p>Le contenu importé remplace les données actuelles.</p>
  <input type="file" accept="application/json" onchange="importData(this)" style="font-size:.85rem">
</div>
<div class="card"><h2>Faire évoluer ce site</h2>
  <p>Le site est généré. Pour le modifier, éditez les fichiers de <code>content/</code> puis relancez :</p>
  <div class="table-wrap"><table>
    <tr><th>Fichier</th><th>Contenu</th></tr>
    <tr><td><code>modules.json</code></td><td>Les six modules de connaissances (HTML)</td></tr>
    <tr><td><code>quiz.json</code></td><td>Les banques de questions par module</td></tr>
    <tr><td><code>themes.json</code></td><td>Les thèmes de tirage au sort, par public</td></tr>
    <tr><td><code>exercices.json</code></td><td>La banque de situations d'apprentissage</td></tr>
    <tr><td><code>jury.json</code></td><td>Les questions d'entretien et les éléments attendus</td></tr>
    <tr><td><code>saison.json</code></td><td>Les cycles de la saison sportive</td></tr>
    <tr><td><code>plan_modele.json</code></td><td>La trame du plan de séance</td></tr>
  </table></div>
  <p>Déposez vos documents officiels dans <code>sources/</code> : ils serviront à renseigner les
  modules marqués « à compléter ».</p>
  <div class="memo"><span class="memo-icon">!</span><div class="memo-body"><strong>Nom de code</strong>
  {E(cfg["code"])} — à citer pour réimplanter ce dispositif dans une autre discipline ou une autre formation.</div></div>
</div>""")


# ─────────────────────────────────────────────────────────── assemblage
def build(out: Path) -> Path:
    cfg = load("config.json")
    mods = load("modules.json")
    quiz = load("quiz.json")
    themes = load("themes.json")
    jury = load("jury.json")
    exos = load("exercices.json")
    saison = load("saison.json")
    plan = load("plan_modele.json")

    data = {"config": cfg, "modules": [{k: v for k, v in m.items() if k != "html"} for m in mods],
            "quiz": quiz, "themes": themes, "jury": jury, "exercices": exos,
            "saison": saison, "plan": plan}

    body = "\n".join([
        home(cfg, mods, quiz),
        page_sim(cfg, themes), page_plan(cfg, plan), page_jury(jury),
        page_saison(saison), page_exos(cfg, exos),
        *[page_module(m) for m in mods],
        *[page_quiz(q, quiz[q], i) for i, q in enumerate(quiz)],
        page_exam(quiz), page_data(cfg),
    ])

    doc = f"""<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="description" content="{E(cfg['titre'])} — {E(cfg['sous_titre'])}">
<title>{E(cfg['titre'])} — {E(cfg['sous_titre'])}</title>
<link rel="icon" href="data:,">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
{(ROOT / 'style.css').read_text(encoding='utf-8')}
</style>
</head>
<body>
<header>
  <div class="brand">
    <span class="code">{E(cfg['code'])}</span>
    <h1>{E(cfg['titre'])}</h1>
    <span>{E(cfg['sous_titre'])}</span>
  </div>
  <div class="hdr-right">
    <span class="hdr-stat">Progression <b id="hdr-prog">0%</b></span>
    <button class="btn btn-ghost btn-sm" style="color:#fff;border-color:rgba(255,255,255,.25)"
            onclick="document.getElementById('sidebar').classList.toggle('open')">Menu</button>
  </div>
</header>

<div class="shell">
{sidebar(mods, quiz)}
<main>
{body}
</main>
</div>

<div class="toast" id="toast"></div>

<script>window.DATA = {json.dumps(data, ensure_ascii=False, separators=(',', ':'))};</script>
<script>
{(ROOT / 'app.js').read_text(encoding='utf-8')}
</script>
</body>
</html>
"""
    stray = EMOJI.findall(doc)
    if stray:
        print(f"  ATTENTION : {len(stray)} pictogramme(s) résiduel(s) : {set(stray)}", file=sys.stderr)
    out.write_text(doc, encoding="utf-8")
    return out


if __name__ == "__main__":
    ap = argparse.ArgumentParser(description="Générateur du site YOSEI-DIF")
    ap.add_argument("--out", default=str(ROOT.parent / "indexYoseikan.html"))
    a = ap.parse_args()
    p = build(Path(a.out))
    print(f"  Généré : {p}  ({p.stat().st_size / 1024:.0f} Ko)")
