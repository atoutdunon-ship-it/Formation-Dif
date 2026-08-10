/* ==========================================================================
   Page d'un événement — détail, .ics, partage, annonce de venue.

   La page est statique : c'est l'identifiant passé dans l'adresse
   (`evenement.html?id=12`) qui décide de ce qu'elle affiche. Une page par
   événement aurait obligé à régénérer et redéposer le site à chaque
   rendez-vous ajouté ; ici, le club ajoute l'événement dans l'espace
   membre et la page existe aussitôt.

   Aucun filtre de visibilité n'est appliqué ici. Un événement privé ne sort
   pas de l'API : le serveur répond 404, et cette page affiche le même
   message que pour un identifiant inexistant. Répondre « interdit »
   confirmerait l'existence du rendez-vous à qui essaie les numéros un par un.
   ========================================================================== */
(function () {
  "use strict";

  var MOIS = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet",
              "août", "septembre", "octobre", "novembre", "décembre"];
  var JOURS = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"];

  function ancrage(nom) { return document.querySelector('[data-fiche="' + nom + '"]'); }

  function ecrire(nom, valeur) {
    var el = ancrage(nom);
    if (el) el.textContent = valeur == null || valeur === "" ? "—" : String(valeur);
  }

  function identifiant() {
    var m = (window.location.search || "").match(/[?&]id=(\d+)/);
    return m ? m[1] : null;
  }

  function dateLongue(d) {
    return JOURS[d.getDay()] + " " + d.getDate() + " " + MOIS[d.getMonth()]
         + " " + d.getFullYear();
  }

  function heure(d) {
    return String(d.getHours()).padStart(2, "0") + "h"
         + String(d.getMinutes()).padStart(2, "0");
  }

  function afficherErreur(message) {
    var zone = ancrage("erreur");
    if (zone) { zone.textContent = message; zone.hidden = false; }
    ecrire("titre", "Événement introuvable");
    ecrire("quand", "");
    var bloc = document.querySelector("[data-evenement]");
    if (bloc) bloc.classList.add("evenement--absent");
  }

  function remplir(e) {
    var debut = new Date(e.date_debut);
    var fin = e.date_fin ? new Date(e.date_fin) : null;

    document.title = e.titre + " — Rotary Club du François";
    ecrire("titre", e.titre);
    ecrire("quand", dateLongue(debut));
    ecrire("date", dateLongue(debut) + (fin && fin.toDateString() !== debut.toDateString()
      ? " au " + dateLongue(fin) : ""));

    var minuit = debut.getHours() === 0 && debut.getMinutes() === 0;
    ecrire("horaire", minuit ? "Toute la journée"
      : heure(debut) + (fin && fin > debut ? " – " + heure(fin) : ""));
    ecrire("lieu", e.lieu);
    ecrire("pour_qui", e.pour_qui);

    var description = ancrage("description");
    if (description) {
      // Le texte a déjà été assaini par le serveur, à la liste blanche.
      description.innerHTML = e.description || "<p>Aucune précision n'a été ajoutée.</p>";
    }

    var base = (window.RC && window.RC.baseApi && window.RC.baseApi()) || "";
    var ics = ancrage("ics");
    if (ics) ics.href = base + "/api/public/agenda/" + e.id + ".ics";

    var lien = ancrage("lien");
    if (lien) lien.value = window.location.href;

    if (e.inscriptions) preparerInscription(e);
  }

  function preparerInscription(e) {
    var bloc = ancrage("bloc-inscription");
    if (!bloc) return;
    bloc.hidden = false;

    var jauge = ancrage("jauge");
    if (jauge) {
      if (e.places) {
        jauge.textContent = e.places_restantes + " place(s) encore disponible(s) sur "
                          + e.places + ".";
      } else if (e.attendus) {
        jauge.textContent = e.attendus + " personne(s) ont déjà annoncé leur venue.";
      } else {
        jauge.textContent = "";
      }
    }

    var formulaire = bloc.querySelector("[data-inscription]");
    var reponse = ancrage("reponse");
    var bouton = formulaire.querySelector("button[type='submit']");

    formulaire.addEventListener("submit", function (ev) {
      ev.preventDefault();
      if (!window.RC || !window.RC.api) {
        montrer(reponse, "Le service est momentanément indisponible.", true);
        return;
      }
      var donnees = {};
      ["nom", "email", "telephone", "personnes", "message"].forEach(function (champ) {
        var el = formulaire.querySelector("[name='" + champ + "']");
        donnees[champ] = el ? el.value.trim() : "";
      });
      donnees.consentement = formulaire.querySelector("[name='consentement']").checked;

      if (!donnees.consentement) {
        montrer(reponse, "Merci de cocher la case d'acceptation.", true);
        return;
      }
      if (!donnees.nom || !donnees.email) {
        montrer(reponse, "Le nom et l'adresse e-mail sont nécessaires.", true);
        return;
      }

      bouton.disabled = true;
      var libelle = bouton.textContent;
      bouton.textContent = "Envoi…";

      window.RC.api("/api/public/agenda/" + e.id + "/inscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(donnees)
      }).then(function (r) {
        if (r && r.ok) {
          montrer(reponse, r.message, false);
          formulaire.reset();
        } else {
          montrer(reponse, (r && r.erreur) || "L'inscription n'a pas abouti.", true);
        }
      }).catch(function () {
        montrer(reponse, "Serveur injoignable. Réessayez, ou écrivez-nous.", true);
      }).then(function () {
        bouton.disabled = false;
        bouton.textContent = libelle;
      });
    });
  }

  function montrer(zone, message, erreur) {
    if (!zone) return;
    zone.textContent = message;
    zone.classList.toggle("evenement__reponse--erreur", !!erreur);
    zone.hidden = false;
  }

  function brancherCopie() {
    var bouton = ancrage("copier");
    var champ = ancrage("lien");
    var retour = ancrage("copie");
    if (!bouton || !champ) return;
    bouton.addEventListener("click", function () {
      champ.select();
      // `navigator.clipboard` échoue hors HTTPS et dans certains navigateurs
      // anciens : la sélection reste alors visible, et un Ctrl+C fait le
      // travail. Mieux vaut cela qu'un bouton qui ne fait rien sans le dire.
      var reussi = false;
      try { reussi = document.execCommand("copy"); } catch (err) { reussi = false; }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(champ.value).then(function () {
          montrerCopie(retour, "Adresse copiée.");
        }).catch(function () {
          montrerCopie(retour, reussi ? "Adresse copiée."
            : "Copiez l'adresse sélectionnée avec Ctrl+C.");
        });
      } else {
        montrerCopie(retour, reussi ? "Adresse copiée."
          : "Copiez l'adresse sélectionnée avec Ctrl+C.");
      }
    });
  }

  function montrerCopie(zone, message) {
    if (!zone) return;
    zone.textContent = message;
    zone.hidden = false;
    setTimeout(function () { zone.hidden = true; }, 3000);
  }

  function lancer() {
    brancherCopie();
    var id = identifiant();
    if (!id) {
      afficherErreur("Aucun événement n'a été indiqué. Revenez à l'agenda pour en choisir un.");
      return;
    }
    if (!window.RC || !window.RC.api) {
      afficherErreur("L'agenda est momentanément indisponible.");
      return;
    }
    window.RC.api("/api/public/agenda/" + id).then(function (e) {
      if (!e || e.erreur || !e.titre) {
        afficherErreur("Cet événement n'existe pas, ou n'est pas public.");
        return;
      }
      remplir(e);
    }).catch(function () {
      afficherErreur("L'agenda est momentanément indisponible.");
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", lancer);
  } else {
    lancer();
  }
})();
