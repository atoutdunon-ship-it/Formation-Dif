/**
 * Rotary Club du François — Remplissage des pages réglementaires.
 *
 * Les mentions légales, la politique de confidentialité et les conditions de
 * vente reposent toutes sur les mêmes informations : qui édite le site, sous
 * quel statut, à quelle adresse, qui en est responsable. Ces informations
 * sont saisies une fois dans l'espace membre (Administration → Mentions
 * légales et conformité) et reprises ici.
 *
 * Le site étant statique, chaque page porte une valeur de secours écrite en
 * dur. Ce script la remplace par la valeur à jour dès que le serveur est
 * joignable. Si le serveur ne répond pas, la page reste lisible et complète :
 * une mention légale qui disparaît en cas de panne serait pire que rien.
 *
 * Conventions dans le HTML :
 *   data-mention="champ"          le texte de l'élément est remplacé
 *   data-mention-lien="champ"     l'attribut href est reconstruit (mailto:)
 *   data-si-vide="texte"          affiché quand le champ est vide côté serveur
 *   data-si-vide-cache="champ"    l'élément entier disparaît si le champ est vide
 */
(function () {
  "use strict";

  var RC = window.RC;
  if (!RC || RC.baseApi() === null) return;   // vitrine seule : contenu de secours

  var MOIS = [
    "janvier", "février", "mars", "avril", "mai", "juin",
    "juillet", "août", "septembre", "octobre", "novembre", "décembre"
  ];

  function dateLisible(iso) {
    var d = new Date(iso + "T00:00:00");
    if (isNaN(d)) return iso;
    return d.getDate() + " " + MOIS[d.getMonth()] + " " + d.getFullYear();
  }

  function appliquer(mentions) {
    document.querySelectorAll("[data-mention]").forEach(function (el) {
      var champ = el.getAttribute("data-mention");
      var valeur = mentions[champ];

      if (champ === "mis_a_jour_le" && valeur) valeur = dateLisible(valeur);

      if (valeur) {
        el.textContent = valeur;
        el.classList.remove("mention--absente");
      } else if (el.hasAttribute("data-si-vide")) {
        el.textContent = el.getAttribute("data-si-vide");
        el.classList.add("mention--absente");
      }
      // Sinon : la valeur écrite en dur dans la page est conservée.
    });

    // Liens reconstruits à partir d'une adresse électronique.
    document.querySelectorAll("[data-mention-lien]").forEach(function (el) {
      var valeur = mentions[el.getAttribute("data-mention-lien")];
      if (valeur) el.href = "mailto:" + valeur;
    });

    // Blocs qui n'ont de sens que si le champ est renseigné — le délégué à la
    // protection des données, par exemple, qui n'est pas obligatoire ici.
    document.querySelectorAll("[data-si-vide-cache]").forEach(function (el) {
      if (!mentions[el.getAttribute("data-si-vide-cache")]) el.hidden = true;
    });

    // Le médiateur de la consommation est obligatoire pour la vente au
    // public : tant qu'il n'est pas désigné, on le signale plutôt que de
    // laisser croire qu'il existe.
    document.querySelectorAll("[data-si-vide-remplace]").forEach(function (el) {
      if (!mentions[el.getAttribute("data-si-vide-remplace")]) {
        el.classList.add("mention--absente");
      }
    });
  }

  RC.api("/api/public/mentions").then(function (mentions) {
    if (mentions && !mentions.erreur) appliquer(mentions);
  });
})();
