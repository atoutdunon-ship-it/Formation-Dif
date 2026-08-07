# -*- coding: utf-8 -*-
"""YOSEI-DIF — banque de questions d'entretien avec le jury."""
import json
from pathlib import Path
C = Path(__file__).parent / "content"

Q = lambda cat, q, att: {"cat": cat, "q": q, "attendu": att}
SEANCE, PEDA, PUB, SEC, FED, CLUB, DISC = (
 "Retour sur la séance", "Vision pédagogique", "Publics", "Sécurité et responsabilité",
 "Environnement fédéral", "Vie du club", "Discipline")

jury = [
 # ── Retour sur la séance (le jury commence toujours par là)
 Q(SEANCE,"Quel était l'objectif de votre séance, formulé en une phrase ?","Un objectif opérationnel et unique : « à la fin de la séance, le pratiquant est capable de… ». Pas un thème, pas une liste."),
 Q(SEANCE,"À quoi avez-vous vu que votre objectif était atteint ?","Citer le critère de réussite observable retenu et ce que vous avez réellement observé, y compris les échecs."),
 Q(SEANCE,"Qu'est-ce que vous changeriez si vous refaisiez cette séance demain ?","Une ou deux modifications précises et justifiées. L'auto-analyse lucide est valorisée ; l'autosatisfaction est sanctionnée."),
 Q(SEANCE,"Votre échauffement préparait-il vraiment la tâche principale ?","Montrer le lien : sollicitations articulaires, filières, gestuelles communes avec le corps de séance."),
 Q(SEANCE,"Comment avez-vous géré le pratiquant qui n'y arrivait pas ?","Différenciation : simplification de la tâche, variable didactique modifiée, aide d'un partenaire, sans jamais l'exclure du groupe."),
 Q(SEANCE,"Combien de temps vos pratiquants ont-ils réellement pratiqué ?","Notion de temps moteur. Identifier les temps morts : consignes trop longues, files d'attente, démonstrations à rallonge."),
 Q(SEANCE,"Pourquoi avoir choisi cette progression et pas une autre ?","Justifier l'ordre : du simple au complexe, du connu vers l'inconnu, du sûr vers l'incertain, de la coopération vers l'opposition."),
 Q(SEANCE,"Quelle variable didactique avez-vous fait varier ?","Espace, temps, nombre, matériel, règles, incertitude. Nommer celle qui a été manipulée et l'effet recherché."),
 Q(SEANCE,"Votre démonstration était-elle nécessaire ? Où étiez-vous placé ?","Démonstration courte, visible de tous, orientée. Placement de l'enseignant : jamais dos à une partie du groupe."),
 Q(SEANCE,"Comment avez-vous conclu votre séance ?","Retour au calme, rappel de l'objectif, valorisation, annonce du lien avec la séance suivante."),
 # ── Vision pédagogique
 Q(PEDA,"Quelle différence faites-vous entre un thème et un objectif ?","Le thème est le contenu tiré au sort ; l'objectif est le résultat attendu chez le pratiquant, formulé de façon observable et mesurable."),
 Q(PEDA,"Méthode analytique ou méthode globale : que privilégiez-vous ?","Ni l'une ni l'autre en absolu. Global pour donner du sens, analytique pour corriger un point précis, global à nouveau pour réintégrer."),
 Q(PEDA,"Comment corrigez-vous une erreur technique ?","Hiérarchiser : sécurité d'abord, puis erreur qui bloque la réussite, puis détail de forme. Une correction à la fois, formulée positivement."),
 Q(PEDA,"Faut-il corriger devant tout le groupe ou individuellement ?","Erreur collective : arrêt du groupe. Erreur individuelle : intervention discrète. Ne jamais exposer un pratiquant en difficulté."),
 Q(PEDA,"Qu'est-ce qu'une consigne efficace ?","Courte, une seule idée, orientée vers le but et non vers la forme, associée à un critère de réussite. Vérifiée par reformulation."),
 Q(PEDA,"Comment maintenez-vous l'attention d'un groupe ?","Densité de pratique, alternance des formats, variation du rythme, rotation des partenaires, consignes brèves, feedback fréquent."),
 Q(PEDA,"Qu'est-ce que la pédagogie du détour ?","Passer par une situation différente de la tâche cible pour lever un blocage, puis revenir à la tâche cible."),
 Q(PEDA,"Comment évaluez-vous vos pratiquants au quotidien ?","Évaluation continue par l'observation de critères annoncés, pas seulement au passage de grade. Traçabilité simple."),
 Q(PEDA,"Quelle place donnez-vous à l'erreur dans l'apprentissage ?","L'erreur est une information, pas une faute. Elle renseigne sur la représentation du pratiquant et oriente la régulation."),
 Q(PEDA,"Comment gérez-vous un groupe à niveaux très hétérogènes ?","Objectif commun, tâches à niveaux d'exigence différents, ateliers, tutorat entre pratiquants, appariement raisonné."),
 Q(PEDA,"Quel rôle donnez-vous à la démonstration par un pratiquant ?","Valorisation, modèle accessible, prise de recul de l'enseignant. Attention à ne pas exposer un pratiquant fragile."),
 Q(PEDA,"Comment préparez-vous une séance concrètement ?","Objectif, public, durée, matériel, sécurité, situations avec critères, plan B. Écrit avant, régulé pendant, analysé après."),
 # ── Publics
 Q(PUB,"Qu'est-ce qui change fondamentalement entre une séance enfant et une séance adulte ?","Durée d'attention, capacité d'abstraction, motivation, tolérance à la répétition, rapport au corps et au risque. Le contenu ludique n'est pas un contenu au rabais."),
 Q(PUB,"Que faites-vous d'un enfant de 5 ans qui ne tient pas en place ?","C'est la norme à cet âge, pas un problème de discipline. Réduire les temps d'attente, raccourcir les tâches, augmenter la rotation."),
 Q(PUB,"Quelles précautions particulières chez l'adolescent ?","Croissance : prudence sur les charges, les impacts et les amplitudes articulaires. Besoin de sens, de reconnaissance et d'un cadre stable."),
 Q(PUB,"Comment intégrez-vous un pratiquant en situation de handicap ?","Même objectif, moyens adaptés. Échanger avec la personne et son entourage, adapter la tâche et non la baisser, intégrer au groupe."),
 Q(PUB,"Comment accueillez-vous un débutant en cours de saison ?","Référent désigné, objectifs propres, situations où il peut réussir immédiatement, explicitation des rituels et du vocabulaire."),
 Q(PUB,"Un adulte reprend après une longue interruption : que faites-vous ?","Reprise progressive, questionnement sur les antécédents, dosage de l'intensité, valorisation des acquis conservés."),
 Q(PUB,"Séance mixte enfants et adultes : comment procédez-vous ?","À éviter si possible. Sinon, ateliers séparés avec un temps commun ritualisé, et vigilance accrue sur les différences de gabarit."),
 Q(PUB,"Quel est le premier facteur de démotivation chez l'enfant ?","L'absence de réussite et l'attente. Densité de pratique et réussite accessible sont les deux leviers principaux."),
 # ── Sécurité et responsabilité
 Q(SEC,"Que vérifiez-vous avant chaque séance ?","Tatami, espace libre, matériel, ongles et bijoux, état de santé du jour, trousse de secours, moyen d'alerte, effectif présent."),
 Q(SEC,"Un pratiquant se blesse pendant votre cours : que faites-vous ?","Arrêt du cours, mise en sécurité du groupe, protection et bilan, alerte des secours si nécessaire, prévenir les responsables légaux et le président, déclaration à l'assurance dans les délais."),
 Q(SEC,"Quelle est votre responsabilité en tant qu'encadrant ?","Obligation de moyens : sécurité, surveillance, adaptation au niveau. La responsabilité civile est couverte par l'assurance fédérale ; la responsabilité pénale reste personnelle."),
 Q(SEC,"Que couvre la licence fédérale ?","Affiliation, assurance en responsabilité civile et garanties de base, accès aux compétitions, stages et passages de grade. Les garanties complémentaires sont optionnelles."),
 Q(SEC,"Un pratiquant n'est pas licencié : peut-il monter sur le tatami ?","Non au-delà de la période d'essai prévue par le club et son assurance. Sans couverture, l'encadrant et le club s'exposent."),
 Q(SEC,"Que faites-vous d'un certificat médical ou questionnaire de santé manquant ?","Appliquer la réglementation en vigueur et la règle interne du club : pas de pratique tant que la situation administrative n'est pas régularisée."),
 Q(SEC,"Comment prévenez-vous le risque lié à l'opposition ?","Appariement par gabarit et niveau, règles de contact explicites, signal d'arrêt commun, protections obligatoires, progressivité de l'incertitude."),
 Q(SEC,"Que faites-vous en cas de comportement violent d'un pratiquant ?","Arrêt immédiat, mise à l'écart du tatami, entretien après le cours, information des responsables légaux et du président, rappel du règlement intérieur."),
 Q(SEC,"Connaissez-vous l'obligation d'honorabilité ?","Tout encadrant, bénévole ou rémunéré, est soumis au contrôle d'honorabilité. La déclaration se fait via la fédération et le club en vérifie l'effectivité."),
 Q(SEC,"Quelles protections imposez-vous et quand ?","Selon la discipline et le type d'opposition : protège-dents, protections de poings et de pieds, coquille, protège-tibias. Vérification avant chaque situation d'opposition."),
 # ── Environnement fédéral
 Q(FED,"Comment le Yoseikan Budo est-il rattaché au mouvement fédéral français ?","Situer la discipline au sein de la fédération délégataire et de ses disciplines associées, et son lien avec la structure propre à la discipline. À compléter depuis vos documents officiels."),
 Q(FED,"Décrivez l'organisation fédérale du club jusqu'au national.","Club, comité départemental, ligue régionale, fédération nationale, puis instances internationales de la discipline."),
 Q(FED,"Qu'est-ce qu'une discipline associée ?","Discipline rattachée à une fédération délégataire, disposant de son propre programme technique, de ses grades et de ses commissions, dans le cadre fédéral commun."),
 Q(FED,"Qui délivre les grades et selon quelle procédure ?","La commission compétente, sur la base d'un programme technique, de conditions d'ancienneté, de licence et d'âge. À préciser depuis vos documents officiels."),
 Q(FED,"À quels événements fédéraux avez-vous participé cette saison ?","Réponse personnelle et documentée : stages, formations, compétitions, passages de grade, coupes. Le jury attend des faits datés, pas des intentions."),
 Q(FED,"Quel est le rôle du conseiller technique ?","Accompagnement technique et pédagogique des clubs, formation des cadres, mise en œuvre de la politique technique fédérale sur le territoire."),
 Q(FED,"Quelle est la différence entre le DIF et un CQP ou un diplôme d'État ?","Le DIF est un diplôme fédéral d'encadrement bénévole. L'enseignement contre rémunération relève d'une qualification professionnelle inscrite au répertoire national."),
 Q(FED,"Que trouve-t-on dans le calendrier fédéral d'une saison ?","Stages techniques, formations de cadres, passages de grade, compétitions et coupes, assemblées générales, événements de la discipline."),
 Q(FED,"Comment vous tenez-vous informé des évolutions techniques et réglementaires ?","Sources officielles fédérales, circulaires, stages de cadres, réunions de ligue et de comité départemental."),
 Q(FED,"Pourquoi passez-vous le DIF ?","Réponse personnelle mais structurée : légitimité, montée en compétence, besoin du club, projet d'encadrement à moyen terme."),
 # ── Vie du club
 Q(CLUB,"Comment fonctionne une association loi 1901 ?","Assemblée générale souveraine, conseil d'administration, bureau (président, trésorier, secrétaire), statuts et règlement intérieur."),
 Q(CLUB,"Quelle est la place de l'enseignant dans le projet du club ?","Il traduit le projet associatif en projet pédagogique : publics accueillis, progression, objectifs de saison, événements."),
 Q(CLUB,"Comment fidélisez-vous vos pratiquants sur une saison ?","Réussite perceptible, progression lisible, événements fédérateurs, lien avec les familles, régularité et qualité de l'accueil."),
 Q(CLUB,"Comment communiquez-vous avec les parents ?","Cadre défini : réunion de début de saison, informations écrites, point individuel sur demande. Ne jamais gérer un différend au bord du tatami."),
 Q(CLUB,"Que feriez-vous pour développer la section jeunes ?","Créneaux adaptés, interventions scolaires ou périscolaires, événements de rentrée, valorisation des passages de grade, animation d'équipe."),
 Q(CLUB,"Quel est le rôle du règlement intérieur ?","Préciser les règles de vie, d'assiduité, de tenue, de sécurité et de sanction. Il est opposable et doit être porté à connaissance."),
 Q(CLUB,"Comment organisez-vous un événement au sein du club ?","Objectif, budget, autorisations, encadrement, sécurité et secours, communication, bilan. Validation par le bureau."),
 Q(CLUB,"Travaillez-vous seul ou en équipe pédagogique ?","Réponse personnelle : répartition des créneaux, réunions de coordination, tutorat des assistants, cohérence de la progression entre enseignants."),
 # ── Discipline
 Q(DISC,"Qu'est-ce qui caractérise le Yoseikan Budo par rapport aux autres budo ?","Approche synthétique intégrant percussions, projections, travail au sol et travail avec armes, autour de principes communs de mouvement. À préciser et étayer depuis vos documents officiels."),
 Q(DISC,"Quels sont les principes fondamentaux que vous enseignez en priorité ?","Réponse personnelle et hiérarchisée : posture, déplacement, distance, timing, contrôle. Doit être cohérente avec la séance présentée."),
 Q(DISC,"Comment expliquez-vous le sens du mot budo à un enfant ?","Une voie, pas seulement une technique : apprendre à se maîtriser, à respecter l'autre et à progresser dans la durée."),
 Q(DISC,"Comment articulez-vous pratique de loisir et pratique de compétition ?","Objectifs distincts, tronc technique commun. La compétition est un outil de formation, pas la finalité de tous les pratiquants."),
 Q(DISC,"Comment intégrez-vous les valeurs du budo dans une séance concrète ?","Par les rituels, les règles de contrôle, la responsabilisation dans les rôles et l'exigence de sécurité mutuelle — pas par le discours seul."),
]
(C / "jury.json").write_text(json.dumps(jury, ensure_ascii=False, indent=1), encoding="utf-8")
cats = {}
for q in jury: cats[q["cat"]] = cats.get(q["cat"], 0) + 1
print(f"  jury.json  {len(jury)} questions", cats)
