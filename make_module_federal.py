# -*- coding: utf-8 -*-
"""YOSEI-DIF — module 04, reconstruit sur les fiches officielles de préformation FFKDA.

Sources : fiches DAF/DIF de préformation, Service Formation FFKDA,
publiées par le Comité Départemental de Lot-et-Garonne (UF2 2A, 2B, 2C).
"""
import json
from pathlib import Path
C = Path(__file__).parent

HTML = """
<div class="card"><h2>1. La filière de formation fédérale</h2>
<p>« La formation fédérale se présente comme un escalier. Chaque marche correspond à une formation
qui permet d'évoluer, de progresser. Les marches sont complémentaires les unes aux autres. »
Savoir situer le DIF dans cet escalier est le premier item de l'UF2.</p>
<div class="table-wrap"><table>
<tr><th>Diplôme</th><th>Ce qu'il autorise</th><th>Volume</th><th>Organisé par</th></tr>
<tr><td><strong>AFA</strong><br>Attestation Fédérale d'Assistant</td>
<td>Assister un enseignant titulaire au minimum du DAF, <strong>présent dans la salle</strong>.
Pas un diplôme d'enseignant autonome.</td><td>8 h — 30 €</td><td>Comités départementaux</td></tr>
<tr><td><strong>DAF</strong><br>Diplôme d'Animateur Fédéral</td>
<td>Porte d'accès à l'enseignement bénévole <strong>autonome</strong>. Petites structures,
de l'initiation au 1<sup>er</sup> dan.</td><td>37 h — 100 €</td><td>Comités départementaux</td></tr>
<tr><td><strong>DIF</strong><br>Diplôme d'Instructeur Fédéral</td>
<td>Niveau <strong>avancé</strong> de l'enseignement bénévole autonome. Structures plus importantes,
initiation jusqu'au 1<sup>er</sup> dan <strong>et au-delà</strong>.</td><td>70 h — 250 €</td>
<td><strong>Ligues régionales</strong></td></tr>
<tr><td><strong>CQP MAM</strong><br>Moniteur d'Arts Martiaux</td>
<td>Premier niveau autorisant l'enseignement <strong>contre rémunération</strong>, dans la limite
de 360 h par an. Ouvre droit à la carte professionnelle.</td><td>110 h — 850 €</td><td>FFK national</td></tr>
</table></div>
<div class="memo"><span class="memo-icon">!</span><div class="memo-body"><strong>Piège classique du jury</strong>
Le DIF est organisé par les <strong>ligues régionales</strong>, alors que l'AFA et le DAF le sont par les
comités départementaux. Répondre « comité départemental » pour le DIF est une erreur immédiatement relevée.</div></div>
<h3>La suite du parcours</h3>
<p>AFA &rarr; DAF &rarr; DIF &rarr; CQP &rarr; BPJEPS &rarr; DEJEPS &rarr; DESJEPS &rarr; Professorat de sport.
Le <strong>DIF est le prérequis obligatoire du CQP</strong>. Le CQP donne des allègements dans le cadre
du BPJEPS et l'équivalence de l'UC 4 du DEJEPS sous conditions.</p>
</div>

<div class="card"><h2>2. Le DIF : prérequis, structure, volumes</h2>
<h3>Conditions d'entrée en formation</h3>
<ul>
<li>Avoir <strong>18 ans</strong> minimum</li>
<li>Être <strong>ceinture noire 1<sup>er</sup> dan</strong> minimum</li>
<li>Avoir au minimum la <strong>licence fédérale</strong> de l'année en cours</li>
<li>Avoir le <strong>DAF depuis au moins un an</strong></li>
<li>Posséder un <strong>diplôme de secourisme</strong></li>
<li>Avoir un <strong>certificat médical</strong> de non contre-indication à la pratique et à l'enseignement,
de <strong>moins de 3 mois</strong></li>
</ul>
<div class="info-box">Dans des cas exceptionnels et après avis du DTN, une ligue régionale peut ouvrir
le DIF à une personne n'ayant pas le DAF, à condition qu'elle ait suivi et validé une formation
préalable de contenu et d'évaluation identiques à ceux du DAF.</div>
<h3>Les 70 heures</h3>
<div class="table-wrap"><table>
<tr><th>Unité de formation</th><th>Total</th><th>Préformation</th><th>École de formation</th><th>Participations fédérales</th></tr>
<tr><td><strong>UF1</strong> — Enseignement et animation</td><td>34 h</td><td>0 h</td><td>34 h</td><td>0 h</td></tr>
<tr><td><strong>UF2</strong> — Environnement associatif et fédéral</td><td>17 h</td><td>12 h</td><td>5 h</td><td>0 h</td></tr>
<tr><td><strong>UF3</strong> — Participation à la vie fédérale et citoyenne</td><td>19 h</td><td>0 h</td><td>1 h</td><td>18 h</td></tr>
<tr><td><strong>Total</strong></td><td><strong>70 h</strong></td><td><strong>12 h</strong></td><td><strong>40 h</strong></td><td><strong>18 h</strong></td></tr>
</table></div>
<h3>Le détail de l'UF1 — celle qui est évaluée en situation</h3>
<div class="table-wrap"><table>
<tr><th>Bloc</th><th>Intitulé</th><th>Volume</th></tr>
<tr><td>1A</td><td>Concevoir et mettre en œuvre des <strong>exercices</strong></td><td>6 h</td></tr>
<tr><td>1B</td><td>Concevoir et mettre en œuvre des <strong>séances</strong></td><td>18 h</td></tr>
<tr><td>1C</td><td>Concevoir et mettre en œuvre une <strong>saison</strong></td><td>6 h</td></tr>
<tr><td>—</td><td>Évaluation formative</td><td>4 h</td></tr>
</table></div>
<h3>Les trois modes de formation</h3>
<ul>
<li><strong>Préformation (PREF)</strong> — fiches thématiques téléchargeables, fournies au minimum
un mois avant les stages. À étudier <strong>avant</strong>. Évaluation formative en trois phases lors du stage :
test de connaissances, correction collective et interactive avec le formateur, puis <strong>QCM d'évaluation</strong>.</li>
<li><strong>Présentiel en école de formation (EF)</strong> — noyau central. Assiduité vérifiée à chaque
demi-journée par feuille d'émargement tenue par le responsable de formation.</li>
<li><strong>Présentiel lors des participations fédérales (PF)</strong> — validé par le formulaire fédéral
rempli par le responsable de l'organisation puis contresigné par le responsable de formation.</li>
</ul>
<div class="memo"><span class="memo-icon">!</span><div class="memo-body"><strong>Règle absolue</strong>
Aucun diplôme ne peut être validé et décerné tant que les trois temps de formation n'ont pas tous
été effectués. Les 18 h de participations fédérales sont donc bloquantes, au même titre que le stage.</div></div>
<h3>Dispenses partielles possibles</h3>
<ul>
<li><strong>UF1, dispense de 8 h</strong> (bases anatomiques et physiologiques, bases scientifiques,
caractéristiques physiologiques) pour : médecins, pharmaciens, masseurs-kinésithérapeutes, infirmiers,
titulaires d'un diplôme paramédical, titulaires d'une licence STAPS ou équivalent.</li>
<li><strong>UF2, dispense de 7 h</strong> (2C environnement fédéral) pour : membres des ETR, responsables
techniques des ZID, membres des ETD, arbitres nationaux et régionaux.</li>
<li><strong>UF3, dispense de 14 h</strong> (participation à des événements fédéraux officiels) pour :
arbitres nationaux et régionaux.</li>
</ul>
<p>Aucune dispense totale n'est prévue. Les allègements sont décidés en dernier lieu par le RERF,
après étude et entretien.</p>
</div>

<div class="card"><h2>3. Le club : association loi 1901</h2>
<h3>La définition légale</h3>
<p>« L'association est la convention par laquelle deux ou plusieurs personnes mettent en commun,
d'une façon permanente, leurs connaissances ou leur activité dans un but autre que de partager
des bénéfices » (loi du 1<sup>er</sup> juillet 1901, art. 1).</p>
<p>Trois éléments constitutifs : un <strong>contrat</strong> (les statuts), un <strong>apport permanent</strong>
de connaissances ou d'activité, un <strong>but autre que le partage des bénéfices</strong>.</p>
<div class="info-box">Une association <strong>peut</strong> réaliser des bénéfices. Ce qui est interdit,
c'est de les <strong>partager</strong> entre les membres. La confusion entre les deux est une erreur
fréquente devant le jury.</div>
<h3>Le principe de liberté</h3>
<ul>
<li><strong>Liberté de constituer</strong> — sans autorisation ni déclaration préalable (art. 2).
Rien ne s'oppose à créer un club de karaté là où il en existe déjà un.</li>
<li><strong>Liberté d'adhérer et de se retirer</strong> (art. 4). Un adhérent peut démissionner à tout
moment ; sauf disposition contraire des statuts, il ne peut exiger le remboursement de sa cotisation.</li>
</ul>
<p>La déclaration n'est pas obligatoire en soi, mais elle est <strong>nécessaire pour évoluer dans un
environnement fédéral</strong> : elle donne la capacité juridique — ester en justice, recevoir dons
et subventions, percevoir les cotisations, posséder et administrer ses locaux.</p>
<h3>Alsace-Moselle</h3>
<p>Dans le Haut-Rhin, le Bas-Rhin et la Moselle, les associations relèvent des articles 21 à 79-III du
Code civil local. <strong>La loi de 1901 n'y est pas applicable.</strong></p>
</div>

<div class="card"><h2>4. Les organes du club et leurs rôles</h2>
<p>La FFK exige dans ses statuts que l'organe de direction soit composé <strong>au minimum de trois
personnes</strong> : Président, Secrétaire Général, Trésorier. Cet organe constitue le bureau du club,
et ses membres doivent <strong>tous être licenciés</strong> dans le club où ils exercent.</p>
<div class="table-wrap"><table>
<tr><th>Fonction</th><th>Missions principales</th></tr>
<tr><td><strong>Président</strong></td><td><strong>Plan légal</strong> — représente l'association dans les
actes de la vie civile, signe les contrats, ordonne les dépenses, représente en justice, dans le cadre de
l'objet social.<br><strong>Plan organisationnel</strong> — convoque l'AG, le CA et le bureau, anime les
réunions, supervise les activités.<br><strong>Plan moral</strong> — garant des orientations définies par
l'AG, rend compte par son rapport moral annuel.</td></tr>
<tr><td><strong>Secrétaire Général</strong></td><td>La <strong>mémoire</strong> de l'association. Gestion
administrative, respect des statuts, communication en préfecture <strong>dans les 3 mois</strong> de toute
modification, organisation des réunions, rédaction des procès-verbaux, archivage.</td></tr>
<tr><td><strong>Trésorier</strong></td><td>Suivi des finances et des comptes — sachant que
<strong>l'ordonnateur des dépenses reste le Président</strong>. Budget prévisionnel, tenue des livres,
relations bancaires, rapport financier annuel présenté à l'AG.</td></tr>
<tr><td><strong>Assemblée Générale</strong></td><td><strong>Instance centrale et majeure.</strong>
Modification des statuts, délibération sur la gestion du comité directeur et sur la situation morale
et financière, approbation des comptes, renouvellement du comité directeur, désignation du Président.
À réunir au moins une fois par saison sportive.</td></tr>
</table></div>
<h3>Points de réglementation à connaître</h3>
<ul>
<li>Un mineur de <strong>16 ans révolus</strong> peut accéder aux fonctions de direction (art. 2 bis de la
loi de 1901), après information des représentants légaux par lettre recommandée avec accusé de réception.</li>
<li><strong>Nul ne peut être dirigeant de plus d'une association affiliée à la FFKDA</strong> (art. 431 du
règlement intérieur fédéral).</li>
<li>Tout changement de dirigeant doit être signalé au greffe des associations <strong>dans les trois mois</strong>.
À défaut, le changement est inopposable aux tiers.</li>
<li>La loi <strong>n'impose aucun quorum</strong> pour la validité des délibérations : tout dépend des statuts.</li>
<li>Le procès-verbal n'est pas obligatoire, mais vivement conseillé — il peut être requis pour des
demandes de subvention.</li>
</ul>
<h3>Le cas de l'enseignant dirigeant</h3>
<p>Un enseignant peut cumuler son statut de professeur avec celui de membre du bureau, voire de président.
Sans difficulté s'il est bénévole. <strong>S'il est rémunéré, la vigilance s'impose</strong> : la loi interdit
la rémunération des dirigeants d'association, sauf dérogations. Il ne peut alors être rémunéré qu'au titre
de sa fonction de professeur, et il est conseillé qu'il ne participe pas aux réunions fixant sa rémunération.</p>
</div>

<div class="card"><h2>5. Créer un club et l'affilier</h2>
<h3>La création</h3>
<ol>
<li><strong>Assemblée générale constitutive</strong> — adoption des statuts (dénomination, siège, objet,
organes, règles de vote) et élection des dirigeants. La FFK met un modèle de statuts à disposition.</li>
<li><strong>Déclaration au greffe des associations</strong> en préfecture ou sous-préfecture, via le
formulaire <code>cerfa n°13973*03</code>, accompagnée de deux exemplaires des statuts. Récépissé sous 5 jours.</li>
<li><strong>Publication au JOAFE</strong> — payante (44 €). C'est elle qui confère la personnalité morale.
Une modification de titre, but ou siège coûte 31 €.</li>
</ol>
<h3>Les quatre étapes de l'affiliation</h3>
<ol>
<li>Prendre contact avec la <strong>municipalité</strong> pour trouver un dojo et connaître les créneaux.</li>
<li>Créer les <strong>statuts</strong> conformes au modèle FFK, déposer en préfecture avec la liste du bureau.</li>
<li>Après parution au Journal Officiel, compléter en ligne le <strong>dossier d'affiliation</strong>.
La fédération délivre un numéro d'affiliation et l'accès aux demandes de licence.</li>
<li>Le président de ligue, et éventuellement celui du comité départemental, prennent contact.</li>
</ol>
<h3>Ce que l'affiliation apporte, et ce qu'elle impose</h3>
<p><strong>Elle apporte</strong> : grades officiels conformes à l'article 212-5 du Code du sport, accès aux
compétitions et aux titres, accès aux formations et diplômes, assurance couvrant les risques spécifiques.
Depuis l'<strong>ordonnance du 23 juillet 2015, l'affiliation à une fédération agréée vaut agrément</strong> —
le club peut donc demander des subventions d'État sans démarche séparée.</p>
<p><strong>Elle impose</strong> : siège social et lieu principal d'activité dans le même département ;
organe de direction d'au moins un président, un trésorier et un secrétaire général, tous licenciés ;
statuts et règlement intérieur conformes à ceux de la fédération ; enseignants titulaires des diplômes
permettant l'enseignement.</p>
<div class="info-box">La mairie n'est <strong>jamais tenue</strong> de mettre un local à disposition. Un refus
doit cependant être motivé, licite, et respecter le principe d'égalité entre associations. La mairie peut
aussi accepter d'héberger le siège social.</div>
</div>

<div class="card"><h2>6. La licence et le passeport sportif</h2>
<h3>La licence</h3>
<ul>
<li><strong>Annuelle</strong>, délivrée pour la durée de la saison sportive : <strong>du 1<sup>er</sup> septembre
au 31 août</strong>.</li>
<li>Elle marque l'adhésion à l'objet social, aux statuts et règlements de la fédération (art. 7 des statuts FFK,
art. L.131-6 du Code du sport).</li>
<li>Elle donne accès aux <strong>compétitions officielles, aux passages de grades, aux stages techniques
et aux formations diplômantes</strong>.</li>
<li>Elle couvre le licencié en <strong>responsabilité civile et accidents corporels</strong>, dans la pratique
comme dans l'exercice de ses activités bénévoles.</li>
<li>Elle n'est <strong>valable qu'après enregistrement informatique</strong> par la fédération (art. 412 du RI).</li>
</ul>
<h3>L'obligation, et à qui elle s'applique</h3>
<p>La licence est obligatoire pour <strong>tous les membres adhérents</strong> des associations affiliées —
et pas seulement pour les pratiquants : <strong>tous les dirigeants</strong> (président, secrétaire général,
trésorier) et <strong>tous les professeurs</strong> y sont soumis. La fédération propose une
<strong>licence unique</strong> quelle que soit la discipline : un pratiquant inscrit dans deux clubs affiliés
n'en prend qu'une.</p>
<div class="warn-box"><strong>Les risques encourus par un club qui ne licencie pas.</strong> Un pratiquant
empêché d'accéder aux compétitions faute de licence de son professeur peut se retourner contre le club.
Un pratiquant ne pouvant prouver ses années de pratique peut engager une action en responsabilité.
Et si la somme a été versée sans que la licence soit prise : plainte pour détournement de fonds et abus
de confiance, voire saisine de la DGCCRF.</div>
<h3>Le passeport sportif</h3>
<p>Nécessaire pour participer aux compétitions et justifier les passages de grades. Le licencié y répertorie
résultats, grades et clubs fréquentés, et peut y faire apposer son certificat médical. Il existe une version
adulte et une version enfant à tarif réduit, demandées auprès des organismes déconcentrés.</p>
</div>

<div class="card"><h2>7. Le contrôle médical — une dérogation à connaître</h2>
<p>La loi de modernisation du système de santé du 26 janvier 2016 a instauré un régime général :
certificat médical tous les <strong>3 ans</strong>, questionnaire de santé les autres années.</p>
<div class="alert-box"><strong>Ce régime général ne s'applique PAS aux licenciés FFK.</strong>
La fédération relève d'une dérogation prévue pour les disciplines « pour lesquelles le combat peut prendre
fin lorsqu'à la suite d'un coup porté, l'un des adversaires se trouve dans un état le rendant incapable de
se défendre et pouvant aller jusqu'à l'inconscience ». Comme la FFK ne propose qu'une licence unique
ouvrant à toutes les activités, la règle la plus contraignante s'applique à tous.</div>
<ul>
<li><strong>Toute délivrance ou tout renouvellement de licence</strong> est subordonné à la présentation d'un
certificat d'absence de contre-indication <strong>datant de moins d'un an</strong> (art. D.231-1-3 et D.231-1-5
du Code du sport). <strong>Chaque année, sans exception.</strong></li>
<li><strong>Il n'y a pas lieu de solliciter le questionnaire de santé</strong> : il ne concerne que les
fédérations appliquant le régime triennal.</li>
<li>La <strong>compétition</strong> exige un certificat de moins d'un an au jour de la compétition, précisant
l'absence de contre-indication <strong>en compétition</strong>. La FFK conseille de le demander dès la prise
de licence, établi au plus tôt le 1<sup>er</sup> juillet.</li>
<li>Les <strong>restrictions</strong> éventuelles doivent figurer sur le document de fin d'examen. Elles ne
peuvent s'appliquer qu'au sport-loisir, jamais à la compétition.</li>
</ul>
<div class="memo"><span class="memo-icon">!</span><div class="memo-body"><strong>Responsabilité du dirigeant</strong>
Il est de la responsabilité des dirigeants de contrôler la fourniture du certificat. En cas d'accident dû à
l'incapacité physique du licencié, la responsabilité du dirigeant qui n'a pas vérifié ce document peut être engagée.</div></div>
</div>

<div class="card"><h2>8. Les assurances</h2>
<h3>La responsabilité civile — obligatoire</h3>
<p>Obligation légale pour les associations, sociétés et fédérations sportives (art. L.321-1 du Code du sport).
La FFK a souscrit un <strong>contrat collectif</strong> : l'affiliation couvre le club, la licence couvre le licencié.
Elle répare les dommages causés <strong>à autrui</strong> — jamais ceux que l'assuré se cause à lui-même.</p>
<p><strong>Personnes couvertes</strong> : le souscripteur, l'ensemble des dirigeants, les préposés
rémunérés <em>ou non</em> — enseignants, entraîneurs, éducateurs, délégués —, les pratiquants licenciés,
certains non-licenciés, ainsi que les <strong>arbitres et juges</strong> (art. L.321-1 al. 2).</p>
<p><strong>Activités couvertes</strong> : activités sportives fédérales, entraînement et préparation physique,
stages avec ou sans hébergement, activités administratives et assemblées générales, manifestations festives
organisées par la fédération ou ses clubs, actions de promotion et démonstrations, ainsi que les
<strong>déplacements nécessités par ces activités</strong>.</p>
<div class="info-box">Un contrat spécifique <strong>« Responsabilité Civile personnelle des dirigeants »</strong>,
dont bénéficient les clubs par l'affiliation, prend en charge les frais de justice et les condamnations
non pénales — protégeant le patrimoine personnel des dirigeants.</div>
<h3>L'individuelle accident — facultative, mais obligation d'informer</h3>
<p>Elle couvre les dommages corporels subis <strong>sans tiers responsable</strong> : frais de soins, capital
décès, invalidité permanente totale ou partielle. Elle n'est pas obligatoire mais vivement conseillée.</p>
<div class="warn-box">L'article <strong>L.321-4</strong> du Code du sport impose aux associations et fédérations
d'<strong>informer</strong> leurs adhérents de l'intérêt de souscrire une telle garantie. En cas de manquement,
le dirigeant encourt des <strong>poursuites pénales</strong> et engage sa responsabilité civile pour défaut
d'information. Conservez la preuve de cette information.</div>
<p>La fédération doit en outre préciser la possibilité de souscrire des <strong>garanties complémentaires</strong>
(art. L.321-6) : formulaire SPORTMUT auprès de la Mutuelle des Sportifs, retourné directement à l'assureur.</p>
<h3>Deux procédures à connaître par cœur</h3>
<div class="table-wrap"><table>
<tr><th>Situation</th><th>Procédure</th><th>Délai</th></tr>
<tr><td>Accident pendant un cours</td><td>Déclaration d'accident auprès de l'assureur fédéral
(Mutuelle des Sportifs), en ligne ou par formulaire papier</td><td><strong>5 jours</strong> après la survenance</td></tr>
<tr><td>Journée portes ouvertes ou cours d'essai</td><td>Déclaration préalable à la Mutuelle des Sportifs
<em>et</em> au service juridique de la FFK, avec numéro d'affiliation, nombre de personnes attendues et dates</td>
<td><strong>48 h</strong> avant</td></tr>
</table></div>
<p>Les non-licenciés sont alors couverts : en nombre illimité du <strong>1<sup>er</sup> septembre au
31 octobre</strong>, et dans la limite de <strong>2 jours par club</strong> entre le 1<sup>er</sup> novembre
et le 31 août.</p>
</div>

<div class="card"><h2>9. Le bénévolat et les remboursements de frais</h2>
<p>« Est bénévole la personne qui ne perçoit rien en contrepartie de son engagement — aucune rémunération
sous quelque forme que ce soit, salaire, indemnité ou avantage en nature — en dehors des remboursements
de frais réels et justifiés. » Le bénévole ne peut s'enrichir, <strong>mais il ne doit pas s'appauvrir non plus</strong>.</p>
<h3>Trois conditions cumulatives</h3>
<ul>
<li>La dépense est <strong>réellement occasionnée</strong> par l'activité au sein de l'association.</li>
<li>Cette activité est <strong>conforme aux statuts</strong> et à l'objet social.</li>
<li>La dépense est <strong>justifiée</strong> : l'association conserve les justificatifs pendant
<strong>trois ans</strong> après l'expiration de l'année en cours.</li>
</ul>
<h3>Deux voies possibles</h3>
<div class="table-wrap"><table>
<tr><th>Voie</th><th>Modalité</th><th>Effet</th></tr>
<tr><td>Remboursement des <strong>dépenses réelles</strong></td>
<td>À privilégier. Sur factures et justificatifs : notes de restaurant, tickets de péage, billets de train.</td>
<td>Non imposable pour le bénévole, pas de cotisations sociales pour le club.</td></tr>
<tr><td>Allocation <strong>forfaitaire</strong></td>
<td>Déconseillée. Admise à titre exceptionnel si l'approximation est sérieuse — typiquement les indemnités
kilométriques. Le barème ne peut dépasser celui de l'administration fiscale.</td>
<td>Risque de requalification en salaires par l'URSSAF.</td></tr>
<tr><td><strong>Abandon de créance</strong></td>
<td>Le bénévole renonce expressément au remboursement, par note de frais et attestation écrite.</td>
<td>Assimilé à un don : réduction d'impôt, reçu CERFA délivré par l'association.</td></tr>
</table></div>
<div class="warn-box">À défaut de justificatif, et dès lors qu'un <strong>lien de subordination</strong> est
établi, les sommes versées peuvent être requalifiées en salaires : taxes sur les salaires, cotisations
sociales, remise en cause de la gestion désintéressée pour le club, impôt sur le revenu pour le bénévole.</div>
<p>Le <strong>chèque-repas du bénévole</strong> est possible après délibération en assemblée générale.
L'association en prend la totalité du coût à sa charge. Les dirigeants rémunérés n'y ont pas droit.</p>
</div>

<div class="card"><h2>10. Les instances fédérales</h2>
<p>Le Code du sport pose un principe de <strong>concordance territoriale</strong> entre l'organisation
administrative française et l'organisation fédérale. La réforme des régions de 2015 s'est donc prolongée
dans la fédération.</p>
<div class="table-wrap"><table>
<tr><th>Instance</th><th>Nombre</th><th>Comité directeur</th><th>Rôle</th></tr>
<tr><td><strong>Ligue régionale</strong></td><td>13</td><td>8 à 14 membres</td>
<td>Représente la fédération au niveau régional. <strong>Encaisse la cotisation fédérale.</strong>
Conclut annuellement avec la fédération une convention d'objectifs. <strong>Organise les formations DIF.</strong></td></tr>
<tr><td><strong>Zone interdépartementale</strong></td><td>16</td><td>6 à 14 membres</td>
<td>Correspond aux anciennes ligues. Missions sportives de niveau intermédiaire, zone d'organisation
de manifestations.</td></tr>
<tr><td><strong>Comité départemental</strong></td><td>84 métropolitains<br>+ 9 outre-mer dotés de
prérogatives de ligue</td><td>4 à 14 membres</td>
<td>Animation de proximité. <strong>Organise les formations AFA et DAF.</strong></td></tr>
</table></div>
<h3>Objet commun des ligues et comités départementaux</h3>
<ul>
<li>Organiser, contrôler et développer la pratique dans leur ressort territorial</li>
<li>Contribuer au développement de l'éducation et de la culture</li>
<li>Participer à l'intégration sociale et citoyenne</li>
<li>Diriger et coordonner l'activité des groupements affiliés et des licenciés</li>
<li>Assurer la <strong>formation et le perfectionnement des dirigeants, animateurs, formateurs et
entraîneurs fédéraux</strong> — à cet effet, ils disposent d'<strong>écoles de formation</strong></li>
<li>Participer à la délivrance des dan et grades équivalents</li>
</ul>
<div class="info-box">Les structures déconcentrées <strong>ne perçoivent pas de cotisation</strong> de leurs
membres : seule la cotisation fédérale est obligatoire. La fédération contrôle l'exécution de leurs missions
et a accès à leur gestion et à leur comptabilité (art. L.131-11 du Code du sport).</div>
</div>

<div class="card"><h2>11. Hygiène, technique et sécurité des salles</h2>
<p>L'article A322-141 du Code du sport a été <strong>abrogé par arrêté du 1<sup>er</sup> juin 2015</strong>.
Il a été remplacé par la norme <strong>AFNOR NF P 90-209</strong>, en vigueur depuis le 22 juillet 2016,
applicable aux salles neuves et aux salles rénovées depuis cette date.</p>
<div class="table-wrap"><table>
<tr><th>Élément</th><th>Exigence</th></tr>
<tr><td>Aire d'évolution</td><td><strong>25 m² minimum</strong> sans obstacle, largeur ≥ <strong>3,50 m</strong>.
Au-delà de six couples de pratiquants : <strong>+ 4 m² par couple</strong>.</td></tr>
<tr><td>Périphérie</td><td>Distance d'<strong>1 m minimum</strong> autour de l'aire de combat, matérialisée
par une couleur de tapis différente ou un marquage.</td></tr>
<tr><td>Hauteur sous plafond</td><td><strong>2,50 m</strong> pour les arts martiaux sans armes.</td></tr>
<tr><td>Capitonnage</td><td>Tous les obstacles situés à moins d'1 m de l'aire, sur <strong>2 m de haut</strong>
depuis le sol (contre 1,50 m dans l'ancien texte). Angles à moins de 1,40 m : cornière capitonnée.</td></tr>
<tr><td>Miroirs</td><td>À <strong>1 m minimum</strong> de la surface d'entraînement.</td></tr>
<tr><td>Secours</td><td>Moyens de communication et d'appel des secours — téléphone et affichage des numéros
d'urgence à proximité — et moyens de premiers secours.</td></tr>
<tr><td>Température</td><td>Non inférieure à <strong>18 °C</strong>.</td></tr>
<tr><td>Éclairage</td><td><strong>300 lux</strong> recommandés sur l'aire d'évolution, conçus pour limiter
les réflexions.</td></tr>
</table></div>
<h3>Hygiène</h3>
<ul>
<li>Produits d'entretien spécifiques et adaptés au revêtement.</li>
<li><strong>Les taches de sang doivent être immédiatement nettoyées et désinfectées.</strong></li>
<li>Port de chaussures interdit sur l'aire d'évolution, sauf disciplines à chaussures adaptées.
Les pieds nus restent sur les zones réservées.</li>
</ul>
</div>

<div class="card"><h2>12. Les activités fédérales par public</h2>
<p>Item 2C-5 : savoir citer les activités que la fédération propose, au-delà de la pratique traditionnelle.
Le jury vérifie que vous connaissez l'offre que vous pouvez porter dans votre club.</p>
<div class="table-wrap"><table>
<tr><th>Public</th><th>Offres fédérales</th></tr>
<tr><td>Enfants et jeunes</td><td>Programmes et animations dédiés, coupes et plateaux jeunes,
passages de grades adaptés</td></tr>
<tr><td>Adultes — nouvelles pratiques</td><td><strong>Karaté Défense Training</strong>,
<strong>Body Karaté</strong></td></tr>
<tr><td>Publics spécifiques</td><td><strong>Karaté féminin</strong>, <strong>Karaté adapté</strong>,
<strong>Karaté santé</strong>, <strong>Karaté en milieu carcéral</strong></td></tr>
</table></div>
<div class="memo"><span class="memo-icon">!</span><div class="memo-body"><strong>Ce que retient la fiche</strong>
« Une pratique pour tous est proposée au sein de la FFK. De plus, de nouvelles activités permettent
un choix plus large pour les pratiquants de club. » Diversifier l'offre est explicitement une compétence
attendue du DIF : « permet de diversifier les activités d'un club et de mieux en assurer le développement
à long terme ».</div></div>
</div>

<div class="card"><h2>Sources</h2>
<p>Ce module est construit sur les <strong>fiches officielles de préformation DAF/DIF</strong> du Service
Formation de la FFKDA, publiées par le Comité Départemental de Lot-et-Garonne : UF2 2A (filière de formation),
2B items 1, 2, 5, 6, 7 (environnement du club), 2C items 1 à 7 (environnement fédéral).</p>
<p>Les fiches UF1a, UF1b et UF1c, de M. Robert DI MEO, alimentent le module Pédagogie.</p>
<div class="warn-box">Les montants, volumes horaires et références réglementaires évoluent. Vérifiez-les
dans les documents de la saison en cours avant votre oral — les fiches consultées datent de 2022.</div>
</div>
"""

mods = json.loads((C / "modules.json").read_text(encoding="utf-8"))
for m in mods:
    if m["id"] == "m4":
        m.update({
            "titre": "Environnement associatif et fédéral (UF2)",
            "sous_titre": "Filière de formation, vie du club, licence, assurances, instances, sécurité des salles",
            "tags": ["UF2", "Fédéral", "Officiel"],
            "statut": "pret", "html": HTML.strip()})
(C / "modules.json").write_text(json.dumps(mods, ensure_ascii=False, indent=1), encoding="utf-8")
for m in mods:
    print(f"  {m['id']}  {m['statut']:12} {len(m['html']):>6} o  {m['titre']}")
