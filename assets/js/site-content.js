/**
 * Rotary Club du François — Contenu dynamique piloté par ASSO-CORE.
 *
 * Récupère le contenu géré depuis le panneau d'Administration (textes,
 * photos, liens, actualités, agenda) via l'API publique en lecture seule,
 * et remplace le contenu statique de secours déjà présent dans le HTML.
 * Le site reste pleinement fonctionnel si l'espace membre est injoignable
 * (contenu de secours conservé, aucune erreur visible pour le visiteur).
 *
 * CONFIGURATION : chaîne vide = même origine. Le site et l'espace membre
 * sont servis par le même serveur, sur la même adresse : les appels sont
 * donc relatifs, sans requête inter-origines.
 *
 * Si un jour vous hébergez l'espace membre sur un autre domaine, indiquez
 * ici son adresse complète (ex : "https://membres.rotaryclubdufrancois.org").
 */
(function () {
  "use strict";

  // Adresse du serveur : voir assets/js/config.js. RC.api() renvoie null
  // quand aucun serveur n'est joignable (vitrine hébergée seule) : le
  // contenu écrit en dur dans la page reste alors affiché.
  const RC = window.RC || { api: () => Promise.resolve(null), baseApi: () => null };

  function formatDate(iso) {
    const d = new Date(iso);
    return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" });
  }

  /* Conteneurs pouvant recevoir des paragraphes, des titres ou des listes.
     Tous les autres — <p>, <span>, <li>, <figcaption>, <td>… — reçoivent la
     version aplatie. */
  const ACCEPTE_DES_BLOCS = new Set([
    "DIV", "SECTION", "ARTICLE", "ASIDE", "MAIN", "BLOCKQUOTE", "FIGURE", "LI", "TD"
  ]);

  /* Équivalent de `pour_affichage_ligne()` côté serveur : conserve
     l'enrichissement du texte, remplace les ruptures de bloc par des
     retours à la ligne. */
  function enLigne(html) {
    return (html || "")
      .replace(/<\/?(p|div|h[1-6]|ul|ol|li|blockquote|hr)\b[^>]*>/gi, "<br>")
      .replace(/(?:<br>\s*){2,}/gi, "<br>")
      .replace(/^\s*<br>|<br>\s*$/gi, "")
      .trim();
  }

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  /* ---------- Actualités & agenda (listes) ---------- */

  function renderActualites(articles) {
    const container = document.querySelector("[data-dynamic='actualites']");
    if (!container || !articles.length) return;
    container.innerHTML = articles
      .map(
        (a) => `
        <div class="card">
          ${a.image_url ? `<img src="${escapeHtml(a.image_url)}" alt="" class="card__photo">` : ""}
          <div class="card__meta">${escapeHtml(formatDate(a.date_publication))}</div>
          <h3>${escapeHtml(a.titre)}</h3>
          <div class="texte-riche">${a.chapo || ""}</div>
        </div>`
      )
      .join("");
  }

  function renderActions(actions) {
    const container = document.querySelector("[data-dynamic='actions']");
    if (!container || !actions.length) return;
    const labels = { planifiee: "Planifiée", en_cours: "En cours", terminee: "Terminée" };
    container.innerHTML = actions
      .map(
        (a) => `
        <div class="card">
          ${a.image_url ? `<img src="${escapeHtml(a.image_url)}" alt="" class="card__photo">` : ""}
          <div class="card__meta">${escapeHtml(a.categorie || "")}${a.categorie ? " — " : ""}${escapeHtml(labels[a.statut] || "")}</div>
          <h3>${escapeHtml(a.titre)}</h3>
          <div class="texte-riche">${a.description || ""}</div>
          ${a.dons_ouverts
            ? `<button type="button" class="btn btn--gold btn--soutenir" data-action-id="${a.id}" data-action-titre="${escapeHtml(a.titre)}">Soutenir cette action</button>`
            : ""}
        </div>`
      )
      .join("");
    brancherBoutonsDon();
    if (window.rcLangue) window.rcLangue.rafraichir();
  }

  /* ---------- Espace « Soutenir cette action » ----------
     Ouvre un formulaire de promesse de don. Aucune coordonnée bancaire
     n'est demandée : le Trésorier du club recontacte le donateur. */

  function brancherBoutonsDon() {
    document.querySelectorAll(".btn--soutenir").forEach((bouton) => {
      if (bouton.dataset.branche) return;
      bouton.dataset.branche = "1";
      bouton.addEventListener("click", () =>
        ouvrirFormulaireDon(bouton.dataset.actionId, bouton.dataset.actionTitre)
      );
    });
  }

  function ouvrirFormulaireDon(actionId, actionTitre) {
    let dialogue = document.getElementById("don-dialogue");
    if (!dialogue) {
      dialogue = document.createElement("div");
      dialogue.id = "don-dialogue";
      dialogue.className = "don-overlay";
      dialogue.innerHTML = `
        <div class="don-modal" role="dialog" aria-modal="true" aria-labelledby="don-titre">
          <button type="button" class="don-fermer" aria-label="Fermer">&times;</button>
          <div class="don-eyebrow" data-i18n="don.modal_eyebrow">Soutenir une action</div>
          <h2 id="don-titre"></h2>
          <p class="don-intro" data-i18n="don.modal_intro">Laissez-nous vos coordonnées et le montant que vous envisagez : le Trésorier du club vous recontactera pour organiser votre don. Aucune coordonnée bancaire ne vous est demandée ici.</p>
          <form id="don-form">
            <input type="hidden" name="action_id">
            <label for="don-nom" data-i18n="don.nom">Nom et prénom *</label>
            <input type="text" id="don-nom" name="nom" required>
            <label for="don-email" data-i18n="don.email">Adresse e-mail *</label>
            <input type="email" id="don-email" name="email" required>
            <label for="don-tel" data-i18n="don.telephone">Téléphone</label>
            <input type="tel" id="don-tel" name="telephone">
            <label for="don-montant" data-i18n="don.montant">Montant envisagé (€)</label>
            <input type="number" id="don-montant" name="montant" min="1" step="1">
            <label for="don-message" data-i18n="don.message">Message (facultatif)</label>
            <textarea id="don-message" name="message" rows="3"></textarea>
            <label class="don-case">
              <input type="checkbox" name="anonyme" value="1">
              <span data-i18n="don.anonyme">Je souhaite que mon don reste anonyme</span>
            </label>
            <p class="don-rgpd" data-i18n="don.rgpd">Vos coordonnées servent uniquement à vous
            recontacter au sujet de ce don. Aucune donnée bancaire ne vous est demandée ici :
            le règlement s'effectue ensuite avec le Trésorier. <a href="confidentialite.html">En savoir plus</a>.</p>
            <button type="submit" class="btn btn--primary don-envoyer" data-i18n="don.envoyer">Envoyer ma promesse de don</button>
          </form>
          <div class="don-retour" role="status"></div>
        </div>`;
      document.body.appendChild(dialogue);

      dialogue.querySelector(".don-fermer").addEventListener("click", fermerFormulaireDon);
      dialogue.addEventListener("click", (e) => {
        if (e.target === dialogue) fermerFormulaireDon();
      });
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") fermerFormulaireDon();
      });
      dialogue.querySelector("#don-form").addEventListener("submit", envoyerPromesseDon);
      if (window.rcLangue) window.rcLangue.rafraichir();
    }

    // Reçu fiscal : la mention n'apparaît que si le club a déclaré en
    // délivrer. Annoncer une réduction d'impôt à laquelle l'association n'a
    // pas droit l'expose à une amende égale au montant indûment mentionné.
    RC.api("/api/public/mentions").then(function (m) {
      if (!m || !m.recu_fiscal_actif) return;
      var zone = dialogue.querySelector(".don-recu");
      if (zone) return;
      var p = document.createElement("p");
      p.className = "don-recu";
      p.textContent =
        "Ce don ouvre droit à un reçu fiscal. Il vous sera adressé après " +
        "encaissement et vous permettra de bénéficier de la réduction d'impôt " +
        "prévue par l'article 200 du Code général des impôts.";
      dialogue.querySelector(".don-intro").insertAdjacentElement("afterend", p);
    });

    dialogue.querySelector("#don-titre").textContent = actionTitre || "Soutenir le club";
    dialogue.querySelector("[name='action_id']").value = actionId || "";
    dialogue.querySelector(".don-retour").textContent = "";
    dialogue.querySelector("#don-form").style.display = "";
    dialogue.classList.add("is-open");
    dialogue.querySelector("#don-nom").focus();
  }

  function fermerFormulaireDon() {
    const dialogue = document.getElementById("don-dialogue");
    if (dialogue) dialogue.classList.remove("is-open");
  }

  /* Moyens de paiement renvoyés par l'espace membre (RIB du club, liens de
     paiement du prestataire), affichés au donateur après enregistrement. */
  function moyensDePaiementHtml(paiement) {
    if (!paiement || !Object.keys(paiement).length) return "";

    // Libellés traduits, avec repli sur le français.
    const t = (cle, defaut) =>
      (window.rcLangue && window.rcLangue.traduire(cle)) || defaut;

    let html =
      '<div class="don-paiement"><h3>' +
      escapeHtml(t("don.paiement_titre", "Comment régler votre don")) +
      "</h3>";

    if (paiement.liens && paiement.liens.length) {
      html += '<div class="don-paiement__liens">';
      paiement.liens.forEach((l) => {
        html +=
          '<a class="btn btn--gold" href="' +
          escapeHtml(l.url) +
          '" target="_blank" rel="noopener noreferrer">' +
          escapeHtml(l.libelle) +
          "</a>";
      });
      html += "</div>";
    }

    if (paiement.virement) {
      const v = paiement.virement;
      html +=
        '<div class="don-paiement__bloc"><strong>' +
        escapeHtml(t("don.virement", "Par virement bancaire")) +
        "</strong><dl>";
      if (v.titulaire)
        html += "<dt>" + escapeHtml(t("don.titulaire", "Titulaire")) + "</dt><dd>" + escapeHtml(v.titulaire) + "</dd>";
      if (v.banque)
        html += "<dt>" + escapeHtml(t("don.banque", "Banque")) + "</dt><dd>" + escapeHtml(v.banque) + "</dd>";
      if (v.iban) html += "<dt>IBAN</dt><dd><code>" + escapeHtml(v.iban) + "</code></dd>";
      if (v.bic) html += "<dt>BIC</dt><dd><code>" + escapeHtml(v.bic) + "</code></dd>";
      html += "</dl></div>";
    }

    if (paiement.sur_place) {
      html +=
        '<div class="don-paiement__bloc"><strong>' +
        escapeHtml(t("don.sur_place", "Sur place")) +
        '</strong><div class="texte-riche">' +
        paiement.sur_place +
        "</div></div>";
    }

    if (paiement.instructions) {
      html +=
        '<div class="don-paiement__bloc texte-riche">' +
        paiement.instructions +
        "</div>";
    }

    return html + "</div>";
  }

  function envoyerPromesseDon(e) {
    e.preventDefault();
    const form = e.target;
    const retour = document.querySelector("#don-dialogue .don-retour");
    const bouton = form.querySelector(".don-envoyer");
    const donnees = Object.fromEntries(new FormData(form).entries());

    bouton.disabled = true;
    bouton.textContent = (window.rcLangue && window.rcLangue.traduire("don.envoi_en_cours")) || "Envoi en cours…";

    RC.api("/api/public/dons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(donnees),
    })
      .then((reponse) => {
        if (reponse === null) throw new Error("hors ligne");
        if (reponse.ok) {
          form.style.display = "none";
          retour.className = "don-retour don-retour--succes";
          retour.innerHTML =
            "<p>" + escapeHtml(reponse.message) + "</p>" + moyensDePaiementHtml(reponse.paiement);
          form.reset();
        } else {
          retour.className = "don-retour don-retour--erreur";
          retour.textContent = reponse.erreur || "Une erreur est survenue.";
        }
      })
      .catch(() => {
        retour.className = "don-retour don-retour--erreur";
        retour.textContent =
          (window.rcLangue && window.rcLangue.traduire("don.erreur_reseau")) ||
          "Envoi impossible pour le moment. Vous pouvez nous écrire à rotaryclubdufrancois@gmail.com.";
      })
      .finally(() => {
        bouton.disabled = false;
        bouton.textContent = (window.rcLangue && window.rcLangue.traduire("don.envoyer")) || "Envoyer ma promesse de don";
      });
  }

  function renderAgenda(evenements) {
    const tbody = document.querySelector("[data-dynamic='agenda'] tbody");
    if (!tbody || !evenements.length) return;
    tbody.innerHTML = evenements
      .map(
        (e) => `
        <tr>
          <td>${escapeHtml(formatDate(e.date_debut))}</td>
          <td>${escapeHtml(e.titre)}</td>
          <td>${escapeHtml(e.lieu || "—")}</td>
        </tr>`
      )
      .join("");
  }

  RC.api("/api/public/actualites").then((d) => {
    if (d) renderActualites(d);   // sinon : le contenu statique de la page est conservé
  });

  RC.api("/api/public/agenda").then((d) => {
    if (d) renderAgenda(d);   // sinon : le contenu statique de la page est conservé
  });

  RC.api("/api/public/actions").then((d) => {
    if (d) renderActions(d);   // sinon : le contenu statique de la page est conservé
  });

  /* ---------- Blocs de contenu génériques (textes / photos / liens) ----------
     Convention : data-block="<block_key>:<champ>" sur l'élément à mettre à
     jour. Champs possibles : eyebrow, title, body, image, link1, link2.

     Le champ "body" est mis en forme depuis l'administration (gras, couleur,
     listes, liens…). Il arrive donc en HTML, déjà passé par la liste blanche
     du serveur. Les paragraphes sont conservés dans un conteneur qui les
     accepte, et aplatis en retours à la ligne ailleurs. L'ancien attribut
     data-multiline n'a plus d'effet : le comportement est désormais déduit
     de la balise visée. */

  function applyBlocks(blocks) {
    blocks.forEach((b) => {
      if (b.eyebrow) {
        document
          .querySelectorAll(`[data-block="${b.block_key}:eyebrow"]`)
          .forEach((el) => (el.textContent = b.eyebrow));
      }
      if (b.title) {
        document
          .querySelectorAll(`[data-block="${b.block_key}:title"]`)
          .forEach((el) => (el.textContent = b.title));
      }
      if (b.body) {
        document.querySelectorAll(`[data-block="${b.block_key}:body"]`).forEach((el) => {
          // Le corps arrive en HTML, filtré par la liste blanche du serveur
          // (voir sanitize_html.py) : il est injectable tel quel.
          //
          // Reste la validité du HTML : la plupart des emplacements du site
          // sont des <p>, et un <p> ne peut pas en contenir un autre — le
          // navigateur « réparerait » en éclatant le paragraphe, cassant la
          // mise en page. On aplatit donc les blocs partout sauf dans les
          // conteneurs qui les acceptent.
          el.innerHTML = ACCEPTE_DES_BLOCS.has(el.tagName) ? b.body : enLigne(b.body);
          el.classList.add("texte-riche");
        });
      }
      if (b.image_url) {
        document.querySelectorAll(`[data-block="${b.block_key}:image"]`).forEach((el) => {
          el.src = b.image_url;
          el.style.display = "";
        });
      }
      if (b.link_url) {
        document.querySelectorAll(`[data-block="${b.block_key}:link1"]`).forEach((el) => {
          el.href = b.link_url;
          if (b.link_label) el.textContent = b.link_label;
        });
      }
      if (b.link2_url) {
        document.querySelectorAll(`[data-block="${b.block_key}:link2"]`).forEach((el) => {
          el.href = b.link2_url;
          if (b.link2_label) el.textContent = b.link2_label;
        });
      }
    });
  }

  // Boutons de don déjà présents dans le HTML statique (repli si l'API
  // est injoignable, ou bouton « soutenir le club » hors action précise).
  brancherBoutonsDon();

  const page = document.body.getAttribute("data-page");
  if (page) {
    RC.api("/api/public/contenu?page=" + encodeURIComponent(page)).then((d) => {
      if (d) applyBlocks(d);
    });
  }
})();
