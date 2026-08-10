/*
 * ROTARY CLUB DU FRANÇOIS — Configuration du site vitrine.
 *
 * ---------------------------------------------------------------------------
 * LE SEUL FICHIER À MODIFIER POUR METTRE LE SITE EN LIGNE
 * ---------------------------------------------------------------------------
 *
 * Le site vitrine (pages HTML, images, styles) est purement statique : il
 * peut être hébergé sur GitHub Pages, chez n'importe quel hébergeur, ou
 * simplement ouvert en local.
 *
 * L'espace membre, lui, est une application Python (Flask) : il lui faut un
 * serveur. Deux situations se présentent donc.
 *
 *   1. LE SITE EST LANCÉ EN LOCAL (double-clic sur Lancer-le-site.command)
 *      Le serveur Flask sert à la fois la vitrine et l'espace membre, sur la
 *      même adresse http://localhost:5050. Laissez `serveurMembre` vide :
 *      tout est détecté automatiquement.
 *
 *   2. LA VITRINE EST EN LIGNE (GitHub Pages) ET LE SERVEUR AILLEURS
 *      Indiquez ci-dessous l'adresse complète du serveur de l'espace membre,
 *      SANS barre oblique finale. Exemple :
 *
 *          serveurMembre: "https://rotaryfrancois.pythonanywhere.com"
 *
 *      La marche à suivre complète figure dans METTRE-EN-LIGNE.md, à la
 *      racine du dossier RotarySite.
 *
 *      Le site vitrine ira alors y chercher les actualités, l'agenda, la
 *      galerie, la boutique, et le bouton « Espace membre » y conduira.
 *
 *      Tant que ce champ reste vide et que la vitrine est en ligne, le site
 *      fonctionne en « mode plaquette » : toutes les pages s'affichent
 *      normalement avec leur contenu écrit en dur, et les fonctions qui
 *      exigent un serveur s'effacent proprement au lieu de tomber en panne.
 *
 * ---------------------------------------------------------------------------
 * SÉCURITÉ — ne placez ici aucun mot de passe, aucune clé d'API, aucune
 * coordonnée bancaire. Ce fichier est public : il est téléchargé par chaque
 * visiteur. Il ne doit contenir que des adresses.
 * ---------------------------------------------------------------------------
 */
(function () {
  "use strict";

  var CONFIGURATION = {
    // Adresse du serveur de l'espace membre. Vide = même adresse que la page.
    serveurMembre: "https://rotarycluboffrancois.pythonanywhere.com",

    // Laissez vide : l'adresse de connexion est déduite du serveur ci-dessus.
    // À renseigner seulement si votre espace membre est sur un chemin
    // inhabituel.
    urlEspaceMembre: "",

    // Idem pour le panneau d'administration : déduit du serveur ci-dessus.
    urlAdministration: ""
  };

  /* ---------------------------------------------------------------------- */

  /* Le site tourne-t-il sur un hébergement purement statique ?
     GitHub Pages, GitLab Pages, Netlify et consorts ne savent pas exécuter
     Python : sans adresse de serveur renseignée, il n'y a donc pas d'API à
     interroger. On le détecte plutôt que d'échouer requête après requête. */
  function hebergementStatique() {
    var hote = window.location.hostname;
    return (
      /\.github\.io$/.test(hote) ||
      /\.gitlab\.io$/.test(hote) ||
      /\.netlify\.app$/.test(hote) ||
      /\.pages\.dev$/.test(hote) ||
      /\.vercel\.app$/.test(hote) ||
      window.location.protocol === "file:"
    );
  }

  /* Adresse de base de l'API, ou null si aucun serveur n'est joignable.
     Les scripts qui interrogent l'API doivent tester cette valeur : si elle
     vaut null, ils conservent le contenu statique de la page. */
  function baseApi() {
    if (CONFIGURATION.serveurMembre) {
      return CONFIGURATION.serveurMembre.replace(/\/+$/, "");
    }
    return hebergementStatique() ? null : "";
  }

  function apiDisponible() {
    return baseApi() !== null;
  }

  /* Adresse de la page de connexion à l'espace membre, ou null. */
  function urlEspaceMembre() {
    if (CONFIGURATION.urlEspaceMembre) return CONFIGURATION.urlEspaceMembre;
    var base = baseApi();
    if (base === null) return null;
    return base + "/espace-membre";
  }

  /* Adresse du panneau d'administration, ou null.

     Le panneau vit dans la même application que l'espace membre : c'est
     donc la même base, avec un autre chemin. Flask exige la connexion et
     renvoie vers la page d'identification si l'on n'est pas administrateur —
     le bouton n'ouvre aucune porte, il évite seulement d'avoir à taper
     l'adresse de mémoire. */
  function urlAdministration() {
    if (CONFIGURATION.urlAdministration) return CONFIGURATION.urlAdministration;
    var base = baseApi();
    if (base === null) return null;
    return base + "/administration/";
  }

  window.RC = {
    baseApi: baseApi,
    apiDisponible: apiDisponible,
    urlEspaceMembre: urlEspaceMembre,
    urlAdministration: urlAdministration,

    /* Enveloppe de fetch qui n'échoue jamais bruyamment.
       Renvoie une promesse résolue avec :
         - le corps JSON de la réponse, y compris pour un 400 ou un 403 :
           l'API renvoie ses messages d'erreur dans le corps (« cet article
           est réservé aux membres »…), il ne faut donc pas les perdre ;
         - `null` uniquement si aucun serveur n'est joignable, si le réseau
           échoue, ou si la réponse n'est pas du JSON exploitable.
       L'appelant n'a ainsi qu'un seul cas particulier à traiter — `null` —
       et la page ne casse jamais. */
    api: function (chemin, options) {
      var base = baseApi();
      if (base === null) return Promise.resolve(null);

      var parametres = options || {};
      if (!parametres.credentials) {
        // Serveur sur une autre adresse que la vitrine : la session du
        // membre ne voyage que si on l'y autorise explicitement.
        parametres.credentials = base === "" ? "same-origin" : "include";
      }

      return fetch(base + chemin, parametres)
        .then(function (reponse) {
          return reponse.json().catch(function () { return null; });
        })
        .catch(function () {
          return null;
        });
    }
  };

  /* Passerelle vers l'espace membre.

     Le bouton « Espace membre » pointe dans le HTML vers `espace-membre.html`,
     une page d'explication : c'est le repli si aucun serveur n'est joignable,
     et cela garantit qu'un clic mène toujours quelque part.

     Dès qu'un serveur est configuré, le lien est réécrit vers la page de
     connexion : le passage devient direct, sans étape intermédiaire. Le
     visiteur ne voit qu'un bouton qui l'emmène au bon endroit.

     Le lien s'ouvre dans le même onglet : l'espace membre est la suite
     naturelle de la visite, pas une annexe. `rel="noopener"` protège malgré
     tout la page d'origine si le club opte un jour pour un nouvel onglet. */
  function brancherPasserelle() {
    /* Panneau d'administration. Même principe que l'espace membre : le lien
       pointe dans le HTML vers la page d'explication, et n'est réécrit vers
       le panneau que si un serveur est configuré. Un bouton qui ne mène
       nulle part vaut moins qu'un bouton qui explique pourquoi. */
    var administration = urlAdministration();
    document.querySelectorAll("[data-administration]").forEach(function (lien) {
      if (!administration) return;
      lien.href = administration;
      lien.rel = "noopener";
      lien.removeAttribute("target");
      if (administration.indexOf("http") === 0) {
        lien.title = "Ouvre le panneau d'administration du site";
      }
    });

    var cible = urlEspaceMembre();
    if (!cible) return;

    document.querySelectorAll("[data-espace-membre]").forEach(function (lien) {
      lien.href = cible;
      lien.rel = "noopener";
      lien.removeAttribute("target");
      // Signale aux lecteurs d'écran que le lien quitte le site vitrine.
      if (cible.indexOf("http") === 0) {
        lien.title = "Ouvre l'espace membre du club";
      }
    });

    // La langue choisie sur la vitrine est transmise à l'espace membre via
    // le cookie `rc_langue`, partagé. Quand le serveur est sur une autre
    // adresse, le cookie ne voyage pas : on passe alors la langue en
    // paramètre pour que le membre retrouve son choix.
    if (cible.indexOf(window.location.origin) !== 0) {
      var langue = (document.cookie.match(/(?:^|;\s*)rc_langue=([^;]+)/) || [])[1];
      if (langue) {
        document.querySelectorAll("[data-espace-membre]").forEach(function (lien) {
          lien.href = cible + (cible.indexOf("?") === -1 ? "?" : "&") + "lang=" + langue;
        });
      }
    }
  }

  document.addEventListener("DOMContentLoaded", brancherPasserelle);
})();
