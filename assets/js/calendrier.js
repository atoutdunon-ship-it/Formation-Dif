/* ==========================================================================
   Calendrier du club — semaine, mois, année.

   Un seul fichier, deux emplois : le site public et l'espace membre. Le
   comportement est identique des deux côtés, seule la source des données
   change — le visiteur ne reçoit que les événements publics, le membre
   reçoit aussi les privés, signalés comme tels. C'est le serveur qui
   décide, jamais ce script : un filtre écrit ici laisserait les données
   transiter, et il suffirait d'ouvrir la console pour lire l'ordre du jour
   d'une réunion de bureau.

   Sans dépendance extérieure. Une bibliothèque de calendrier pèse plusieurs
   centaines de kilo-octets, impose son vocabulaire visuel et devient une
   dette le jour où elle n'est plus maintenue. Ce dont un club a besoin —
   une grille, trois vues, un clic — tient en un fichier qu'on peut relire.

   Branchement :
     <div data-calendrier
          data-source="/api/public/agenda"
          data-fiche="evenement.html?id="></div>
   ========================================================================== */
(function () {
  "use strict";

  var JOURS = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];
  var JOURS_COURTS = ["L", "M", "M", "J", "V", "S", "D"];
  var MOIS = ["janvier", "février", "mars", "avril", "mai", "juin",
              "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
  var MOIS_COURTS = ["janv.", "févr.", "mars", "avril", "mai", "juin",
                     "juil.", "août", "sept.", "oct.", "nov.", "déc."];

  function texte(v) {
    var d = document.createElement("div");
    d.textContent = v == null ? "" : String(v);
    return d.innerHTML;
  }

  /* Le lundi comme premier jour : c'est la semaine française. getDay()
     compte à partir du dimanche, d'où le décalage. */
  function lundiDeLaSemaine(d) {
    var copie = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    var decalage = (copie.getDay() + 6) % 7;
    copie.setDate(copie.getDate() - decalage);
    return copie;
  }

  function memeJour(a, b) {
    return a.getFullYear() === b.getFullYear()
        && a.getMonth() === b.getMonth()
        && a.getDate() === b.getDate();
  }

  function iso(d) {
    return d.getFullYear() + "-"
         + String(d.getMonth() + 1).padStart(2, "0") + "-"
         + String(d.getDate()).padStart(2, "0");
  }

  function heure(d) {
    if (d.getHours() === 0 && d.getMinutes() === 0) return "";
    return String(d.getHours()).padStart(2, "0") + "h"
         + String(d.getMinutes()).padStart(2, "0");
  }

  function Calendrier(socle) {
    this.socle = socle;
    this.source = socle.getAttribute("data-source") || "/api/public/agenda";
    this.fiche = socle.getAttribute("data-fiche") || "";
    this.vue = socle.getAttribute("data-vue") || "mois";
    this.curseur = new Date();
    this.evenements = [];
    this.construire();
    this.charger();
  }

  Calendrier.prototype.construire = function () {
    var self = this;
    this.socle.innerHTML =
      '<div class="cal-barre">' +
      '  <div class="cal-barre__navigation">' +
      '    <button type="button" class="cal-bouton" data-aller="-1" aria-label="Période précédente">‹</button>' +
      '    <button type="button" class="cal-bouton" data-aller="0">Aujourd\'hui</button>' +
      '    <button type="button" class="cal-bouton" data-aller="1" aria-label="Période suivante">›</button>' +
      '    <span class="cal-titre" role="status"></span>' +
      '  </div>' +
      '  <div class="cal-vues" role="group" aria-label="Affichage">' +
      '    <button type="button" class="cal-vue" data-vue="semaine">Semaine</button>' +
      '    <button type="button" class="cal-vue" data-vue="mois">Mois</button>' +
      '    <button type="button" class="cal-vue" data-vue="annee">Année</button>' +
      '  </div>' +
      '</div>' +
      '<div class="cal-corps" aria-live="polite"><p class="cal-attente">Chargement de l\'agenda…</p></div>' +
      '<div class="cal-legende">' +
      '  <span class="cal-pastille cal-pastille--reunion"></span>Réunion' +
      '  <span class="cal-pastille cal-pastille--ceremonie"></span>Cérémonie' +
      '  <span class="cal-pastille cal-pastille--action"></span>Action' +
      '  <span class="cal-pastille cal-pastille--autre"></span>Autre' +
      '</div>';

    this.socle.querySelectorAll("[data-aller]").forEach(function (b) {
      b.addEventListener("click", function () {
        self.deplacer(parseInt(b.getAttribute("data-aller"), 10));
      });
    });
    this.socle.querySelectorAll("[data-vue]").forEach(function (b) {
      b.addEventListener("click", function () {
        self.vue = b.getAttribute("data-vue");
        self.charger();
      });
    });
  };

  Calendrier.prototype.deplacer = function (pas) {
    if (pas === 0) { this.curseur = new Date(); }
    else if (this.vue === "semaine") { this.curseur.setDate(this.curseur.getDate() + 7 * pas); }
    else if (this.vue === "annee") { this.curseur.setFullYear(this.curseur.getFullYear() + pas); }
    else { this.curseur.setMonth(this.curseur.getMonth() + pas); }
    this.charger();
  };

  /* Bornes de la période affichée. On demande au serveur exactement ce
     qu'on va montrer : ni plus — inutile de transporter une année pour
     afficher une semaine — ni moins. */
  Calendrier.prototype.bornes = function () {
    var d = this.curseur;
    if (this.vue === "semaine") {
      var lundi = lundiDeLaSemaine(d);
      var dimanche = new Date(lundi); dimanche.setDate(lundi.getDate() + 6);
      return [lundi, dimanche];
    }
    if (this.vue === "annee") {
      return [new Date(d.getFullYear(), 0, 1), new Date(d.getFullYear(), 11, 31)];
    }
    var premier = new Date(d.getFullYear(), d.getMonth(), 1);
    var dernier = new Date(d.getFullYear(), d.getMonth() + 1, 0);
    // La grille du mois déborde sur les semaines voisines : on élargit,
    // sinon les cases de début et de fin paraîtraient vides à tort.
    var debut = lundiDeLaSemaine(premier);
    var fin = new Date(dernier); fin.setDate(fin.getDate() + (7 - ((fin.getDay() + 6) % 7)));
    return [debut, fin];
  };

  Calendrier.prototype.charger = function () {
    var self = this;
    var bornes = this.bornes();
    this.socle.querySelectorAll(".cal-vue").forEach(function (b) {
      b.classList.toggle("is-active", b.getAttribute("data-vue") === self.vue);
    });

    var appel;
    var chemin = this.source + "?debut=" + iso(bornes[0]) + "&fin=" + iso(bornes[1]);
    if (window.RC && window.RC.api && this.source.indexOf("/api/public") === 0) {
      appel = window.RC.api(chemin);
    } else {
      appel = fetch(chemin, { credentials: "same-origin" })
        .then(function (r) { return r.ok ? r.json() : null; })
        .catch(function () { return null; });
    }

    appel.then(function (donnees) {
      if (!donnees) {
        self.socle.querySelector(".cal-corps").innerHTML =
          '<p class="cal-attente">L\'agenda est momentanément indisponible. ' +
          'Réessayez dans un instant.</p>';
        return;
      }
      self.evenements = donnees.map(function (e) {
        var debut = new Date(e.date_debut);
        return {
          id: e.id, titre: e.titre, type: e.type || "autre",
          lieu: e.lieu, pourQui: e.pour_qui, prive: !!e.prive,
          inscriptions: !!e.inscriptions,
          debut: debut,
          fin: e.date_fin ? new Date(e.date_fin) : debut
        };
      });
      self.dessiner();
    });
  };

  Calendrier.prototype.duJour = function (jour) {
    return this.evenements.filter(function (e) {
      var d = new Date(e.debut.getFullYear(), e.debut.getMonth(), e.debut.getDate());
      var f = new Date(e.fin.getFullYear(), e.fin.getMonth(), e.fin.getDate());
      var j = new Date(jour.getFullYear(), jour.getMonth(), jour.getDate());
      return j >= d && j <= f;
    }).sort(function (a, b) { return a.debut - b.debut; });
  };

  Calendrier.prototype.lien = function (e) {
    var etiquette = (heure(e.debut) ? heure(e.debut) + " " : "") + e.titre;
    var classes = "cal-evenement cal-evenement--" + texte(e.type);
    if (e.prive) classes += " cal-evenement--prive";
    if (!this.fiche || !e.id) {
      return '<span class="' + classes + '" title="' + texte(e.titre) + '">'
           + texte(etiquette) + "</span>";
    }
    return '<a class="' + classes + '" href="' + texte(this.fiche + e.id) + '"'
         + ' title="' + texte(e.titre + (e.lieu ? " — " + e.lieu : "")) + '">'
         + texte(etiquette) + "</a>";
  };

  Calendrier.prototype.dessiner = function () {
    var titre = this.socle.querySelector(".cal-titre");
    var corps = this.socle.querySelector(".cal-corps");
    var d = this.curseur;

    if (this.vue === "semaine") {
      titre.textContent = "Semaine du " + this.semaineLibelle();
      corps.innerHTML = this.grilleSemaine();
    } else if (this.vue === "annee") {
      titre.textContent = String(d.getFullYear());
      corps.innerHTML = this.grilleAnnee();
    } else {
      titre.textContent = MOIS[d.getMonth()] + " " + d.getFullYear();
      corps.innerHTML = this.grilleMois();
    }
  };

  Calendrier.prototype.semaineLibelle = function () {
    var lundi = lundiDeLaSemaine(this.curseur);
    var dimanche = new Date(lundi); dimanche.setDate(lundi.getDate() + 6);
    return lundi.getDate() + " " + MOIS_COURTS[lundi.getMonth()] + " au "
         + dimanche.getDate() + " " + MOIS_COURTS[dimanche.getMonth()]
         + " " + dimanche.getFullYear();
  };

  Calendrier.prototype.grilleMois = function () {
    var self = this, aujourdhui = new Date();
    var premier = new Date(this.curseur.getFullYear(), this.curseur.getMonth(), 1);
    var curseur = lundiDeLaSemaine(premier);
    var html = '<div class="cal-grille cal-grille--mois">';
    JOURS.forEach(function (j, i) {
      html += '<div class="cal-entete"><span class="cal-entete__long">' + j
            + '</span><span class="cal-entete__court">' + JOURS_COURTS[i] + "</span></div>";
    });
    for (var semaine = 0; semaine < 6; semaine++) {
      for (var jour = 0; jour < 7; jour++) {
        var horsMois = curseur.getMonth() !== this.curseur.getMonth();
        var classes = "cal-case" + (horsMois ? " cal-case--hors" : "")
                    + (memeJour(curseur, aujourdhui) ? " cal-case--aujourdhui" : "");
        html += '<div class="' + classes + '">'
              + '<div class="cal-case__numero">' + curseur.getDate() + "</div>";
        this.duJour(curseur).forEach(function (e) { html += self.lien(e); });
        html += "</div>";
        curseur.setDate(curseur.getDate() + 1);
      }
      // Sixième ligne inutile quand le mois tient en cinq semaines : on
      // s'arrête plutôt que d'afficher une bande vide.
      if (curseur.getMonth() !== this.curseur.getMonth() && semaine >= 4) break;
    }
    return html + "</div>";
  };

  Calendrier.prototype.grilleSemaine = function () {
    var self = this, aujourdhui = new Date();
    var curseur = lundiDeLaSemaine(this.curseur);
    var html = '<div class="cal-semaine">';
    for (var i = 0; i < 7; i++) {
      var liste = this.duJour(curseur);
      html += '<div class="cal-jour' + (memeJour(curseur, aujourdhui) ? " cal-jour--aujourdhui" : "") + '">'
            + '<div class="cal-jour__entete"><strong>' + JOURS[i] + "</strong> "
            + curseur.getDate() + " " + MOIS_COURTS[curseur.getMonth()] + "</div>"
            + '<div class="cal-jour__liste">';
      if (!liste.length) {
        html += '<span class="cal-jour__vide">—</span>';
      } else {
        liste.forEach(function (e) { html += self.lien(e); });
      }
      html += "</div></div>";
      curseur.setDate(curseur.getDate() + 1);
    }
    return html + "</div>";
  };

  Calendrier.prototype.grilleAnnee = function () {
    var self = this, annee = this.curseur.getFullYear();
    var aujourdhui = new Date();
    var html = '<div class="cal-annee">';
    for (var mois = 0; mois < 12; mois++) {
      html += '<div class="cal-mois"><div class="cal-mois__titre">' + MOIS[mois] + "</div>"
            + '<div class="cal-mois__grille">';
      JOURS_COURTS.forEach(function (j) {
        html += '<div class="cal-mois__jour">' + j + "</div>";
      });
      var curseur = lundiDeLaSemaine(new Date(annee, mois, 1));
      for (var i = 0; i < 42; i++) {
        var horsMois = curseur.getMonth() !== mois;
        var liste = horsMois ? [] : this.duJour(curseur);
        var classes = "cal-mois__case" + (horsMois ? " cal-mois__case--hors" : "")
                    + (liste.length ? " cal-mois__case--occupee" : "")
                    + (memeJour(curseur, aujourdhui) ? " cal-mois__case--aujourdhui" : "");
        var titreCase = liste.map(function (e) { return e.titre; }).join(" · ");
        if (liste.length === 1 && this.fiche && liste[0].id) {
          html += '<a class="' + classes + '" href="' + texte(this.fiche + liste[0].id)
                + '" title="' + texte(titreCase) + '">' + curseur.getDate() + "</a>";
        } else {
          html += '<div class="' + classes + '"'
                + (titreCase ? ' title="' + texte(titreCase) + '"' : "")
                + ">" + curseur.getDate() + "</div>";
        }
        curseur.setDate(curseur.getDate() + 1);
        if (curseur.getMonth() !== mois && curseur.getDate() > 7) break;
      }
      html += "</div></div>";
    }
    return html + "</div>";
  };

  function lancer() {
    document.querySelectorAll("[data-calendrier]").forEach(function (socle) {
      new Calendrier(socle);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", lancer);
  } else {
    lancer();
  }
})();
