# -*- coding: utf-8 -*-
"""YOSEI-DIF — quiz par module (content/quiz.json)."""
import json, re
from pathlib import Path
C = Path(__file__).parent
tronc = json.loads((C / "quiz_tronc_commun.json").read_text(encoding="utf-8"))

def scrub(q):
    f = lambda s: re.sub(r"\bFFKDA\b", "la fédération",
                  re.sub(r"\bkaraté\b", "Yoseikan Budo", s, flags=re.I))
    return {"q": f(q["q"]), "opts": [f(o) for o in q["opts"]], "correct": q["correct"]}

K = lambda q, o, c: {"q": q, "opts": o, "correct": c}
federal = [
 K("Quel est l'organe souverain d'une association loi 1901 ?",["Le bureau","Le conseil d'administration","L'assemblée générale","Le président"],2),
 K("Le règlement intérieur d'un club est opposable :",["Toujours, même non communiqué","Dès lors qu'il est porté à la connaissance des adhérents","Uniquement s'il est déposé en préfecture","Jamais, il n'a qu'une valeur indicative"],1),
 K("Le contrôle d'honorabilité concerne :",["Les seuls éducateurs rémunérés","Les seuls dirigeants élus","Tout encadrant, bénévole comme rémunéré","Les seuls encadrants de mineurs"],2),
 K("La responsabilité pénale d'un encadrant :",["Est couverte par l'assurance fédérale","Est couverte par le club","Reste personnelle et ne s'assure pas","N'existe pas pour un bénévole"],2),
 K("Le DIF autorise :",["L'enseignement contre rémunération","L'encadrement bénévole de séances en club","La direction technique d'une ligue","La délivrance de grades Dan"],1),
 K("L'obligation de l'encadrant en matière de sécurité est une obligation :",["De résultat","De moyens","De conseil uniquement","Sans portée juridique"],1),
 K("Un pratiquant sans licence en cours de validité :",["Peut pratiquer toute la saison","Peut pratiquer s'il signe une décharge","Ne peut pas pratiquer au-delà de la période d'essai prévue","Peut pratiquer s'il est majeur"],2),
 K("La ligue régionale a principalement pour rôle :",["De délivrer les licences directement aux pratiquants","La formation des cadres et les compétitions régionales","De fixer les règles internationales","De gérer la comptabilité des clubs"],1),
 K("En cas d'accident pendant un cours, la première action est :",["Prévenir l'assurance","Arrêter le cours et mettre le groupe en sécurité","Appeler les parents","Remplir le registre"],1),
 K("Le projet pédagogique d'un club :",["Remplace les statuts","Traduit le projet associatif en progression d'enseignement","Est imposé par la fédération","Est facultatif et sans usage"],1),
 K("Une discipline associée se caractérise par :",["Son indépendance totale du mouvement fédéral","Son rattachement à une fédération délégataire avec programme et grades propres","L'absence de grades","L'interdiction de compétition"],1),
 K("La déclaration d'un accident à l'assurance doit être faite :",["Quand le club en a le temps","Dans les délais prévus par le contrat","Uniquement en cas d'hospitalisation","Par la famille seule"],1),
 K("Les attestations d'assurance et les diplômes des encadrants doivent être :",["Conservés au domicile de l'enseignant","Affichés dans les locaux","Transmis à la mairie chaque mois","Détruits en fin de saison"],1),
 K("Face à une suspicion de situation préoccupante concernant un mineur, l'instructeur doit :",["Mener sa propre enquête","Promettre la confidentialité à l'enfant","Consigner les faits et alerter sans délai les autorités compétentes","Attendre confirmation par un tiers"],2),
 K("L'enseignement contre rémunération relève :",["Du seul règlement fédéral","Du Code du sport et d'une certification professionnelle","D'une simple déclaration au club","Du DIF"],1),
 K("Le comité départemental intervient principalement sur :",["Les règles techniques internationales","L'animation de proximité et le soutien aux clubs","La délivrance des cartes professionnelles","La gestion des sélections nationales"],1),
 K("Un conflit avec une famille se traite :",["Immédiatement au bord du tatami","Lors d'un entretien programmé, si besoin avec un dirigeant","Par message collectif au groupe","En excluant l'enfant sans explication"],1),
 K("Le bureau d'une association est composé au minimum de :",["Président seul","Président, trésorier, secrétaire","Cinq membres élus","Deux co-présidents"],1),
 K("La question « à quels événements fédéraux avez-vous participé ? » attend :",["Une intention pour la saison prochaine","Des faits datés : stages, formations, compétitions, grades","Une réponse sur le club uniquement","Un avis sur la politique fédérale"],1),
 K("Une garantie complémentaire d'assurance (indemnités, invalidité) est :",["Incluse d'office dans la licence","Optionnelle et à la charge du licencié","Interdite","Réservée aux compétiteurs"],1),
]

quiz = {
 "q1": {"module":"m1","titre":"Quiz — Histoire et principes","statut":"a_completer","questions":[]},
 "q2": {"module":"m2","titre":"Quiz — Contenu technique","statut":"a_completer","questions":[]},
 "q3": {"module":"m3","titre":"Quiz — Pédagogie et méthodologie","statut":"pret",
        "questions":[scrub(q) for q in tronc["q3"]["questions"]]},
 "q4": {"module":"m4","titre":"Quiz — Environnement fédéral et vie du club","statut":"pret",
        "questions":federal},
 "q5": {"module":"m5","titre":"Quiz — Physiologie et sécurité","statut":"pret",
        "questions":[scrub(q) for q in tronc["q5"]["questions"]]},
 "q6": {"module":"m6","titre":"Quiz — Terminologie","statut":"a_completer","questions":[]},
}
(C/"quiz.json").write_text(json.dumps(quiz, ensure_ascii=False, indent=1), encoding="utf-8")
for k,v in quiz.items(): print(f"  {k} {v['statut']:12} {len(v['questions']):>3} questions  {v['titre']}")
