/* ==========================================================================
   Actualités — bandeau à la une, rubriques en carrousel, lecture en place.

   Trois partis pris.

   1. Une seule requête. Les douze derniers articles arrivent ensemble et
      servent au bandeau, aux rubriques et à la lecture. Un article ouvert
      ne déclenche aucun appel : son texte est déjà là.

   2. Aucune page par article. Le site est statique et hébergé sur GitHub
      Pages : engendrer un fichier HTML par actualité obligerait à
      republier le site à chaque parution. La lecture se fait donc en
      surimpression, et l'adresse porte le repère de l'article pour qu'un
      lien partagé rouvre le bon texte.

   3. Le carrousel ne démarre pas tout seul. Un défilement automatique
      déplace le contenu sous les yeux de qui est en train de lire, et
      complique la tâche des lecteurs d'écran. La navigation reste au
      visiteur — flèches, clavier, ou doigt.
   ========================================================================== */
(function () {
  "use strict";

  var articles = [];
  var indexUne = 0;

  /* ---------------------------------------------------------- utilitaires */
  function texte(valeur) {
    var d = document.createElement("div");
    d.textContent = valeur == null ? "" : String(valeur);
    return d.innerHTML;
  }

  /** Retire les balises d'un texte déjà assaini côté serveur, pour en faire
   *  une accroche de carte. On ne peut pas se contenter d'une expression
   *  régulière : « <p>a</p><p>b</p> » donnerait « ab » sans espace. */
  function accroche(html, limite) {
    var d = document.createElement("div");
    d.innerHTML = html || "";
    var brut = (d.textContent || "").replace(/\s+/g, " ").trim();
    if (brut.length <= limite) return brut;
    var coupe = brut.slice(0, limite);
    var espace = coupe.lastIndexOf(" ");
    return (espace > limite * 0.6 ? coupe.slice(0, espace) : coupe) + "…";
  }

  function dateLongue(iso) {
    var d = new Date(iso + "T00:00:00");
    if (isNaN(d)) return iso || "";
    var langue = (window.rcLangue && window.rcLangue.courante) || "fr";
    try {
      return d.toLocaleDateString(langue, {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } catch (e) {
      return d.toLocaleDateString("fr-FR");
    }
  }

  /* ------------------------------------------------------------- bandeau */
  function construireUne(liste) {
    var socle = document.querySelector("[data-une]");
    if (!socle) return;
    if (!liste.length) {
      socle.remove();
      return;
    }

    var volets = liste
      .map(function (a) {
        var image = a.image_url
          ? '<img class="une__image" src="' + texte(a.image_url) + '" alt="" loading="lazy">'
          : "";
        return (
          '<article class="une__volet">' +
          image +
          '<div class="une__voile"></div>' +
          '<div class="une__texte">' +
          '<div class="une__rubrique">' +
          texte(a.theme_libelle || "Actualité du club") +
          " — " +
          texte(dateLongue(a.date_publication)) +
          "</div>" +
          '<h2 class="une__titre">' + texte(a.titre) + "</h2>" +
          '<p class="une__chapo">' + texte(accroche(a.chapo || a.contenu, 200)) + "</p>" +
          '<button type="button" class="btn btn--primary" data-lire="' + a.id + '">Lire l\'article</button>' +
          "</div></article>"
        );
      })
      .join("");

    socle.innerHTML =
      '<div class="une__piste" data-une-piste>' + volets + "</div>" +
      (liste.length > 1
        ? '<div class="une__barre">' +
          '<button type="button" class="fleche" data-une-prec aria-label="Article précédent">‹</button>' +
          '<span class="une__rang" data-une-rang>01</span>' +
          '<button type="button" class="fleche" data-une-suiv aria-label="Article suivant">›</button>' +
          "</div>"
        : "");

    if (liste.length > 1) {
      socle.querySelector("[data-une-prec]").addEventListener("click", function () {
        allerA(indexUne - 1, liste.length);
      });
      socle.querySelector("[data-une-suiv]").addEventListener("click", function () {
        allerA(indexUne + 1, liste.length);
      });
      socle.addEventListener("keydown", function (e) {
        if (e.key === "ArrowLeft") allerA(indexUne - 1, liste.length);
        if (e.key === "ArrowRight") allerA(indexUne + 1, liste.length);
      });
      socle.setAttribute("tabindex", "0");
    }
    allerA(0, liste.length);
  }

  function allerA(position, total) {
    // Défilement circulaire : arrivé au dernier, on revient au premier.
    // Des flèches désactivées aux extrémités laisseraient croire à une panne.
    indexUne = ((position % total) + total) % total;
    var piste = document.querySelector("[data-une-piste]");
    var rang = document.querySelector("[data-une-rang]");
    if (piste) piste.style.transform = "translateX(-" + indexUne * 100 + "%)";
    if (rang) {
      rang.textContent =
        String(indexUne + 1).padStart(2, "0") + " / " + String(total).padStart(2, "0");
    }
  }

  /* ----------------------------------------------------------- rubriques */
  function carte(a) {
    var image = a.image_url
      ? '<img class="article-carte__photo" src="' + texte(a.image_url) + '" alt="" loading="lazy">'
      : '<div class="article-carte__photo article-carte__photo--absente"></div>';
    return (
      '<button type="button" class="article-carte" data-lire="' + a.id + '">' +
      image +
      '<div class="article-carte__corps">' +
      '<div class="article-carte__date">' +
      texte(dateLongue(a.date_publication)) +
      (a.theme_libelle ? " — " + texte(a.theme_libelle) : "") +
      "</div>" +
      '<h3 class="article-carte__titre">' + texte(a.titre) + "</h3>" +
      '<p class="article-carte__chapo">' + texte(accroche(a.chapo || a.contenu, 150)) + "</p>" +
      '<span class="article-carte__lire">Lire</span>' +
      "</div></button>"
    );
  }

  function remplirRubrique(socle, liste) {
    var piste = socle.querySelector("[data-piste]");
    if (!piste) return;

    if (!liste.length) {
      socle.innerHTML =
        '<div class="rubrique__vide">Aucun article dans cette rubrique pour le moment.</div>';
      return;
    }

    piste.innerHTML = liste.map(carte).join("");

    var prec = socle.querySelector("[data-prec]");
    var suiv = socle.querySelector("[data-suiv]");
    if (!prec || !suiv) return;

    // Une seule rangée : les flèches n'ont rien à faire défiler.
    if (liste.length <= 1) {
      prec.parentNode.remove();
      return;
    }

    function pas() {
      var premiere = piste.firstElementChild;
      return premiere ? premiere.getBoundingClientRect().width + 26 : 320;
    }
    prec.addEventListener("click", function () {
      piste.scrollBy({ left: -pas(), behavior: "smooth" });
    });
    suiv.addEventListener("click", function () {
      piste.scrollBy({ left: pas(), behavior: "smooth" });
    });

    function majFleches() {
      prec.disabled = piste.scrollLeft <= 4;
      suiv.disabled = piste.scrollLeft + piste.clientWidth >= piste.scrollWidth - 4;
    }
    piste.addEventListener("scroll", majFleches);
    window.addEventListener("resize", majFleches);
    majFleches();
  }

  /* ------------------------------------------------------------- lecture */
  function ouvrir(id) {
    var article = articles.filter(function (a) {
      return String(a.id) === String(id);
    })[0];
    if (!article) return;

    var lecteur = document.querySelector("[data-lecteur]");
    if (!lecteur) return;

    lecteur.querySelector("[data-lecteur-corps]").innerHTML =
      (article.image_url
        ? '<img class="lecteur__image" src="' + texte(article.image_url) + '" alt="">'
        : "") +
      '<div class="lecteur__corps">' +
      '<div class="lecteur__date">' +
      texte(dateLongue(article.date_publication)) +
      (article.theme_libelle ? " — " + texte(article.theme_libelle) : "") +
      "</div>" +
      '<h2 class="lecteur__titre">' + texte(article.titre) + "</h2>" +
      (article.chapo ? '<div class="lecteur__chapo">' + article.chapo + "</div>" : "") +
      '<div class="lecteur__texte">' + (article.contenu || "") + "</div>" +
      "</div>";

    lecteur.hidden = false;
    document.body.style.overflow = "hidden";
    lecteur.querySelector("[data-fermer]").focus();
    // Le repère dans l'adresse permet de partager un lien vers l'article,
    // et le bouton « précédent » du navigateur referme la lecture.
    if (history.replaceState) history.replaceState(null, "", "#article-" + id);
  }

  function fermer() {
    var lecteur = document.querySelector("[data-lecteur]");
    if (!lecteur || lecteur.hidden) return;
    lecteur.hidden = true;
    document.body.style.overflow = "";
    if (history.replaceState) {
      history.replaceState(null, "", location.pathname + location.search);
    }
  }

  /* ------------------------------------------------------------- montage */
  function repartir(liste) {
    var une = liste.slice(0, Math.min(4, liste.length));
    var recents = liste.slice(0, 9);
    var themes = liste.filter(function (a) {
      return a.theme;
    });
    return { une: une, recents: recents, themes: themes };
  }

  function demarrer(liste) {
    articles = liste || [];
    var groupes = repartir(articles);

    construireUne(groupes.une);

    var socleRecents = document.querySelector("[data-rubrique='recentes']");
    if (socleRecents) remplirRubrique(socleRecents, groupes.recents);

    var socleThemes = document.querySelector("[data-rubrique='themes']");
    if (socleThemes) {
      if (groupes.themes.length) {
        remplirRubrique(socleThemes, groupes.themes);
      } else {
        socleThemes.remove();
      }
    }

    document.addEventListener("click", function (e) {
      var declencheur = e.target.closest("[data-lire]");
      if (declencheur) {
        e.preventDefault();
        ouvrir(declencheur.getAttribute("data-lire"));
        return;
      }
      var lecteur = document.querySelector("[data-lecteur]");
      if (lecteur && !lecteur.hidden) {
        if (e.target.closest("[data-fermer]") || e.target === lecteur) fermer();
      }
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") fermer();
    });

    var repere = (location.hash || "").match(/^#article-(\d+)$/);
    if (repere) ouvrir(repere[1]);
  }

  function lancer() {
    if (!document.querySelector("[data-une]")) return;
    if (!window.RC || !window.RC.api) return;
    window.RC.api("/api/public/actualites")
      .then(demarrer)
      .catch(function () {
        // Le serveur du club est injoignable : la page garde son contenu
        // statique de repli plutôt que d'afficher une erreur au visiteur.
      });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", lancer);
  } else {
    lancer();
  }
})();
