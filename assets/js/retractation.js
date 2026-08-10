/**
 * Rotary Club du François — Fonction de rétractation en ligne.
 *
 * L'article L221-21 du Code de la consommation impose, depuis le 19 juin
 * 2026, de mettre à disposition une fonctionnalité de rétractation gratuite
 * et directement accessible depuis l'interface en ligne, pendant toute la
 * durée du délai de quatorze jours.
 *
 * Deux conséquences guident ce fichier :
 *
 * 1. **Le formulaire ne doit jamais empêcher l'exercice du droit.** Aucune
 *    validation superflue, aucun champ obligatoire au-delà de ce qui permet
 *    d'identifier l'acheteur et la commande. Si le serveur est injoignable,
 *    l'acheteur est renvoyé vers l'adresse postale et l'adresse électronique
 *    du club, qui restent des voies parfaitement valables — son droit ne
 *    dépend pas de ce site.
 *
 * 2. **L'accusé de réception s'affiche immédiatement**, sans attendre le
 *    courriel. C'est la preuve de la date de la demande, et cette date fait
 *    courir le délai de remboursement.
 */
(function () {
  "use strict";

  var formulaire = document.getElementById("retractation-form");
  if (!formulaire) return;

  var retour = formulaire.querySelector(".doc__form-retour");
  var bouton = formulaire.querySelector('button[type="submit"]');
  var RC = window.RC;

  function message(texte, type) {
    retour.textContent = texte;
    retour.className = "doc__form-retour" + (type ? " doc__form-retour--" + type : "");
  }

  function replierVersLeCourriel() {
    var adresse = document.querySelector('[data-mention="email_contact"]');
    formulaire.insertAdjacentHTML(
      "beforeend",
      '<div class="doc__encart" style="margin-top:18px;">' +
      "<p><strong>L'envoi automatique n'a pas abouti.</strong> Votre droit n'en " +
      "dépend pas : écrivez simplement à " +
      "<strong>" + ((adresse && adresse.textContent) || "rotaryclubdufrancois@gmail.com") +
      "</strong> en indiquant votre numéro de commande et votre volonté de vous " +
      "rétracter. Un message daté suffit, aucune formule particulière n'est exigée.</p>" +
      "</div>"
    );
  }

  function afficherAccuse(reponse) {
    formulaire.innerHTML =
      '<div class="doc__encart">' +
      "<h2 class=\"doc__encart-titre\">Votre rétractation est enregistrée</h2>" +
      "<p>Numéro d'accusé de réception : <strong>" + reponse.accuse + "</strong></p>" +
      "<p>Notez-le ou imprimez cette page : il atteste de la date de votre demande.</p>" +
      "<p>Le club vous remboursera l'intégralité des sommes versées, frais de " +
      "livraison standard compris, au plus tard le <strong>" + reponse.echeance +
      "</strong>. Le Trésorier vous contactera pour organiser le renvoi de " +
      "l'article, si vous l'avez déjà reçu.</p>" +
      (reponse.courriel_envoye
        ? "<p>Une confirmation vous a été adressée par courriel.</p>"
        : "<p>La confirmation par courriel n'a pas pu être envoyée, mais votre " +
          "demande est bien enregistrée : le numéro ci-dessus en fait foi.</p>") +
      (reponse.commande_retrouvee
        ? ""
        : "<p>Le numéro de commande saisi n'a pas été retrouvé dans nos " +
          "registres. Ce n'est pas bloquant — votre demande est prise en compte " +
          "et le club fera le rapprochement — mais vérifiez-le, cela accélérera " +
          "le traitement.</p>") +
      "</div>";
    formulaire.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  formulaire.addEventListener("submit", function (e) {
    e.preventDefault();

    var donnees = {};
    new FormData(formulaire).forEach(function (valeur, cle) {
      donnees[cle] = typeof valeur === "string" ? valeur.trim() : valeur;
    });

    if (!donnees.nom || !donnees.email || !donnees.reference) {
      message(
        "Merci d'indiquer votre nom, votre adresse électronique et le numéro de votre commande.",
        "erreur"
      );
      return;
    }

    if (!RC || RC.baseApi() === null) {
      message("", null);
      replierVersLeCourriel();
      return;
    }

    bouton.disabled = true;
    message("Envoi en cours…", null);

    RC.api("/api/public/retractation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(donnees),
    })
      .then(function (reponse) {
        if (reponse && reponse.ok) {
          afficherAccuse(reponse);
          return;
        }
        message(
          (reponse && reponse.erreur) ||
            "L'envoi n'a pas abouti. Votre droit reste entier : voyez ci-dessous.",
          "erreur"
        );
        replierVersLeCourriel();
      })
      .catch(function () {
        message("", null);
        replierVersLeCourriel();
      })
      .finally(function () {
        bouton.disabled = false;
      });
  });
})();
