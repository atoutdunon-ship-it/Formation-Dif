/* ==========================================================================
   Interact La Yole — demande d'accès et actions du club.

   La demande n'ouvre aucun droit : elle est déposée, puis examinée par le
   Secrétaire, le Président ou l'Administrateur du Rotary Club du François.
   Le message de retour le dit sans ambiguïté, pour qu'un jeune ne reste pas
   à attendre un courriel qui ne vient pas parce qu'il croyait l'affaire
   faite.
   ========================================================================== */
(function () {
  "use strict";

  function texte(v) {
    var d = document.createElement("div");
    d.textContent = v == null ? "" : String(v);
    return d.innerHTML;
  }

  function montrer(zone, message, erreur) {
    zone.textContent = message;
    zone.classList.toggle("lettre__reponse--erreur", !!erreur);
    zone.hidden = false;
  }

  /* ------------------------------------------------- demande d'adhésion */
  function brancherFormulaire() {
    var formulaire = document.querySelector("[data-interact-formulaire]");
    if (!formulaire) return;
    var zone = formulaire.querySelector("[data-interact-reponse]");
    var bouton = formulaire.querySelector("button[type='submit']");

    formulaire.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!window.RC || !window.RC.api) {
        montrer(zone, "Le service est momentanément indisponible. Écrivez-nous directement.", true);
        return;
      }

      var donnees = {};
      ["prenom", "nom", "date_naissance", "etablissement", "email",
       "telephone", "responsable_nom", "responsable_email", "motivation"]
        .forEach(function (champ) {
          var el = formulaire.querySelector("[name='" + champ + "']");
          donnees[champ] = el ? el.value.trim() : "";
        });
      donnees.consentement = formulaire.querySelector("[name='consentement']").checked;

      if (!donnees.consentement) {
        montrer(zone, "Merci de cocher la case d'acceptation avant de valider.", true);
        return;
      }
      if (!donnees.prenom || !donnees.nom || !donnees.email) {
        montrer(zone, "Le prénom, le nom et l'adresse e-mail sont nécessaires.", true);
        return;
      }

      bouton.disabled = true;
      bouton.textContent = "Envoi…";

      window.RC.api("/api/public/interact/adhesion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(donnees),
      })
        .then(function (r) {
          if (r && r.ok) {
            montrer(zone, r.message, false);
            formulaire.reset();
          } else {
            montrer(zone, (r && r.erreur) || "Demande impossible.", true);
          }
        })
        .catch(function () {
          montrer(zone, "La demande n'a pas abouti. Réessayez, ou écrivez-nous à l'adresse du club.", true);
        })
        .then(function () {
          bouton.disabled = false;
          bouton.textContent = "Envoyer ma demande";
        });
    });
  }

  /* ------------------------------------------- actions du club Interact */
  function chargerActions() {
    var socle = document.querySelector("[data-dynamic='interact-actions']");
    if (!socle || !window.RC || !window.RC.api) return;

    window.RC.api("/api/public/interact/actions")
      .then(function (actions) {
        if (!actions || !actions.length) return; // le repli statique reste
        socle.innerHTML = actions
          .map(function (a) {
            return (
              '<div class="card">' +
              (a.image_url
                ? '<img class="card__photo" src="' + texte(a.image_url) + '" alt="">'
                : "") +
              '<div class="card__meta">' + texte(a.annee || "") + "</div>" +
              "<h3>" + texte(a.titre) + "</h3>" +
              '<div class="texte-riche">' + (a.description || "") + "</div>" +
              "</div>"
            );
          })
          .join("");
      })
      .catch(function () {});
  }

  function lancer() {
    brancherFormulaire();
    chargerActions();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", lancer);
  } else {
    lancer();
  }
})();
