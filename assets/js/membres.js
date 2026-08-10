/*
 * ROTARY CLUB DU FRANÇOIS — Annuaire public des membres.
 *
 * VIE PRIVÉE — ce script n'affiche que ce que le serveur lui transmet, et le
 * serveur ne transmet que les membres ayant explicitement accepté d'y
 * figurer, avec les seules informations qu'ils ont autorisées (voir la route
 * /api/public/membres). Rien n'est filtré ici : le tri est fait à la source,
 * de sorte qu'une donnée non consentie ne quitte jamais le serveur.
 *
 * Les coordonnées sont construites par JavaScript plutôt qu'écrites dans le
 * HTML : les robots collecteurs d'adresses les plus répandus se contentent de
 * lire le code source d'une page et repartent bredouilles. Ce n'est pas une
 * protection absolue — un aspirateur qui exécute JavaScript y parviendrait —
 * mais cela élimine l'essentiel de la collecte automatisée.
 */
(function () {
  "use strict";

  var RC = window.RC || { api: function () { return Promise.resolve(null); } };
  var contenu = document.getElementById("membres-contenu");
  if (!contenu) return;

  var membres = [];

  function t(cle, defaut) {
    if (window.rcLangue && typeof window.rcLangue.traduire === "function") {
      var valeur = window.rcLangue.traduire(cle);
      if (valeur) return valeur;
    }
    return defaut;
  }

  function echapper(texte) {
    var d = document.createElement("div");
    d.textContent = texte == null ? "" : String(texte);
    return d.innerHTML;
  }

  /* Assemble l'adresse en plusieurs morceaux : même lue dans le DOM après
     exécution, elle n'apparaît jamais telle quelle dans le fichier source. */
  function lienContact(membre) {
    var morceaux = [];

    if (membre.email) {
      var parts = membre.email.split("@");
      morceaux.push(
        '<a class="membre__contact" href="mailto:' + echapper(parts[0]) + "&#64;" +
        echapper(parts[1]) + '">' + echapper(membre.email) + "</a>"
      );
    }
    if (membre.telephone) {
      morceaux.push(
        '<a class="membre__contact" href="tel:' +
        echapper(membre.telephone.replace(/\s/g, "")) + '">' +
        echapper(membre.telephone) + "</a>"
      );
    }
    return morceaux.length ? '<div class="membre__contacts">' + morceaux.join("") + "</div>" : "";
  }

  function carte(membre) {
    var metier = membre.classification || membre.profession || "";

    return (
      '<article class="membre">' +
        '<div class="membre__portrait">' +
          (membre.photo_url
            ? '<img src="' + echapper(membre.photo_url) + '" alt="' + echapper(membre.nom) + '" loading="lazy">'
            : '<span class="membre__initiales">' + echapper(membre.initiales) + "</span>") +
        "</div>" +
        '<div class="membre__corps">' +
          "<h3>" + echapper(membre.nom) + "</h3>" +
          (membre.fonction
            ? '<span class="membre__fonction">' + echapper(membre.fonction) + "</span>"
            : "") +
          (metier ? '<p class="membre__metier">' + echapper(metier) + "</p>" : "") +
          (membre.ville ? '<p class="membre__ville">' + echapper(membre.ville) + "</p>" : "") +
          lienContact(membre) +
        "</div>" +
      "</article>"
    );
  }

  function afficher() {
    if (!membres.length) {
      contenu.innerHTML =
        '<p class="boutique-attente">' +
        t("membres.vide",
          "L'annuaire des membres n'est pas encore publié. " +
          "Contactez le club pour toute demande de renseignement.") +
        "</p>";
      return;
    }

    // Le Bureau d'abord — sa fonction est publique par nature —, puis les
    // autres membres par ordre alphabétique, tel que le serveur les fournit.
    var bureau = membres.filter(function (m) { return m.fonction; });
    var autres = membres.filter(function (m) { return !m.fonction; });

    var html = "";
    if (bureau.length) {
      html +=
        '<section class="boutique-famille">' +
          "<h2>" + t("membres.bureau", "Le Bureau du club") + "</h2>" +
          '<div class="membre-grille">' + bureau.map(carte).join("") + "</div>" +
        "</section>";
    }
    if (autres.length) {
      html +=
        '<section class="boutique-famille">' +
          "<h2>" + (bureau.length
            ? t("membres.autres", "Les membres du club")
            : t("membres.tous", "Les membres du club")) + "</h2>" +
          '<div class="membre-grille">' + autres.map(carte).join("") + "</div>" +
        "</section>";
    }
    contenu.innerHTML = html;
  }

  RC.api("/api/public/membres")
    .then(function (donnees) {
      if (donnees === null) {
        // Aucun serveur joignable : la vitrine est publiée seule.
        contenu.innerHTML =
          '<p class="boutique-attente">' +
          t("membres.hors_ligne",
            "L'annuaire des membres est servi depuis l'espace du club. " +
            "Écrivez-nous à rotaryclubdufrancois@gmail.com pour toute demande.") +
          "</p>";
        return;
      }
      membres = donnees;
      afficher();
    });

  document.addEventListener("langue-changee", afficher);
})();
