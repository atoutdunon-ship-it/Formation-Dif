/*
 * ROTARY CLUB DU FRANÇOIS — Boutique du club.
 *
 * Catalogue chargé depuis l'API publique, panier tenu dans le navigateur,
 * puis dépôt de la commande sur le serveur.
 *
 * SÉCURITÉ — ce script ne manipule aucune donnée bancaire. Le panier ne
 * contient que des identifiants d'article et des quantités ; les prix et la
 * disponibilité sont systématiquement recalculés côté serveur au moment de
 * la commande. Le règlement s'effectue ensuite sur la page sécurisée du
 * prestataire, hors de ce site.
 */
(function () {
  "use strict";

  // Adresse du serveur : voir assets/js/config.js.
  var RC = window.RC || { api: function () { return Promise.resolve(null); },
                          baseApi: function () { return null; } };
  var CLE_PANIER = "rcf_panier";

  var contenu = document.getElementById("boutique-contenu");
  var zoneFiltres = document.getElementById("boutique-filtres");
  var panierLignes = document.getElementById("panier-lignes");
  var panierTotal = document.getElementById("panier-total");
  var boutonValider = document.getElementById("panier-valider");
  var modale = document.getElementById("modale-commande");
  var formulaire = document.getElementById("form-commande");
  var recap = document.getElementById("recap-commande");
  var zoneErreur = document.getElementById("commande-erreur");
  var confirmation = document.getElementById("commande-confirmation");

  if (!contenu) return;

  var catalogue = [];   // familles renvoyées par l'API
  var index = {};       // id -> produit, pour retrouver un article du panier
  var panier = charger();
  var familleActive = "";

  /* ------------------------------------------------------------------ */
  /* Traduction : reprend le dictionnaire du site s'il est chargé.        */
  /* ------------------------------------------------------------------ */
  function t(cle, defaut) {
    if (window.rcLangue && typeof window.rcLangue.traduire === "function") {
      var valeur = window.rcLangue.traduire(cle);
      if (valeur) return valeur;
    }
    return defaut;
  }

  function euros(montant) {
    return montant.toFixed(2).replace(".", ",") + " €";
  }

  function echapper(texte) {
    var d = document.createElement("div");
    d.textContent = texte == null ? "" : String(texte);
    return d.innerHTML;
  }

  function dateLisible(iso) {
    if (!iso) return "";
    // Découpage manuel : `new Date("2026-09-01")` serait interprété en UTC
    // et afficherait la veille en Martinique (UTC−4).
    var p = iso.split("-");
    var d = new Date(Number(p[0]), Number(p[1]) - 1, Number(p[2]));
    return d.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
  }

  /* ------------------------------------------------------------------ */
  /* Panier — mémorisé dans le navigateur du visiteur.                    */
  /* ------------------------------------------------------------------ */
  function charger() {
    try {
      var brut = window.localStorage.getItem(CLE_PANIER);
      var lu = brut ? JSON.parse(brut) : [];
      return Array.isArray(lu) ? lu : [];
    } catch (e) {
      return [];
    }
  }

  function enregistrer() {
    try {
      window.localStorage.setItem(CLE_PANIER, JSON.stringify(panier));
    } catch (e) {
      /* Navigation privée ou stockage plein : le panier reste en mémoire. */
    }
  }

  function cle(produitId, variante) {
    return produitId + "|" + (variante || "");
  }

  function ajouter(produitId, variante, quantite) {
    var produit = index[produitId];
    if (!produit) return;

    var existante = panier.filter(function (l) {
      return cle(l.produit_id, l.variante) === cle(produitId, variante);
    })[0];

    var maximum = produit.stock_restant === null
      ? produit.quantite_max
      : Math.min(produit.quantite_max, produit.stock_restant);

    if (existante) {
      existante.quantite = Math.min(existante.quantite + quantite, maximum);
    } else {
      panier.push({
        produit_id: produitId,
        variante: variante || null,
        quantite: Math.min(quantite, maximum)
      });
    }
    enregistrer();
    afficherPanier();
  }

  function retirer(k) {
    panier = panier.filter(function (l) { return cle(l.produit_id, l.variante) !== k; });
    enregistrer();
    afficherPanier();
  }

  function changerQuantite(k, quantite) {
    panier.forEach(function (l) {
      if (cle(l.produit_id, l.variante) !== k) return;
      var produit = index[l.produit_id];
      var maximum = !produit ? quantite
        : (produit.stock_restant === null
            ? produit.quantite_max
            : Math.min(produit.quantite_max, produit.stock_restant));
      l.quantite = Math.max(1, Math.min(quantite, maximum));
    });
    enregistrer();
    afficherPanier();
  }

  function totalPanier() {
    return panier.reduce(function (somme, l) {
      var produit = index[l.produit_id];
      return somme + (produit ? produit.prix * l.quantite : 0);
    }, 0);
  }

  function afficherPanier() {
    // Un article retiré du catalogue entre-temps ne doit pas rester au panier.
    panier = panier.filter(function (l) { return index[l.produit_id]; });

    if (!panier.length) {
      panierLignes.innerHTML =
        '<p class="panier__vide">' + t("boutique.panier_vide", "Votre panier est vide.") + "</p>";
      panierTotal.textContent = euros(0);
      boutonValider.disabled = true;
      return;
    }

    panierLignes.innerHTML = panier
      .map(function (l) {
        var produit = index[l.produit_id];
        var k = cle(l.produit_id, l.variante);
        return (
          '<div class="panier__ligne">' +
            '<div class="panier__ligne-titre">' +
              "<strong>" + echapper(produit.nom) + "</strong>" +
              (l.variante ? '<span class="panier__variante">' + echapper(l.variante) + "</span>" : "") +
            "</div>" +
            '<div class="panier__ligne-controle">' +
              '<input type="number" min="1" value="' + l.quantite + '" data-cle="' + echapper(k) + '" aria-label="Quantité">' +
              "<span>" + euros(produit.prix * l.quantite) + "</span>" +
              '<button type="button" class="panier__retirer" data-retirer="' + echapper(k) + '" aria-label="Retirer">&times;</button>' +
            "</div>" +
          "</div>"
        );
      })
      .join("");

    panierTotal.textContent = euros(totalPanier());
    boutonValider.disabled = false;
  }

  /* ------------------------------------------------------------------ */
  /* Catalogue                                                           */
  /* ------------------------------------------------------------------ */
  function carteProduit(p) {
    var indisponible = !p.disponible;
    var motif = p.ventes_closes
      ? t("boutique.ventes_closes", "Ventes closes")
      : p.epuise
        ? t("boutique.epuise", "Épuisé")
        : "";

    var details = [];
    if (p.date_evenement) details.push(dateLisible(p.date_evenement));
    if (p.lieu) details.push(echapper(p.lieu));
    if (p.action) details.push(t("boutique.au_profit", "Au profit de") + " " + echapper(p.action));

    var stock = "";
    if (p.stock_restant !== null && p.stock_restant > 0 && p.stock_restant <= 20) {
      stock = '<span class="produit__stock">' + p.stock_restant + " " +
        t("boutique.restants", "restant(s)") + "</span>";
    }

    var variantes = "";
    if (p.variantes.length) {
      variantes =
        '<select class="produit__variante" aria-label="' + t("boutique.choix", "Choix") + '">' +
        p.variantes.map(function (v) {
          return '<option value="' + echapper(v) + '">' + echapper(v) + "</option>";
        }).join("") +
        "</select>";
    }

    return (
      '<article class="produit' + (indisponible ? " produit--indisponible" : "") + '" data-produit="' + p.id + '">' +
        (p.image_url
          ? '<img class="produit__photo" src="' + echapper(p.image_url) + '" alt="" loading="lazy">'
          : '<div class="produit__photo produit__photo--vide" aria-hidden="true"></div>') +
        '<div class="produit__corps">' +
          (p.reserve_aux_membres
            ? '<span class="produit__badge">' + t("boutique.membres", "Réservé aux membres") + "</span>"
            : "") +
          "<h3>" + echapper(p.nom) + "</h3>" +
          (details.length ? '<p class="produit__details">' + details.join(" — ") + "</p>" : "") +
          (p.description ? '<div class="produit__desc texte-riche">' + p.description + "</div>" : "") +
          '<div class="produit__pied">' +
            '<span class="produit__prix">' + euros(p.prix) + "</span>" +
            stock +
          "</div>" +
          (indisponible
            ? '<p class="produit__indispo">' + motif + "</p>"
            : '<div class="produit__achat">' + variantes +
                '<button type="button" class="btn btn--gold produit__ajouter">' +
                  t("boutique.ajouter", "Ajouter au panier") +
                "</button></div>") +
        "</div>" +
      "</article>"
    );
  }

  function afficherCatalogue() {
    var familles = familleActive
      ? catalogue.filter(function (f) { return f.type === familleActive; })
      : catalogue;

    if (!familles.length) {
      contenu.innerHTML =
        '<p class="boutique-attente">' +
        t("boutique.vide", "Aucun article n'est proposé à la vente pour le moment.") +
        "</p>";
      return;
    }

    contenu.innerHTML = familles
      .map(function (f) {
        return (
          '<section class="boutique-famille">' +
            "<h2>" + echapper(f.libelle) + "</h2>" +
            '<div class="produit-grille">' + f.produits.map(carteProduit).join("") + "</div>" +
          "</section>"
        );
      })
      .join("");
  }

  function afficherFiltres() {
    if (catalogue.length < 2) return;
    zoneFiltres.hidden = false;
    zoneFiltres.innerHTML =
      '<button type="button" class="boutique-filtre is-active" data-famille="">' +
        t("boutique.tout", "Tout") +
      "</button>" +
      catalogue.map(function (f) {
        return '<button type="button" class="boutique-filtre" data-famille="' + echapper(f.type) + '">' +
          echapper(f.libelle) + "</button>";
      }).join("");
  }

  /* ------------------------------------------------------------------ */
  /* Commande                                                            */
  /* ------------------------------------------------------------------ */
  function ouvrirModale() {
    recap.innerHTML =
      "<h3>" + t("boutique.recap", "Récapitulatif") + "</h3>" +
      '<ul class="recap__liste">' +
      panier.map(function (l) {
        var p = index[l.produit_id];
        return "<li><span>" + echapper(p.nom) +
          (l.variante ? " — " + echapper(l.variante) : "") +
          " × " + l.quantite + "</span><strong>" + euros(p.prix * l.quantite) + "</strong></li>";
      }).join("") +
      "</ul>" +
      '<p class="recap__total"><span>' + t("boutique.total", "Total") +
      "</span><strong>" + euros(totalPanier()) + "</strong></p>";

    zoneErreur.hidden = true;
    confirmation.hidden = true;
    formulaire.hidden = false;
    modale.hidden = false;
    document.body.style.overflow = "hidden";
    var premier = formulaire.querySelector("input");
    if (premier) premier.focus();
  }

  function fermerModale() {
    modale.hidden = true;
    document.body.style.overflow = "";
  }

  function blocPaiement(paiement, moyenChoisi) {
    if (!paiement) return "";
    var morceaux = [];

    if (moyenChoisi !== "virement" && paiement.liens && paiement.liens.length) {
      morceaux.push(
        "<h4>" + t("boutique.payer_ligne", "Régler en ligne") + "</h4>" +
        '<p class="confirmation__note">' +
          t("boutique.note_prestataire",
            "Le paiement s'effectue sur la page sécurisée de notre prestataire. Indiquez votre numéro de commande en référence.") +
        "</p>" +
        paiement.liens.map(function (l) {
          return '<a class="btn btn--primary" href="' + echapper(l.url) +
            '" target="_blank" rel="noopener noreferrer">' + echapper(l.libelle) + "</a>";
        }).join(" ")
      );
    }

    if (paiement.virement) {
      var v = paiement.virement;
      morceaux.push(
        "<h4>" + t("boutique.payer_virement", "Régler par virement") + "</h4>" +
        '<dl class="rib">' +
          (v.titulaire ? "<dt>Titulaire</dt><dd>" + echapper(v.titulaire) + "</dd>" : "") +
          (v.banque ? "<dt>Banque</dt><dd>" + echapper(v.banque) + "</dd>" : "") +
          "<dt>IBAN</dt><dd>" + echapper(v.iban) + "</dd>" +
          (v.bic ? "<dt>BIC</dt><dd>" + echapper(v.bic) + "</dd>" : "") +
        "</dl>"
      );
    }

    if (paiement.sur_place) {
      morceaux.push("<h4>" + t("boutique.payer_place", "Sur place") + "</h4><p>" +
        echapper(paiement.sur_place) + "</p>");
    }

    if (paiement.instructions) {
      morceaux.push('<p class="confirmation__note">' + echapper(paiement.instructions) + "</p>");
    }

    return morceaux.join("");
  }

  function envoyer(evenement) {
    evenement.preventDefault();
    var donnees = new FormData(formulaire);
    var moyen = donnees.get("moyen_paiement");

    var bouton = formulaire.querySelector('button[type="submit"]');
    bouton.disabled = true;

    RC.api("/api/public/commande", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nom: donnees.get("nom"),
        email: donnees.get("email"),
        telephone: donnees.get("telephone"),
        message: donnees.get("message"),
        moyen_paiement: moyen,
        articles: panier
      })
    })
      .then(function (corps) {
        bouton.disabled = false;
        if (corps === null || !corps.ok) {
          zoneErreur.textContent = (corps && corps.erreur) ||
            "La commande n'a pas pu être enregistrée. Réessayez, ou écrivez-nous à rotaryclubdufrancois@gmail.com.";
          zoneErreur.hidden = false;
          return;
        }

        var c = corps;
        formulaire.hidden = true;
        recap.innerHTML = "";
        confirmation.hidden = false;
        confirmation.innerHTML =
          '<div class="confirmation__entete">' +
            "<h3>" + t("boutique.merci", "Merci !") + "</h3>" +
            "<p>" + echapper(c.message) + "</p>" +
            '<p class="confirmation__ref">' + t("boutique.reference", "Référence") +
              " <strong>" + echapper(c.reference) + "</strong> — " + euros(c.total) + "</p>" +
          "</div>" +
          (c.avertissements && c.avertissements.length
            ? '<p class="confirmation__alerte">' + c.avertissements.map(echapper).join(" ") + "</p>"
            : "") +
          blocPaiement(c.paiement, moyen);

        panier = [];
        enregistrer();
        afficherPanier();
      })
      .catch(function () {
        bouton.disabled = false;
        zoneErreur.textContent = "Connexion au serveur impossible. Réessayez dans un instant.";
        zoneErreur.hidden = false;
      });
  }

  /* ------------------------------------------------------------------ */
  /* Écouteurs                                                           */
  /* ------------------------------------------------------------------ */
  contenu.addEventListener("click", function (evenement) {
    var bouton = evenement.target.closest(".produit__ajouter");
    if (!bouton) return;
    var carte = bouton.closest("[data-produit]");
    var choix = carte.querySelector(".produit__variante");
    ajouter(Number(carte.dataset.produit), choix ? choix.value : null, 1);

    bouton.textContent = t("boutique.ajoute", "Ajouté ✓");
    setTimeout(function () {
      bouton.textContent = t("boutique.ajouter", "Ajouter au panier");
    }, 1200);
  });

  zoneFiltres.addEventListener("click", function (evenement) {
    var bouton = evenement.target.closest(".boutique-filtre");
    if (!bouton) return;
    familleActive = bouton.dataset.famille;
    zoneFiltres.querySelectorAll(".boutique-filtre").forEach(function (b) {
      b.classList.toggle("is-active", b === bouton);
    });
    afficherCatalogue();
  });

  panierLignes.addEventListener("click", function (evenement) {
    var bouton = evenement.target.closest("[data-retirer]");
    if (bouton) retirer(bouton.dataset.retirer);
  });

  panierLignes.addEventListener("change", function (evenement) {
    var champ = evenement.target.closest("input[data-cle]");
    if (champ) changerQuantite(champ.dataset.cle, Number(champ.value));
  });

  boutonValider.addEventListener("click", ouvrirModale);
  formulaire.addEventListener("submit", envoyer);

  // Le catalogue et le panier sont injectés par ce script : ils doivent être
  // reconstruits lorsque le visiteur change de langue.
  document.addEventListener("langue-changee", function () {
    afficherFiltres();
    afficherCatalogue();
    afficherPanier();
  });

  modale.addEventListener("click", function (evenement) {
    if (evenement.target.closest("[data-fermer-modale]")) fermerModale();
  });
  document.addEventListener("keydown", function (evenement) {
    if (evenement.key === "Escape" && !modale.hidden) fermerModale();
  });

  /* ------------------------------------------------------------------ */
  /* Démarrage                                                           */
  /* ------------------------------------------------------------------ */
  RC.api("/api/public/boutique")
    .then(function (donnees) {
      // null : aucun serveur joignable — la boutique exige l'application du
      // club. On l'annonce clairement plutôt que de laisser la page en
      // « Chargement… » indéfiniment.
      if (donnees === null) {
        contenu.innerHTML =
          '<p class="boutique-attente">' +
          t("boutique.hors_ligne",
            "La boutique en ligne n'est pas encore ouverte à cette adresse. " +
            "Pour commander, contactez le Trésorier du club à rotaryclubdufrancois@gmail.com.") +
          "</p>";
        var panneau = document.getElementById("panier");
        if (panneau) panneau.hidden = true;
        return;
      }
      catalogue = donnees.familles || [];
      catalogue.forEach(function (f) {
        f.produits.forEach(function (p) { index[p.id] = p; });
      });
      afficherFiltres();
      afficherCatalogue();
      afficherPanier();
    })
    .catch(function () {
      contenu.innerHTML =
        '<p class="boutique-attente">La boutique est momentanément indisponible. ' +
        "Réessayez dans quelques instants.</p>";
    });
})();
