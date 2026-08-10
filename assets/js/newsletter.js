/* ==========================================================================
   Inscription à la lettre d'information.

   Le formulaire ne dit jamais si une adresse est déjà inscrite : la réponse
   du serveur est identique dans tous les cas. Distinguer « nouvelle
   inscription » de « déjà abonné » transformerait le formulaire en outil de
   vérification d'adresses — « cette personne est-elle abonnée au Rotary du
   François ? » n'est pas une question à laquelle un site public doit
   répondre.

   L'inscription ne prend effet qu'après ouverture du lien reçu par
   courriel. Sans ce double consentement, n'importe qui pourrait inscrire
   l'adresse d'un tiers, et le club enverrait des messages non sollicités
   en son nom.
   ========================================================================== */
(function () {
  "use strict";

  function montrer(zone, message, erreur) {
    zone.textContent = message;
    zone.classList.toggle("lettre__reponse--erreur", !!erreur);
    zone.hidden = false;
  }

  function brancher(formulaire) {
    var zone = formulaire.querySelector("[data-lettre-reponse]");
    var bouton = formulaire.querySelector("button[type='submit']");

    formulaire.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!window.RC || !window.RC.api) {
        montrer(
          zone,
          "Le service d'inscription est momentanément indisponible. " +
            "Vous pouvez nous écrire directement.",
          true
        );
        return;
      }

      var email = (formulaire.querySelector("[name='email']").value || "").trim();
      var nom = (formulaire.querySelector("[name='nom']").value || "").trim();
      var accord = formulaire.querySelector("[name='consentement']").checked;

      if (!accord) {
        montrer(zone, "Merci de cocher la case d'acceptation avant de valider.", true);
        return;
      }

      bouton.disabled = true;
      bouton.textContent = "Envoi…";

      window.RC.api("/api/public/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email, nom: nom, consentement: true }),
      })
        .then(function (reponse) {
          if (reponse && reponse.ok) {
            montrer(zone, reponse.message, false);
            formulaire.reset();
          } else {
            montrer(zone, (reponse && reponse.erreur) || "Inscription impossible.", true);
          }
        })
        .catch(function () {
          montrer(
            zone,
            "L'inscription n'a pas abouti. Réessayez dans un instant, ou " +
              "écrivez-nous à l'adresse du club.",
            true
          );
        })
        .then(function () {
          bouton.disabled = false;
          bouton.textContent = "Je m'inscris";
        });
    });
  }

  function lancer() {
    var formulaires = document.querySelectorAll("[data-lettre-formulaire]");
    for (var i = 0; i < formulaires.length; i++) brancher(formulaires[i]);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", lancer);
  } else {
    lancer();
  }
})();
