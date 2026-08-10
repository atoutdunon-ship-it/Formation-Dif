/**
 * ASSO-CORE — Éditeur de texte enrichi.
 *
 * Transforme tout `<textarea data-editeur>` en zone de rédaction mise en
 * forme : gras, italique, souligné, barré, police, taille, couleur,
 * intertitres, listes, alignement, liens, citation, séparateur.
 *
 * Trois partis pris :
 *
 * 1. **Aucune dépendance.** Ni CDN, ni bibliothèque à installer. L'éditeur
 *    fonctionne hors ligne, et rien ne peut casser le jour où un service
 *    tiers ferme.
 *
 * 2. **Palette fermée.** Couleurs, polices et tailles proviennent du serveur
 *    (`window.RC_EDITEUR`), qui les tient de `sanitize_html.py`. La barre
 *    d'outils et le filtre de sécurité lisent donc la même liste : il est
 *    impossible de proposer une valeur que le serveur refuserait ensuite.
 *
 * 3. **Le serveur reste juge.** Ce fichier est du confort de saisie. Aucune
 *    sécurité ne repose sur lui : tout ce qui est envoyé repasse par
 *    `assainir()` côté serveur.
 *
 * Le texte est stocké en HTML dans le `<textarea>` d'origine, qui reste le
 * seul champ soumis. Si ce script ne se charge pas, la zone de saisie
 * classique s'affiche et reste utilisable.
 */
(function () {
  "use strict";

  var CFG = window.RC_EDITEUR || {};
  var COULEURS = CFG.couleurs || [];
  var POLICES = CFG.polices || [];
  var TAILLES = CFG.tailles || [];

  /* Correspondance entre les mots-clés de taille produits par le navigateur
     (execCommand fontSize, indices 1 à 7) et nos tailles relatives. */
  var INDEX_TAILLE = ["x-small", "small", "medium", "large", "x-large", "xx-large", "xxx-large"];

  /* Couleur repère utilisée le temps d'une commande : le navigateur applique
     une couleur réelle, que l'on remplace aussitôt par la variable CSS
     correspondante. On garde ainsi la gestion fine des sélections partielles
     et des imbrications, que le navigateur fait bien mieux que nous. */
  var REPERES = {
    "var(--navy)": "#0c3c7c",
    "var(--navy-deep)": "#082a58",
    "var(--azure)": "#019fcb",
    "var(--black)": "#0a0a0a",
    "var(--grey)": "#58585a",
    "var(--gold)": "#f7a81b",
    "var(--white)": "#ffffff"
  };

  var REPERES_POLICE = {
    "var(--font-body)": "RCFontCourante",
    "var(--font-display)": "RCFontTitre"
  };

  /* ------------------------------------------------------------------ */
  /* Outils                                                              */
  /* ------------------------------------------------------------------ */

  function creer(balise, classe, texte) {
    var el = document.createElement(balise);
    if (classe) el.className = classe;
    if (texte !== undefined) el.textContent = texte;
    return el;
  }

  function hexVersRgb(hex) {
    var n = parseInt(hex.slice(1), 16);
    return "rgb(" + ((n >> 16) & 255) + ", " + ((n >> 8) & 255) + ", " + (n & 255) + ")";
  }

  /* Table inverse : "rgb(12, 60, 124)" -> "var(--navy)". */
  var RGB_VERS_VARIABLE = {};
  Object.keys(REPERES).forEach(function (variable) {
    RGB_VERS_VARIABLE[hexVersRgb(REPERES[variable])] = variable;
  });

  var POLICE_VERS_VARIABLE = {};
  Object.keys(REPERES_POLICE).forEach(function (variable) {
    POLICE_VERS_VARIABLE[REPERES_POLICE[variable]] = variable;
  });

  var MOTCLE_VERS_TAILLE = {};
  TAILLES.forEach(function (t, i) {
    // On répartit nos tailles sur les indices 1..7 dans l'ordre croissant.
    var index = [1, 3, 5, 6, 7][i];
    if (index) MOTCLE_VERS_TAILLE[INDEX_TAILLE[index - 1]] = t.valeur;
  });

  function indexDeTaille(valeur) {
    for (var i = 0; i < TAILLES.length; i++) {
      if (TAILLES[i].valeur === valeur) return [1, 3, 5, 6, 7][i] || 3;
    }
    return 3;
  }

  /* ------------------------------------------------------------------ */
  /* Normalisation : ramène ce que le navigateur a écrit vers la charte  */
  /* ------------------------------------------------------------------ */

  function normaliser(zone) {
    zone.querySelectorAll("[style]").forEach(function (el) {
      var s = el.style;

      if (s.color) {
        var variable = RGB_VERS_VARIABLE[s.color.replace(/\s+/g, " ").trim()];
        if (variable) s.setProperty("color", variable);
        else if (s.color.indexOf("var(") !== 0) s.removeProperty("color");
      }

      if (s.fontFamily) {
        var brute = s.fontFamily.replace(/["']/g, "").split(",")[0].trim();
        var pol = POLICE_VERS_VARIABLE[brute];
        if (pol) s.setProperty("font-family", pol);
        else if (s.fontFamily.indexOf("var(") !== 0) s.removeProperty("font-family");
      }

      if (s.fontSize) {
        var taille = MOTCLE_VERS_TAILLE[s.fontSize];
        if (taille) s.setProperty("font-size", taille);
        else if (!/^[\d.]+em$/.test(s.fontSize)) s.removeProperty("font-size");
      }

      // Toute autre propriété écrite par le navigateur est retirée : seules
      // les quatre déclarations de la charte survivent.
      for (var i = s.length - 1; i >= 0; i--) {
        var nom = s.item(i);
        if (["color", "font-family", "font-size", "text-align"].indexOf(nom) === -1) {
          s.removeProperty(nom);
        }
      }

      if (!s.length) el.removeAttribute("style");
    });

    // Balises devenues inutiles (<span> sans style) : on les déplie.
    zone.querySelectorAll("span:not([style]), font").forEach(function (el) {
      while (el.firstChild) el.parentNode.insertBefore(el.firstChild, el);
      el.parentNode.removeChild(el);
    });

    zone.querySelectorAll("b").forEach(function (el) { remplacerBalise(el, "strong"); });
    zone.querySelectorAll("i").forEach(function (el) { remplacerBalise(el, "em"); });
    zone.querySelectorAll("strike, del").forEach(function (el) { remplacerBalise(el, "s"); });
  }

  function remplacerBalise(el, nouvelle) {
    var neuf = document.createElement(nouvelle);
    if (el.getAttribute("style")) neuf.setAttribute("style", el.getAttribute("style"));
    while (el.firstChild) neuf.appendChild(el.firstChild);
    el.parentNode.replaceChild(neuf, el);
  }

  /* ------------------------------------------------------------------ */
  /* Nettoyage du collage (Word, Pages, pages web)                       */
  /* ------------------------------------------------------------------ */

  var BALISES_GARDEES = {
    P: "p", DIV: "p", BR: "br", HR: "hr",
    H1: "h2", H2: "h2", H3: "h3", H4: "h4", H5: "h4", H6: "h4",
    UL: "ul", OL: "ol", LI: "li", BLOCKQUOTE: "blockquote",
    STRONG: "strong", B: "strong", EM: "em", I: "em",
    U: "u", S: "s", STRIKE: "s", DEL: "s",
    A: "a", SUB: "sub", SUP: "sup", SPAN: "span"
  };

  function nettoyerColle(html) {
    var doc = new DOMParser().parseFromString(html, "text/html");
    doc.querySelectorAll("script, style, meta, link, title, head, iframe, object, embed, img, table, o\\:p")
      .forEach(function (el) { el.parentNode && el.parentNode.removeChild(el); });

    var sortie = document.createElement("div");
    reconstruire(doc.body, sortie);
    return sortie.innerHTML;
  }

  function reconstruire(source, cible) {
    Array.prototype.forEach.call(source.childNodes, function (noeud) {
      if (noeud.nodeType === 3) {
        cible.appendChild(document.createTextNode(noeud.nodeValue));
        return;
      }
      if (noeud.nodeType !== 1) return;

      var nom = BALISES_GARDEES[noeud.nodeName];
      if (!nom) {                       // balise inconnue : on garde le contenu
        reconstruire(noeud, cible);
        return;
      }
      var neuf = document.createElement(nom);
      if (nom === "a") {
        var href = noeud.getAttribute("href") || "";
        if (/^\s*(javascript|data|vbscript)\s*:/i.test(href)) {
          reconstruire(noeud, cible);   // lien douteux : texte seul
          return;
        }
        neuf.setAttribute("href", href);
      }
      // Aucun style, aucune classe : le collage arrive nu, la charte du site
      // s'applique. C'est précisément ce qu'on attend d'un collage Word.
      reconstruire(noeud, neuf);
      cible.appendChild(neuf);
    });
  }

  /* ------------------------------------------------------------------ */
  /* Construction d'un éditeur                                           */
  /* ------------------------------------------------------------------ */

  function construire(zoneTexte) {
    if (zoneTexte.dataset.editeurPret) return;
    zoneTexte.dataset.editeurPret = "1";

    var variante = zoneTexte.dataset.editeur || "complet";
    var enveloppe = creer("div", "editeur editeur--" + variante);
    var barre = creer("div", "editeur__barre");
    barre.setAttribute("role", "toolbar");
    barre.setAttribute("aria-label", "Mise en forme du texte");

    var zone = creer("div", "editeur__zone");
    zone.contentEditable = "true";
    zone.setAttribute("role", "textbox");
    zone.setAttribute("aria-multiline", "true");
    if (zoneTexte.id) zone.setAttribute("aria-labelledby", "label-" + zoneTexte.id);
    var minimum = variante === "simple" ? 2 : 6;
    zone.style.minHeight = Math.max(minimum, zoneTexte.rows || 0) * 1.7 + "em";
    if (zoneTexte.placeholder) zone.dataset.vide = zoneTexte.placeholder;

    zone.innerHTML = contenuInitial(zoneTexte.value);

    zoneTexte.parentNode.insertBefore(enveloppe, zoneTexte);
    enveloppe.appendChild(barre);
    enveloppe.appendChild(zone);
    enveloppe.appendChild(zoneTexte);
    zoneTexte.classList.add("editeur__source");
    zoneTexte.setAttribute("tabindex", "-1");
    zoneTexte.setAttribute("aria-hidden", "true");

    remplirBarre(barre, zone, zoneTexte, variante);
    brancher(zone, zoneTexte);
  }

  /** Contenu déjà enregistré : du texte brut tant que l'éditeur n'a pas
      servi, du HTML ensuite. On distingue les deux et on convertit. */
  function contenuInitial(valeur) {
    valeur = (valeur || "").trim();
    if (!valeur) return "<p><br></p>";
    if (/<(p|div|h[1-6]|ul|ol|li|blockquote|strong|em|u|s|span|a|br|hr)\b/i.test(valeur)) {
      return valeur;
    }
    var echappe = document.createElement("div");
    echappe.textContent = valeur;
    return echappe.innerHTML
      .split(/\n\s*\n/)
      .map(function (p) { return "<p>" + p.replace(/\n/g, "<br>") + "</p>"; })
      .join("");
  }

  /* ------------------------------------------------------------------ */
  /* Barre d'outils                                                      */
  /* ------------------------------------------------------------------ */

  function remplirBarre(barre, zone, source, variante) {
    // `data-editeur="simple"` : barre réduite pour les champs courts (note
    // sous une photo, message d'accueil d'un terminal de paiement). Les
    // intertitres et les listes n'y ont pas de sens.
    var complet = variante !== "simple";

    function commande(nom, valeur) {
      zone.focus();
      try { document.execCommand("styleWithCSS", false, true); } catch (e) { /* ignoré */ }
      document.execCommand(nom, false, valeur === undefined ? null : valeur);
      normaliser(zone);
      synchroniser(zone, source);
    }

    function groupe() {
      var g = creer("div", "editeur__groupe");
      barre.appendChild(g);
      return g;
    }

    function bouton(parent, libelle, titre, action, classe) {
      var b = creer("button", "editeur__bouton" + (classe ? " " + classe : ""), libelle);
      b.type = "button";
      b.title = titre;
      b.setAttribute("aria-label", titre);
      b.addEventListener("mousedown", function (e) { e.preventDefault(); });
      b.addEventListener("click", function (e) { e.preventDefault(); action(); });
      parent.appendChild(b);
      return b;
    }

    function menu(parent, etiquette, entrees, action) {
      var lot = creer("label", "editeur__champ");
      lot.appendChild(creer("span", "editeur__etiquette", etiquette));
      var select = creer("select", "editeur__select");
      entrees.forEach(function (e) {
        var o = creer("option", null, e.libelle);
        o.value = e.valeur;
        select.appendChild(o);
      });
      select.addEventListener("change", function () {
        action(select.value);
        select.selectedIndex = 0;
      });
      lot.appendChild(select);
      parent.appendChild(lot);
      return select;
    }

    /* --- Style de paragraphe --- */
    if (complet) {
      var g1 = groupe();
      menu(g1, "Style", [
        { valeur: "", libelle: "Paragraphe" },
        { valeur: "h2", libelle: "Intertitre" },
        { valeur: "h3", libelle: "Sous-titre" },
        { valeur: "h4", libelle: "Petit titre" },
        { valeur: "blockquote", libelle: "Citation" }
      ], function (v) {
        commande("formatBlock", v ? "<" + v + ">" : "<p>");
      });
    }

    /* --- Police, taille --- */
    var g2 = groupe();
    if (POLICES.length && complet) {
      menu(g2, "Police", [{ valeur: "", libelle: "Police…" }].concat(
        POLICES.map(function (p) { return { valeur: p.valeur, libelle: p.libelle }; })
      ), function (v) {
        if (v) commande("fontName", REPERES_POLICE[v] || v);
      });
    }
    if (TAILLES.length) {
      menu(g2, "Taille", [{ valeur: "", libelle: "Taille…" }].concat(
        TAILLES.map(function (t) { return { valeur: t.valeur, libelle: t.libelle }; })
      ), function (v) {
        if (v) commande("fontSize", indexDeTaille(v));
      });
    }

    /* --- Couleur : pastilles de la charte --- */
    if (COULEURS.length) {
      var lotCouleur = creer("div", "editeur__champ editeur__champ--couleurs");
      lotCouleur.appendChild(creer("span", "editeur__etiquette", "Couleur"));
      var pastilles = creer("div", "editeur__pastilles");
      COULEURS.forEach(function (c) {
        var p = creer("button", "editeur__pastille");
        p.type = "button";
        p.title = c.libelle;
        p.setAttribute("aria-label", "Couleur : " + c.libelle);
        p.style.backgroundColor = REPERES[c.valeur] || c.valeur;
        p.addEventListener("mousedown", function (e) { e.preventDefault(); });
        p.addEventListener("click", function (e) {
          e.preventDefault();
          commande("foreColor", REPERES[c.valeur] || c.valeur);
        });
        pastilles.appendChild(p);
      });
      lotCouleur.appendChild(pastilles);
      g2.appendChild(lotCouleur);
    }

    /* --- Enrichissement --- */
    var g3 = groupe();
    bouton(g3, "G", "Gras (Cmd+B)", function () { commande("bold"); }, "editeur__bouton--gras");
    bouton(g3, "I", "Italique (Cmd+I)", function () { commande("italic"); }, "editeur__bouton--italique");
    bouton(g3, "S", "Souligné (Cmd+U)", function () { commande("underline"); }, "editeur__bouton--souligne");
    bouton(g3, "S", "Barré", function () { commande("strikeThrough"); }, "editeur__bouton--barre");

    if (complet) {
      /* --- Listes --- */
      var g4 = groupe();
      bouton(g4, "Puces", "Liste à puces", function () { commande("insertUnorderedList"); });
      bouton(g4, "1. 2. 3.", "Liste numérotée", function () { commande("insertOrderedList"); });

      /* --- Alignement --- */
      var g5 = groupe();
      menu(g5, "Alignement", [
        { valeur: "", libelle: "Alignement…" },
        { valeur: "justifyLeft", libelle: "À gauche" },
        { valeur: "justifyCenter", libelle: "Centré" },
        { valeur: "justifyRight", libelle: "À droite" }
      ], function (v) { if (v) commande(v); });
    }

    /* --- Lien, séparateur, nettoyage --- */
    var g6 = groupe();
    var panneau = construirePanneauLien(zone, source, barre);
    bouton(g6, "Lien", "Insérer ou modifier un lien", function () { panneau.ouvrir(); });
    if (complet) {
      bouton(g6, "Trait", "Insérer un trait de séparation", function () {
        commande("insertHorizontalRule");
      });
    }
    bouton(g6, "Effacer la mise en forme", "Revenir au texte simple", function () {
      commande("removeFormat");
      commande("unlink");
    });
  }

  /** Petit panneau d'insertion de lien, replié par défaut. */
  function construirePanneauLien(zone, source, barre) {
    var panneau = creer("div", "editeur__lien");
    panneau.hidden = true;

    var champ = creer("input", "editeur__lien-champ");
    champ.type = "text";
    champ.placeholder = "https://…  ou  contact.html  ou  mailto:…";
    champ.setAttribute("aria-label", "Adresse du lien");

    var valider = creer("button", "btn btn--primary editeur__lien-btn", "Appliquer");
    valider.type = "button";
    var retirer = creer("button", "btn editeur__lien-btn", "Retirer");
    retirer.type = "button";
    var fermer = creer("button", "btn editeur__lien-btn", "Annuler");
    fermer.type = "button";

    panneau.appendChild(champ);
    panneau.appendChild(valider);
    panneau.appendChild(retirer);
    panneau.appendChild(fermer);
    barre.parentNode.insertBefore(panneau, barre.nextSibling);

    var selection = null;

    function restaurer() {
      if (!selection) return;
      var sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(selection);
    }

    function refermer() {
      panneau.hidden = true;
      champ.value = "";
      zone.focus();
    }

    valider.addEventListener("click", function () {
      var url = champ.value.trim();
      if (!url) return refermer();
      if (/^\s*(javascript|data|vbscript)\s*:/i.test(url)) {
        champ.value = "";
        champ.placeholder = "Adresse refusée pour des raisons de sécurité.";
        return;
      }
      // Une adresse saisie sans protocole ni extension est complétée.
      if (!/^([a-z][a-z0-9+.-]*:|[#/]|[\w-]+\.html)/i.test(url)) url = "https://" + url;
      restaurer();
      document.execCommand("createLink", false, url);
      normaliser(zone);
      synchroniser(zone, source);
      refermer();
    });

    retirer.addEventListener("click", function () {
      restaurer();
      document.execCommand("unlink");
      synchroniser(zone, source);
      refermer();
    });

    fermer.addEventListener("click", refermer);
    champ.addEventListener("keydown", function (e) {
      if (e.key === "Enter") { e.preventDefault(); valider.click(); }
      if (e.key === "Escape") { e.preventDefault(); refermer(); }
    });

    return {
      ouvrir: function () {
        var sel = window.getSelection();
        selection = sel.rangeCount ? sel.getRangeAt(0).cloneRange() : null;
        var ancre = selection && selection.startContainer;
        while (ancre && ancre !== zone && ancre.nodeName !== "A") ancre = ancre.parentNode;
        champ.value = ancre && ancre.nodeName === "A" ? ancre.getAttribute("href") || "" : "";
        panneau.hidden = false;
        champ.focus();
        champ.select();
      }
    };
  }

  /* ------------------------------------------------------------------ */
  /* Synchronisation avec le champ soumis                                */
  /* ------------------------------------------------------------------ */

  function synchroniser(zone, source) {
    var texte = zone.textContent.trim();
    var aDuContenu = texte !== "" || zone.querySelector("hr") !== null;
    // Un éditeur vidé ne doit pas enregistrer <p><br></p> : sans quoi le
    // contenu de secours du site serait remplacé par du blanc.
    source.value = aDuContenu ? zone.innerHTML.trim() : "";
    zone.dataset.rempli = texte ? "1" : "";
  }

  function brancher(zone, source) {
    zone.addEventListener("input", function () { synchroniser(zone, source); });
    zone.addEventListener("blur", function () {
      normaliser(zone);
      synchroniser(zone, source);
    });

    zone.addEventListener("paste", function (e) {
      var presse = e.clipboardData;
      if (!presse) return;
      e.preventDefault();
      var html = presse.getData("text/html");
      var contenu;
      if (html) {
        contenu = nettoyerColle(html);
      } else {
        var brut = document.createElement("div");
        brut.textContent = presse.getData("text/plain");
        contenu = brut.innerHTML.replace(/\n/g, "<br>");
      }
      document.execCommand("insertHTML", false, contenu);
      normaliser(zone);
      synchroniser(zone, source);
    });

    // Le glisser-déposer contourne l'événement `paste` : on le refuse.
    zone.addEventListener("drop", function (e) { e.preventDefault(); });

    var formulaire = source.form;
    if (formulaire) {
      formulaire.addEventListener("submit", function () {
        normaliser(zone);
        synchroniser(zone, source);
      });
    }

    synchroniser(zone, source);
  }

  /* ------------------------------------------------------------------ */

  function demarrer() {
    document.querySelectorAll("textarea[data-editeur]").forEach(construire);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", demarrer);
  } else {
    demarrer();
  }

  // Exposé pour les formulaires ajoutés dynamiquement (fiche projet, etc.).
  window.rcEditeur = { demarrer: demarrer };
})();
