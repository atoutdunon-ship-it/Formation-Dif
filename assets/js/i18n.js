/**
 * Rotary Club du François — Site trilingue (français, anglais, espagnol).
 *
 * Le français est la langue de référence : il est écrit en clair dans le
 * HTML et reste affiché si ce script ne se charge pas. Les versions
 * anglaise et espagnole sont appliquées par-dessus, sur les éléments
 * porteurs d'un attribut `data-i18n="clé"`.
 *
 * Le choix de langue est mémorisé en cookie (et non en localStorage) afin
 * d'être également transmis à l'espace membre, qui partage le même
 * sélecteur.
 */
(function () {
  "use strict";

  var LANGUES = { fr: "Français", en: "English", es: "Español" };
  var LANGUE_DEFAUT = "fr";

  var TRADUCTIONS = {
    en: {
      "nav.le_rotary": "About Rotary",
      "footer.informations": "Information",
      "footer.mentions": "Legal notice",
      "footer.confidentialite": "Privacy",
      "footer.cookies": "Cookies",
      "footer.cgv": "Terms of sale",
      "footer.cgu": "Terms of use",
      "footer.retractation": "Withdraw from an order",
      "footer.accessibilite": "Accessibility",
      "contact.rgpd": "The information you enter is used solely to reply to you. It is kept for twelve months after our last exchange, is shared with no one, and you may at any time ask to see it, correct it or have it erased.",
      "don.rgpd": "Your details are used solely to contact you about this donation. No banking information is requested here: payment is arranged afterwards with the Treasurer.",
      "boutique.rgpd": "Your details are used to process your order, hand it over to you and keep the club's accounts. They are retained for ten years, the legal retention period for accounting records.",
      "boutique.cgv_acceptation": "By confirming, you accept the terms of sale. You have fourteen days to withdraw, except for dated event tickets and personalised items.",
      /* Navigation et en-tête */
      "nav.accueil": "Home",
      "nav.club": "The Club",
      "nav.district": "District 7030",
      "nav.actions": "Our Projects",
      "nav.agenda": "Calendar",
      "nav.actualites": "News",
      "nav.galerie": "Gallery",
      "nav.contact": "Contact",
      "nav.boutique": "Shop",

      /* Espace membre et modes hors ligne */
      "espace.eyebrow": "Members only",
      "espace.titre": "Club member area",
      "espace.texte": "Directory, calendar, meetings, projects, treasury, photo gallery and administration panel. Access is reserved for members of the Rotary Club du François.",
      "espace.acces_titre": "Sign in",
      "espace.acces_texte": "Your credentials are issued by the club President or Secretary. On first sign-in you choose your own password.",
      "espace.non_configure": "The member area is temporarily unavailable. Please write to the club Secretariat, who will assist you.",
      "espace.bouton": "Open the member area",
      "espace.aide_titre": "Don't have your credentials yet?",
      "espace.aide_texte": "Every club member receives their credentials by email, at the address the club has on file. Your username is that email address \u2014 nothing more to remember.",
      "espace.aide_perdu": "Lost your password, or never received your credentials? Write to the club Secretariat, who will issue new ones.",
      "espace.aide_contact": "Write to the Secretariat",
      "galerie.hors_ligne": "The club photo gallery is served from the member area. Contact the Secretariat for access.",
      "boutique.hors_ligne": "The online shop is not yet open at this address. To order, please contact the club Treasurer at rotaryclubdufrancois@gmail.com.",
      "nav.membres": "Our Members",
      "membres.eyebrow": "Our members",
      "membres.titre": "The people who make the club",
      "membres.texte": "Rotary brings together women and men from different professional backgrounds, each contributing their skills to the community. Every member represents a classification — a trade or a sector of activity.",
      "membres.chargement": "Loading the directory…",
      "membres.vide": "The member directory is not published yet. Please contact the club for any enquiry.",
      "membres.hors_ligne": "The member directory is served from the club's own space. Write to us at rotaryclubdufrancois@gmail.com for any enquiry.",
      "membres.bureau": "The club board",
      "membres.autres": "Club members",
      "membres.tous": "Club members",
      "membres.rejoindre_titre": "Your profession has a place among us",
      "membres.rejoindre_texte": "Rotary recruits by classification: every profession is represented. If yours is not yet in our directory, we would like to hear from you.",
      "nav.espace_membre": "Member area",
      "nav.menu": "Menu",

      /* Boutique */
      "boutique.eyebrow": "Club shop",
      "boutique.titre": "Every purchase funds a project",
      "boutique.texte": "Tickets for our events, club merchandise, raffle books: all proceeds go to the projects of the Rotary Club du François.",
      "boutique.chargement": "Loading the catalogue…",
      "boutique.vide": "No items are on sale at the moment.",
      "boutique.tout": "All",
      "boutique.panier": "Your basket",
      "boutique.panier_vide": "Your basket is empty.",
      "boutique.total": "Total",
      "boutique.commander": "Place order",
      "boutique.ajouter": "Add to basket",
      "boutique.ajoute": "Added ✓",
      "boutique.choix": "Choice",
      "boutique.membres": "Members only",
      "boutique.epuise": "Sold out",
      "boutique.ventes_closes": "Sales closed",
      "boutique.restants": "left",
      "boutique.au_profit": "In aid of",
      "boutique.finaliser": "Complete your order",
      "boutique.recap": "Summary",
      "boutique.champ_nom": "Full name *",
      "boutique.champ_email": "Email address *",
      "boutique.champ_tel": "Phone",
      "boutique.champ_paiement": "Preferred payment method",
      "boutique.champ_message": "Message (optional)",
      "boutique.paiement_lien": "Online payment (card)",
      "boutique.paiement_virement": "Bank transfer",
      "boutique.paiement_place": "In person, with the Treasurer",
      "boutique.valider": "Confirm order",
      "boutique.merci": "Thank you!",
      "boutique.reference": "Reference",
      "boutique.payer_ligne": "Pay online",
      "boutique.payer_virement": "Pay by bank transfer",
      "boutique.payer_place": "In person",
      "boutique.note_prestataire": "Payment takes place on our provider's secure page. Please quote your order number as the reference.",
      "boutique.mention_securite": "No banking details are requested on this website. Payment is then made on our provider's secure page, or by bank transfer.",

      /* Accueil */
      "accueil.eyebrow": "Service Above Self",
      "accueil.titre": "A service club at the heart of Le François, committed to Martinique.",
      "accueil.texte": "For over 40 years, the Rotary Club du François has brought together women and men of action in fellowship and friendship, around a common purpose: serving the community through concrete, lasting projects.",
      "accueil.cta_actions": "Discover our projects",
      "accueil.cta_membre": "Become a member",
      "accueil.legende_photo": "La Baignoire de Joséphine, Le François, Martinique",

      "stat.district": "Rotary District",
      "stat.zone": "Rotary Zone",
      "stat.fondation": "Rotary International founded",
      "stat.ville": "Fort-de-France, Martinique",

      "domaines.eyebrow": "Our areas of focus",
      "domaines.titre": "Serving locally, acting sustainably",
      "domaines.texte": "Our committees run concrete projects for Martinique, in line with Rotary International's areas of focus.",
      "domaine1.eyebrow": "Solidarity",
      "domaine1.titre": "Social action",
      "domaine1.texte": "Support for families, people in precarious situations and local care facilities.",
      "domaine2.eyebrow": "Youth",
      "domaine2.titre": "New generations",
      "domaine2.texte": "Support for Rotaract and Interact clubs, scholarships and exchange programmes.",
      "domaine3.eyebrow": "Health",
      "domaine3.titre": "Public health",
      "domaine3.texte": "Prevention, screening and awareness campaigns for the local population.",
      "domaine4.eyebrow": "Education",
      "domaine4.titre": "Literacy",
      "domaine4.texte": "Tutoring programmes and the fight against illiteracy in Le François schools.",
      "domaine5.eyebrow": "Environment",
      "domaine5.titre": "Sustainable development",
      "domaine5.texte": "Coastline preservation and environmental awareness across Martinique.",
      "domaine6.eyebrow": "Economy",
      "domaine6.titre": "Local development",
      "domaine6.texte": "Support for local entrepreneurship and networking of economic stakeholders.",

      "rejoindre.eyebrow": "Join the club",
      "rejoindre.titre": "Become a member of the Rotary Club du François",
      "rejoindre.texte": "Rotary brings together committed professionals and leaders, united by the will to act for the common good.",
      "rejoindre.cta": "Apply for membership",

      /* Bandeaux de pages */
      "banniere.club.eyebrow": "The Club",
      "banniere.club.titre": "Our club, our governance, our values",
      "banniere.club.texte": "The Rotary Club du François belongs to District 7030, Zone 34 of Rotary International, which brings together clubs across the Caribbean and Guiana.",
      "banniere.district.eyebrow": "District 7030",
      "banniere.district.titre": "Our district, the Southern Caribbean",
      "banniere.district.texte": "The Rotary Club du François belongs to District 7030, Zone 34 of Rotary International, which brings together the clubs of the Southern Caribbean, from Saint Kitts to Guyana and Aruba.",
      "banniere.actions.eyebrow": "Our Projects",
      "banniere.actions.titre": "Concrete projects, led by the Service Projects Committee",
      "banniere.actions.texte": "Every project is assessed, budgeted and monitored by the Service Projects Committee together with the Treasurer, from launch to final report.",
      "banniere.agenda.eyebrow": "Calendar",
      "banniere.agenda.titre": "The club's upcoming events",
      "banniere.agenda.texte": "Meetings, ceremonies and public events of the Rotary Club du François.",
      "banniere.actualites.eyebrow": "News",
      "nav.interact": "Interact La Yole",
      "nav.administration": "Administration",
      "accueil_interact.eyebrow": "Our sponsored club",
      "accueil_interact.titre": "Interact La Yole",
      "accueil_interact.texte": "The Rotary Club du François sponsors the Interact club « La Yole », chartered on 14 February 2023 under the presidency of Astrid BAPTE. Young people aged twelve to eighteen choose their own service projects and see them through.",
      "accueil_interact.cta": "Discover the Interact club",
      "actualites.recentes_1": "Club",
      "actualites.recentes_2": "news",
      "actualites.themes_1": "Rotary",
      "actualites.themes_2": "themes",
      "lettre.titre": "The club newsletter",
      "lettre.texte": "Every month, the club's projects, the current Rotary theme and upcoming events, straight to your inbox. One email a month, no more.",
      "banniere.actualites.titre": "Latest news from the club",
      "banniere.galerie.eyebrow": "Gallery",
      "banniere.galerie.titre": "Our photos, Rotary year by Rotary year",
      "banniere.galerie.texte": "Browse our archives, from the club's founding to today's projects.",
      "banniere.adherer.eyebrow": "Become a member",
      "banniere.adherer.titre": "Joining the Rotary Club du François",
      "banniere.adherer.texte": "Rotary membership is by sponsorship. Introduce yourself: a member will get in touch with you.",
      "banniere.contact.eyebrow": "Contact",
      "banniere.contact.titre": "Write to us, meet us",

      /* Dons */
      "don.bouton": "Support this project",
      "don.bouton_club": "Make a donation to the club",
      "don.section_eyebrow": "Support us",
      "don.section_titre": "Make a donation to the club",
      "don.section_texte": "Would you like to support our work without targeting a specific project? Leave us your details and the club Treasurer will get back to you. No banking details are requested on this website.",
      "don.modal_eyebrow": "Support a project",
      "don.modal_intro": "Leave us your details and the amount you have in mind: the club Treasurer will contact you to arrange your donation. No banking details are requested here.",
      "don.nom": "Full name *",
      "don.email": "Email address *",
      "don.telephone": "Phone",
      "don.montant": "Intended amount (€)",
      "don.message": "Message (optional)",
      "don.anonyme": "I would like my donation to remain anonymous",
      "don.envoyer": "Send my pledge",
      "don.envoi_en_cours": "Sending…",
      "don.paiement_titre": "How to make your donation",
      "don.virement": "By bank transfer",
      "don.titulaire": "Account holder",
      "don.banque": "Bank",
      "don.sur_place": "In person",
      "don.erreur_reseau": "Sending failed for now. You can email us at rotaryclubdufrancois@gmail.com.",

      /* Galerie */
      "galerie.choisir_annee": "Choose a Rotary year",
      "galerie.aucune_photo": "No photos published for this Rotary year yet.",
      "galerie.indisponible": "The gallery is temporarily unavailable.",
      "galerie.photos_club": "Club photos",
      "galerie.videos_club": "Club videos",
      "galerie.onglet_photos": "Photos",
      "galerie.onglet_videos": "Videos",
      "galerie.aucune_video": "No videos published for this Rotary year yet.",

      /* Pied de page */
      "footer.navigation": "Navigation",
      "footer.espace_prive": "Private area",
      "footer.adherer": "Become a member",
      "footer.droits": "© 2026 Rotary Club du François — Martinique. All rights reserved.",

      /* Chat */
      "chat.titre": "Any questions?",
      "chat.sous_titre": "Rotary Club du François",
      "chat.placeholder": "Ask your question…",
      "chat.envoyer": "Send",
    },

    es: {
      "nav.le_rotary": "El Rotary",
      "footer.informations": "Información",
      "footer.mentions": "Aviso legal",
      "footer.confidentialite": "Privacidad",
      "footer.cookies": "Cookies",
      "footer.cgv": "Condiciones de venta",
      "footer.cgu": "Condiciones de uso",
      "footer.retractation": "Desistir de un pedido",
      "footer.accessibilite": "Accesibilidad",
      "contact.rgpd": "Los datos introducidos se utilizan únicamente para responderle. Se conservan doce meses tras nuestro último intercambio, no se comunican a nadie, y usted puede en todo momento solicitar consultarlos, corregirlos o suprimirlos.",
      "don.rgpd": "Sus datos se utilizan únicamente para contactarle sobre esta donación. Aquí no se solicita ningún dato bancario: el pago se organiza después con el Tesorero.",
      "boutique.rgpd": "Sus datos se utilizan para tramitar su pedido, entregárselo y llevar la contabilidad del club. Se conservan diez años, plazo legal de conservación de los documentos contables.",
      "boutique.cgv_acceptation": "Al confirmar, acepta las condiciones generales de venta. Dispone de catorce días para desistir, salvo para las entradas con fecha determinada y los artículos personalizados.",
      /* Navegación y encabezado */
      "nav.accueil": "Inicio",
      "nav.club": "El Club",
      "nav.district": "Distrito 7030",
      "nav.actions": "Nuestras acciones",
      "nav.agenda": "Agenda",
      "nav.actualites": "Noticias",
      "nav.galerie": "Galería",
      "nav.contact": "Contacto",
      "nav.boutique": "Tienda",

      /* Área de socios y modos sin conexión */
      "espace.eyebrow": "Reservado a los socios",
      "espace.titre": "Área de socios del club",
      "espace.texte": "Directorio, agenda, reuniones, proyectos, tesorería, galería de fotos y panel de administración. El acceso está reservado a los socios del Rotary Club du François.",
      "espace.acces_titre": "Iniciar sesión",
      "espace.acces_texte": "Sus credenciales se las facilita el Presidente o el Secretario del club. En el primer acceso elegirá su propia contraseña.",
      "espace.non_configure": "El área de socios no está disponible en este momento. Escriba a la Secretaría del club, que le informará.",
      "espace.bouton": "Abrir el área de socios",
      "espace.aide_titre": "¿Todavía no tiene sus credenciales?",
      "espace.aide_texte": "Cada socio del club recibe sus credenciales por correo electrónico, en la dirección que el club conoce. Su usuario es esa misma dirección: nada más que recordar.",
      "espace.aide_perdu": "¿Ha extraviado su contraseña o nunca recibió sus credenciales? Escriba a la Secretaría del club, que le facilitará unas nuevas.",
      "espace.aide_contact": "Escribir a la Secretaría",
      "galerie.hors_ligne": "La galería de fotos del club se muestra desde el área de socios. Contacte con la Secretaría para acceder.",
      "boutique.hors_ligne": "La tienda en línea todavía no está abierta en esta dirección. Para pedir, contacte con el Tesorero del club en rotaryclubdufrancois@gmail.com.",
      "nav.membres": "Nuestros socios",
      "membres.eyebrow": "Nuestros socios",
      "membres.titre": "Quienes dan vida al club",
      "membres.texte": "Rotary reúne a mujeres y hombres de distintos ámbitos profesionales, cada uno aportando su competencia al servicio de la comunidad. Cada socio representa una clasificación, es decir, un oficio o un sector de actividad.",
      "membres.chargement": "Cargando el directorio…",
      "membres.vide": "El directorio de socios aún no está publicado. Contacte con el club para cualquier consulta.",
      "membres.hors_ligne": "El directorio de socios se muestra desde el espacio del club. Escríbanos a rotaryclubdufrancois@gmail.com para cualquier consulta.",
      "membres.bureau": "La Junta del club",
      "membres.autres": "Los socios del club",
      "membres.tous": "Los socios del club",
      "membres.rejoindre_titre": "Su profesión tiene un lugar entre nosotros",
      "membres.rejoindre_texte": "Rotary recluta por clasificación: cada profesión está representada. Si la suya aún no figura en nuestro directorio, su candidatura nos interesa.",
      "nav.espace_membre": "Área de socios",
      "nav.menu": "Menú",

      /* Tienda */
      "boutique.eyebrow": "Tienda del club",
      "boutique.titre": "Cada compra financia una acción",
      "boutique.texte": "Entradas para nuestros eventos, productos del club, boletos de tómbola: la totalidad de la recaudación se destina a las acciones del Rotary Club du François.",
      "boutique.chargement": "Cargando el catálogo…",
      "boutique.vide": "No hay artículos a la venta en este momento.",
      "boutique.tout": "Todo",
      "boutique.panier": "Su cesta",
      "boutique.panier_vide": "Su cesta está vacía.",
      "boutique.total": "Total",
      "boutique.commander": "Realizar pedido",
      "boutique.ajouter": "Añadir a la cesta",
      "boutique.ajoute": "Añadido ✓",
      "boutique.choix": "Opción",
      "boutique.membres": "Reservado a los socios",
      "boutique.epuise": "Agotado",
      "boutique.ventes_closes": "Ventas cerradas",
      "boutique.restants": "restante(s)",
      "boutique.au_profit": "A beneficio de",
      "boutique.finaliser": "Finalizar el pedido",
      "boutique.recap": "Resumen",
      "boutique.champ_nom": "Nombre y apellidos *",
      "boutique.champ_email": "Correo electrónico *",
      "boutique.champ_tel": "Teléfono",
      "boutique.champ_paiement": "Forma de pago preferida",
      "boutique.champ_message": "Mensaje (opcional)",
      "boutique.paiement_lien": "Pago en línea (tarjeta)",
      "boutique.paiement_virement": "Transferencia bancaria",
      "boutique.paiement_place": "En persona, con el Tesorero",
      "boutique.valider": "Confirmar el pedido",
      "boutique.merci": "¡Gracias!",
      "boutique.reference": "Referencia",
      "boutique.payer_ligne": "Pagar en línea",
      "boutique.payer_virement": "Pagar por transferencia",
      "boutique.payer_place": "En persona",
      "boutique.note_prestataire": "El pago se realiza en la página segura de nuestro proveedor. Indique su número de pedido como referencia.",
      "boutique.mention_securite": "En este sitio no se solicita ningún dato bancario. El pago se efectúa después en la página segura de nuestro proveedor, o por transferencia.",

      /* Inicio */
      "accueil.eyebrow": "Dar de sí antes de pensar en sí",
      "accueil.titre": "Un club de servicio en el corazón de Le François, comprometido con Martinica.",
      "accueil.texte": "Desde hace más de 40 años, el Rotary Club du François reúne a mujeres y hombres de acción en un espíritu de compañerismo y amistad, con un objetivo común: servir a la comunidad mediante proyectos concretos y duraderos.",
      "accueil.cta_actions": "Descubrir nuestras acciones",
      "accueil.cta_membre": "Hacerse socio",
      "accueil.legende_photo": "La Baignoire de Joséphine, Le François, Martinica",

      "stat.district": "Distrito Rotario",
      "stat.zone": "Zona Rotaria",
      "stat.fondation": "Fundación de Rotary International",
      "stat.ville": "Fort-de-France, Martinica",

      "domaines.eyebrow": "Nuestras áreas de interés",
      "domaines.titre": "Servir localmente, actuar de forma sostenible",
      "domaines.texte": "Nuestras comisiones dirigen proyectos concretos al servicio de Martinica, en coherencia con las áreas de interés de Rotary International.",
      "domaine1.eyebrow": "Solidaridad",
      "domaine1.titre": "Acción social",
      "domaine1.texte": "Apoyo a las familias, a las personas en situación de precariedad y a los centros de acogida del territorio.",
      "domaine2.eyebrow": "Juventud",
      "domaine2.titre": "Nuevas generaciones",
      "domaine2.texte": "Acompañamiento de los clubes Rotaract e Interact, becas de estudio y programas de intercambio.",
      "domaine3.eyebrow": "Salud",
      "domaine3.titre": "Salud pública",
      "domaine3.texte": "Campañas de prevención, detección y sensibilización dirigidas a la población.",
      "domaine4.eyebrow": "Educación",
      "domaine4.titre": "Alfabetización",
      "domaine4.texte": "Programas de apoyo escolar y lucha contra el analfabetismo en las escuelas de Le François.",
      "domaine5.eyebrow": "Medio ambiente",
      "domaine5.titre": "Desarrollo sostenible",
      "domaine5.texte": "Acciones de preservación del litoral y de sensibilización medioambiental en Martinica.",
      "domaine6.eyebrow": "Economía",
      "domaine6.titre": "Desarrollo local",
      "domaine6.texte": "Apoyo al emprendimiento local y creación de redes entre los agentes económicos del territorio.",

      "rejoindre.eyebrow": "Únase al club",
      "rejoindre.titre": "Hacerse socio del Rotary Club du François",
      "rejoindre.texte": "Rotary reúne a profesionales y líderes comprometidos, unidos por la voluntad de actuar en favor del interés general.",
      "rejoindre.cta": "Solicitar la admisión",

      /* Encabezados de páginas */
      "banniere.club.eyebrow": "El Club",
      "banniere.club.titre": "Nuestro club, nuestro gobierno, nuestros valores",
      "banniere.club.texte": "El Rotary Club du François forma parte del Distrito 7030, Zona 34 de Rotary International, que reúne a los clubes de las Antillas y de la Guayana.",
      "banniere.district.eyebrow": "Distrito 7030",
      "banniere.district.titre": "Nuestro distrito, el Caribe Sur",
      "banniere.district.texte": "El Rotary Club du François pertenece al Distrito 7030, Zona 34 de Rotary International, que reúne a los clubes del Caribe Sur, desde San Cristóbal hasta Guyana y Aruba.",
      "banniere.actions.eyebrow": "Nuestras acciones",
      "banniere.actions.titre": "Proyectos concretos, dirigidos por la Comisión de Acción",
      "banniere.actions.texte": "Cada acción es estudiada, presupuestada y supervisada por la Comisión de Acción junto con el Tesorero, desde su lanzamiento hasta su balance.",
      "banniere.agenda.eyebrow": "Agenda",
      "banniere.agenda.titre": "Las próximas citas del club",
      "banniere.agenda.texte": "Reuniones, ceremonias y actos públicos del Rotary Club du François.",
      "banniere.actualites.eyebrow": "Noticias",
      "nav.interact": "Interact La Yole",
      "nav.administration": "Administración",
      "accueil_interact.eyebrow": "Nuestro club apadrinado",
      "accueil_interact.titre": "Interact La Yole",
      "accueil_interact.texte": "El Rotary Club du François apadrina el club Interact « La Yole », constituido el 14 de febrero de 2023 bajo la presidencia de Astrid BAPTE. Jóvenes de doce a dieciocho años eligen ellos mismos sus acciones y las llevan hasta el final.",
      "accueil_interact.cta": "Descubrir el club Interact",
      "actualites.recentes_1": "Noticias",
      "actualites.recentes_2": "del club",
      "actualites.themes_1": "Los temas",
      "actualites.themes_2": "del Rotary",
      "lettre.titre": "El boletín del club",
      "lettre.texte": "Cada mes, las acciones del club, el tema rotario del momento y las próximas citas, directamente en su buzón. Un correo al mes, nada más.",
      "banniere.actualites.titre": "Las últimas noticias del club",
      "banniere.galerie.eyebrow": "Galería",
      "banniere.galerie.titre": "Nuestras fotos, año rotario tras año rotario",
      "banniere.galerie.texte": "Recorra nuestros archivos, desde la fundación del club hasta las acciones de hoy.",
      "banniere.adherer.eyebrow": "Hacerse socio",
      "banniere.adherer.titre": "Unirse al Rotary Club du François",
      "banniere.adherer.texte": "La incorporación a Rotary se realiza por padrinazgo. Preséntese: un socio se pondrá en contacto con usted.",
      "banniere.contact.eyebrow": "Contacto",
      "banniere.contact.titre": "Escríbanos, visítenos",

      /* Donativos */
      "don.bouton": "Apoyar esta acción",
      "don.bouton_club": "Hacer un donativo al club",
      "don.section_eyebrow": "Apóyenos",
      "don.section_titre": "Hacer un donativo al club",
      "don.section_texte": "¿Desea apoyar nuestras acciones sin destinarlo a un proyecto concreto? Déjenos sus datos y el Tesorero del club se pondrá en contacto con usted. En este sitio no se solicita ningún dato bancario.",
      "don.modal_eyebrow": "Apoyar una acción",
      "don.modal_intro": "Déjenos sus datos y el importe previsto: el Tesorero del club se pondrá en contacto con usted para organizar su donativo. Aquí no se solicita ningún dato bancario.",
      "don.nom": "Nombre y apellidos *",
      "don.email": "Correo electrónico *",
      "don.telephone": "Teléfono",
      "don.montant": "Importe previsto (€)",
      "don.message": "Mensaje (opcional)",
      "don.anonyme": "Deseo que mi donativo permanezca anónimo",
      "don.envoyer": "Enviar mi promesa de donativo",
      "don.envoi_en_cours": "Enviando…",
      "don.paiement_titre": "Cómo efectuar su donativo",
      "don.virement": "Por transferencia bancaria",
      "don.titulaire": "Titular de la cuenta",
      "don.banque": "Banco",
      "don.sur_place": "En persona",
      "don.erreur_reseau": "El envío no es posible en este momento. Puede escribirnos a rotaryclubdufrancois@gmail.com.",

      /* Galería */
      "galerie.choisir_annee": "Elija un año rotario",
      "galerie.aucune_photo": "Todavía no hay fotos publicadas para este año rotario.",
      "galerie.indisponible": "La galería no está disponible en este momento.",
      "galerie.photos_club": "Fotos del club",
      "galerie.videos_club": "Vídeos del club",
      "galerie.onglet_photos": "Fotos",
      "galerie.onglet_videos": "Vídeos",
      "galerie.aucune_video": "Todavía no hay vídeos publicados para este año rotario.",

      /* Pie de página */
      "footer.navigation": "Navegación",
      "footer.espace_prive": "Área privada",
      "footer.adherer": "Hacerse socio",
      "footer.droits": "© 2026 Rotary Club du François — Martinica. Todos los derechos reservados.",

      /* Chat */
      "chat.titre": "¿Alguna pregunta?",
      "chat.sous_titre": "Rotary Club du François",
      "chat.placeholder": "Escriba su pregunta…",
      "chat.envoyer": "Enviar",
    },
  };

  /* ---------- Mémorisation du choix (cookie partagé avec l'espace membre) ---------- */

  function lireCookie(nom) {
    var m = document.cookie.match("(^|;)\\s*" + nom + "\\s*=\\s*([^;]+)");
    return m ? decodeURIComponent(m.pop()) : null;
  }

  function ecrireCookie(nom, valeur) {
    var expiration = new Date();
    expiration.setFullYear(expiration.getFullYear() + 1);
    document.cookie =
      nom + "=" + encodeURIComponent(valeur) + ";expires=" + expiration.toUTCString() + ";path=/;SameSite=Lax";
  }

  function langueInitiale() {
    var memorisee = lireCookie("rc_langue");
    if (memorisee && LANGUES[memorisee]) return memorisee;
    var navigateur = (navigator.language || "fr").slice(0, 2).toLowerCase();
    return LANGUES[navigateur] ? navigateur : LANGUE_DEFAUT;
  }

  /* ---------- Application des traductions ---------- */

  function traduire(cle, langue) {
    if (langue === LANGUE_DEFAUT) return null; // le HTML est déjà en français
    var table = TRADUCTIONS[langue];
    return table && table[cle] ? table[cle] : null;
  }

  function appliquer(langue) {
    document.documentElement.lang = langue;

    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      // Mémorise le texte français d'origine au premier passage, afin de
      // pouvoir y revenir sans recharger la page.
      if (!el.dataset.i18nFr) el.dataset.i18nFr = el.textContent.trim();
      var texte = traduire(el.dataset.i18n, langue);
      el.textContent = texte || el.dataset.i18nFr;
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach(function (el) {
      if (!el.dataset.i18nPlaceholderFr) el.dataset.i18nPlaceholderFr = el.placeholder || "";
      var texte = traduire(el.dataset.i18nPlaceholder, langue);
      el.placeholder = texte || el.dataset.i18nPlaceholderFr;
    });

    document.querySelectorAll("[data-i18n-aria]").forEach(function (el) {
      var texte = traduire(el.dataset.i18nAria, langue);
      if (texte) el.setAttribute("aria-label", texte);
    });

    document.querySelectorAll(".selecteur-langue__option").forEach(function (b) {
      var actif = b.dataset.langue === langue;
      b.classList.toggle("is-active", actif);
      b.setAttribute("aria-pressed", actif ? "true" : "false");
    });

    ecrireCookie("rc_langue", langue);
    // Permet aux autres scripts (dons, galerie, chat) de se retraduire.
    document.dispatchEvent(new CustomEvent("langue-changee", { detail: { langue: langue } }));
  }

  /* ---------- Sélecteur affiché dans l'en-tête ---------- */

  function construireSelecteur() {
    var hote = document.querySelector(".site-header__actions");
    if (!hote || document.querySelector(".selecteur-langue")) return;

    var conteneur = document.createElement("div");
    conteneur.className = "selecteur-langue";
    conteneur.setAttribute("role", "group");
    conteneur.setAttribute("aria-label", "Choix de la langue / Language / Idioma");

    Object.keys(LANGUES).forEach(function (code) {
      var bouton = document.createElement("button");
      bouton.type = "button";
      bouton.className = "selecteur-langue__option";
      bouton.dataset.langue = code;
      bouton.textContent = code.toUpperCase();
      bouton.title = LANGUES[code];
      bouton.addEventListener("click", function () {
        appliquer(code);
      });
      conteneur.appendChild(bouton);
    });

    hote.insertBefore(conteneur, hote.firstChild);
  }

  // Expose la langue courante et la retraduction aux autres scripts du
  // site (dons, galerie, chat), qui injectent du contenu après coup.
  window.rcLangue = {
    courante: langueInitiale,
    traduire: function (cle) {
      return traduire(cle, langueInitiale()) || null;
    },
    // À appeler après avoir inséré du HTML porteur d'attributs data-i18n.
    rafraichir: function () {
      appliquer(langueInitiale());
    },
  };

  function initialiser() {
    construireSelecteur();
    appliquer(langueInitiale());
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialiser);
  } else {
    initialiser();
  }
})();
