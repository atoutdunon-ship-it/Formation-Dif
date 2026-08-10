/**
 * Rotary Club du François — Galerie photo par année rotarienne.
 *
 * La liste des exercices (1983-1984 à l'exercice en cours) est calculée
 * directement en JavaScript, donc toujours disponible même sans backend.
 * Les photos de chaque exercice, elles, sont gérées depuis le panneau
 * d'administration et récupérées via l'API publique d'ASSO-CORE.
 *
 * CONFIGURATION : chaîne vide = même origine (identique à
 * assets/js/site-content.js). Le site et l'espace membre sont servis par
 * le même serveur : les appels sont relatifs.
 */
(function () {
  "use strict";

  // Adresse du serveur : voir assets/js/config.js.
  const RC = window.RC || { api: () => Promise.resolve(null) };
  const FIRST_ROTARIAN_YEAR = 1983;

  function currentRotarianYearStart(d) {
    d = d || new Date();
    return d.getMonth() >= 6 ? d.getFullYear() : d.getFullYear() - 1; // juillet = mois 6 (0-indexé)
  }

  function buildYearList() {
    const current = currentRotarianYearStart();
    const years = [];
    for (let y = current; y >= FIRST_ROTARIAN_YEAR; y--) years.push(`${y}-${y + 1}`);
    return years;
  }

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  const grid = document.getElementById("gallery-grid");
  const empty = document.getElementById("gallery-empty");
  if (!grid) return;

  function showMessage(text) {
    grid.innerHTML = "";
    empty.textContent = text;
    empty.style.display = "block";
  }

  function formaterDate(iso) {
    if (!iso) return "";
    // « 2026-06-15 » est une date civile, sans heure. `new Date(iso)`
    // l'interpréterait comme minuit UTC : en Martinique (UTC-4) la veille
    // s'afficherait. On construit donc la date dans le fuseau local.
    const [annee, mois, jour] = iso.split("-").map(Number);
    const d = new Date(annee, mois - 1, jour);
    return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" });
  }

  /* Regroupement en albums.

     Règle : la date prime. Deux prises de vue du même jour appartiennent au
     même album, même si le club leur a donné des noms d'événement
     différents — c'est ce que voit l'œil du visiteur, une journée du club.
     Les noms d'événement deviennent alors le sous-titre de l'album.

     Un élément sans date est regroupé par événement : c'est le seul repère
     dont on dispose, et les fondre tous ensemble mêlerait des occasions
     sans rapport.

     Le regroupement passe par une table plutôt qu'en comparant l'élément
     précédent : le tri place les éléments sans date en fin de liste, où
     rien ne garantit que deux éléments d'un même événement se suivent. */
  function regrouper(elements, champ) {
    const parCle = new Map();

    elements.forEach((e, index) => {
      e._index = index;
      const cle = e.date_prise ? "d:" + e.date_prise : "e:" + (e.evenement || "");
      let album = parCle.get(cle);
      if (!album) {
        album = { cle: cle, date: e.date_prise, evenements: [], elements: [] };
        parCle.set(cle, album);
      }
      if (e.evenement && album.evenements.indexOf(e.evenement) === -1) {
        album.evenements.push(e.evenement);
      }
      album.elements.push(e);
    });

    const albums = Array.from(parCle.values());
    albums.forEach((a) => {
      // Ordre alphabétique : l'ordre d'apparition suivrait le tri des
      // éléments, et le titre d'un même album changerait au gré des dépôts.
      a.evenements.sort((x, y) => x.localeCompare(y, "fr"));
      a[champ] = a.elements;
    });
    return albums;
  }

  /* Titre de l'album : les événements de la journée, ou le repli. */
  function titreAlbum(album) {
    if (album.evenements.length) return album.evenements.join(" · ");
    return (window.rcLangue && window.rcLangue.traduire("galerie.photos_club"))
      || "Photos du club";
  }

  /* Les photos arrivent déjà triées par date décroissante : on les
     regroupe en albums (événement + date), chacun présenté sous forme de
     carrousel horizontal — une rangée que l'on fait défiler. */
  let toutesLesPhotos = [];

  function rendreAlbums(photos) {
    toutesLesPhotos = photos;

    const albums = regrouper(photos, "photos");

    grid.innerHTML = albums
      .map((album) => {
        const titre = titreAlbum(album);
        const dateLisible = formaterDate(album.date);
        const vignettes = album.photos
          .map(
            (p) => `
            <figure class="galerie-photo" tabindex="0" role="button"
                    data-index="${p._index}"
                    aria-label="${escapeHtml(p.titre || titre)}">
              <img src="${p.image_url}" alt="${escapeHtml(p.titre || titre)}" loading="lazy">
              ${p.titre ? `<figcaption>${escapeHtml(p.titre)}</figcaption>` : ""}
              ${p.info ? `<figcaption class="galerie-photo__info texte-riche">${p.info}</figcaption>` : ""}
            </figure>`
          )
          .join("");
        return `
          <section class="galerie-album">
            <div class="galerie-album__entete">
              <h3>${escapeHtml(titre)}</h3>
              <span>${dateLisible ? escapeHtml(dateLisible) + " — " : ""}${album.photos.length} photo${album.photos.length > 1 ? "s" : ""}</span>
            </div>
            <div class="carrousel">
              <button type="button" class="carrousel__fleche carrousel__fleche--gauche"
                      aria-label="Photos précédentes">&#8249;</button>
              <div class="carrousel__piste">${vignettes}</div>
              <button type="button" class="carrousel__fleche carrousel__fleche--droite"
                      aria-label="Photos suivantes">&#8250;</button>
            </div>
          </section>`;
      })
      .join("");

    activerCarrousels();
    activerVisionneuse();
  }

  /* ---------- Défilement horizontal des rangées ---------- */

  function activerCarrousels(conteneur) {
    (conteneur || grid).querySelectorAll(".carrousel").forEach((carrousel) => {
      const piste = carrousel.querySelector(".carrousel__piste");
      const gauche = carrousel.querySelector(".carrousel__fleche--gauche");
      const droite = carrousel.querySelector(".carrousel__fleche--droite");

      // Une « page » = la largeur visible, moins un chevauchement qui
      // laisse apparaître la vignette suivante (repère visuel).
      const pas = () => Math.max(piste.clientWidth - 80, 200);

      function majFleches() {
        const debut = piste.scrollLeft <= 4;
        const fin = piste.scrollLeft + piste.clientWidth >= piste.scrollWidth - 4;
        gauche.classList.toggle("est-masquee", debut);
        droite.classList.toggle("est-masquee", fin);
        // Rangée trop courte pour défiler : aucune flèche.
        const defilable = piste.scrollWidth > piste.clientWidth + 4;
        carrousel.classList.toggle("sans-defilement", !defilable);
      }

      gauche.addEventListener("click", () =>
        piste.scrollBy({ left: -pas(), behavior: "smooth" })
      );
      droite.addEventListener("click", () =>
        piste.scrollBy({ left: pas(), behavior: "smooth" })
      );
      piste.addEventListener("scroll", majFleches, { passive: true });
      window.addEventListener("resize", majFleches);

      // Les images arrivent après coup : on recalcule à leur chargement.
      piste.querySelectorAll("img").forEach((img) => {
        if (img.complete) return;
        img.addEventListener("load", majFleches, { once: true });
      });

      majFleches();
    });
  }

  /* ---------- Visionneuse plein écran ---------- */

  let indexCourant = 0;

  function construireVisionneuse() {
    let vue = document.getElementById("galerie-visionneuse");
    if (vue) return vue;

    vue = document.createElement("div");
    vue.id = "galerie-visionneuse";
    vue.className = "visionneuse";
    vue.innerHTML = `
      <button type="button" class="visionneuse__fermer" aria-label="Fermer">&times;</button>
      <button type="button" class="visionneuse__nav visionneuse__nav--gauche" aria-label="Photo précédente">&#8249;</button>
      <figure class="visionneuse__contenu">
        <img alt="">
        <figcaption></figcaption>
      </figure>
      <button type="button" class="visionneuse__nav visionneuse__nav--droite" aria-label="Photo suivante">&#8250;</button>`;
    document.body.appendChild(vue);

    vue.querySelector(".visionneuse__fermer").addEventListener("click", fermerVisionneuse);
    vue.querySelector(".visionneuse__nav--gauche").addEventListener("click", () => deplacer(-1));
    vue.querySelector(".visionneuse__nav--droite").addEventListener("click", () => deplacer(1));
    vue.addEventListener("click", (e) => {
      if (e.target === vue) fermerVisionneuse();
    });
    document.addEventListener("keydown", (e) => {
      if (!vue.classList.contains("est-ouverte")) return;
      if (e.key === "Escape") fermerVisionneuse();
      if (e.key === "ArrowLeft") deplacer(-1);
      if (e.key === "ArrowRight") deplacer(1);
    });
    return vue;
  }

  function afficher(index) {
    const vue = construireVisionneuse();
    const total = toutesLesPhotos.length;
    indexCourant = (index + total) % total; // boucle sur la collection
    const photo = toutesLesPhotos[indexCourant];

    vue.querySelector("img").src = photo.image_url;
    vue.querySelector("img").alt = photo.titre || photo.evenement || "";
    const legende = [photo.titre, photo.evenement, formaterDate(photo.date_prise)]
      .filter(Boolean)
      .join(" — ");
    vue.querySelector("figcaption").textContent =
      legende + (total > 1 ? "   (" + (indexCourant + 1) + " / " + total + ")" : "");

    vue.classList.add("est-ouverte");
    document.body.classList.add("visionneuse-ouverte");
  }

  function deplacer(pas) {
    afficher(indexCourant + pas);
  }

  function fermerVisionneuse() {
    const vue = document.getElementById("galerie-visionneuse");
    if (vue) vue.classList.remove("est-ouverte");
    document.body.classList.remove("visionneuse-ouverte");
  }

  function activerVisionneuse() {
    grid.querySelectorAll(".galerie-photo").forEach((figure) => {
      const ouvrir = () => afficher(parseInt(figure.dataset.index, 10));
      figure.addEventListener("click", ouvrir);
      figure.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          ouvrir();
        }
      });
    });
  }

  /* Toutes les photos publiées, de la plus récente à la plus ancienne.
     Le tri par exercice rotarien a été retiré : il obligeait le visiteur à
     deviner une année avant de voir la moindre image. Le regroupement par
     événement, lui, est conservé — c'est celui qui a du sens à la lecture. */
  function loadPhotos() {
    RC.api("/api/public/galerie")
      .then((photos) => {
        // null : aucun serveur joignable (vitrine hébergée seule).
        if (photos === null) {
          showMessage(
            (window.rcLangue && window.rcLangue.traduire("galerie.hors_ligne")) ||
              "La galerie photo du club s'affiche depuis l'espace membre. Contactez le Secrétariat pour y accéder."
          );
          return;
        }
        if (!photos.length) {
          showMessage(((window.rcLangue && window.rcLangue.traduire("galerie.aucune_photo")) || "Aucune photo n'est publiée pour le moment."));
          return;
        }
        empty.style.display = "none";
        grid.innerHTML = "";
        rendreAlbums(photos);
      })
      .catch(() => showMessage(((window.rcLangue && window.rcLangue.traduire("galerie.indisponible")) || "La galerie est momentanément indisponible.")));
  }

  /* ================= VIDÉOS ================= */

  const grilleVideos = document.getElementById("video-grid");
  const videoVide = document.getElementById("video-empty");
  const ongletPhotos = document.getElementById("onglet-photos");
  const ongletVideos = document.getElementById("onglet-videos");
  const voletPhotos = document.getElementById("volet-photos");
  const voletVideos = document.getElementById("volet-videos");

  function messageVideo(texte) {
    if (!grilleVideos) return;
    grilleVideos.innerHTML = "";
    videoVide.textContent = texte;
    videoVide.style.display = "block";
  }

  /* Les vidéos sont regroupées par événement, comme les photos, et
     présentées en rangées défilantes. */
  function rendreVideos(videos) {
    const albums = regrouper(videos, "videos");

    grilleVideos.innerHTML = albums
      .map((album) => {
        const titre = album.evenements.length
          ? album.evenements.join(" · ")
          : (window.rcLangue && window.rcLangue.traduire("galerie.videos_club"))
            || "Vidéos du club";
        const dateLisible = formaterDate(album.date);
        const vignettes = album.videos
          .map(
            (v) => `
            <figure class="galerie-video" tabindex="0" role="button" data-index="${v._index}"
                    aria-label="${escapeHtml(v.titre)}">
              <div class="galerie-video__vignette">
                ${v.apercu_url
                  ? `<img src="${escapeHtml(v.apercu_url)}" alt="" loading="lazy">`
                  : `<div class="galerie-video__sans-apercu"></div>`}
                <span class="galerie-video__lecture" aria-hidden="true">&#9654;</span>
              </div>
              <figcaption>
                <strong>${escapeHtml(v.titre)}</strong>
                ${v.description ? `<span class="texte-riche">${v.description}</span>` : ""}
              </figcaption>
            </figure>`
          )
          .join("");
        return `
          <section class="galerie-album">
            <div class="galerie-album__entete">
              <h3>${escapeHtml(titre)}</h3>
              <span>${dateLisible ? escapeHtml(dateLisible) + " — " : ""}${album.videos.length} vidéo${album.videos.length > 1 ? "s" : ""}</span>
            </div>
            <div class="carrousel">
              <button type="button" class="carrousel__fleche carrousel__fleche--gauche" aria-label="Vidéos précédentes">&#8249;</button>
              <div class="carrousel__piste">${vignettes}</div>
              <button type="button" class="carrousel__fleche carrousel__fleche--droite" aria-label="Vidéos suivantes">&#8250;</button>
            </div>
          </section>`;
      })
      .join("");

    activerCarrousels(grilleVideos);
    activerLecteurVideo(videos);
    if (window.rcLangue) window.rcLangue.rafraichir();
  }

  /* Lecteur plein écran : lecteur intégré pour YouTube et Vimeo, lien
     externe pour les autres services. */
  function activerLecteurVideo(videos) {
    grilleVideos.querySelectorAll(".galerie-video").forEach((figure) => {
      const ouvrir = () => {
        const v = videos[parseInt(figure.dataset.index, 10)];
        if (!v.url_integration) {
          window.open(v.url, "_blank", "noopener,noreferrer");
          return;
        }
        const vue = construireLecteur();
        vue.querySelector("iframe").src = v.url_integration + "?autoplay=1&rel=0";
        vue.querySelector(".lecteur__legende").textContent = [
          v.titre,
          v.evenement,
          formaterDate(v.date_prise),
        ]
          .filter(Boolean)
          .join(" — ");
        vue.classList.add("est-ouverte");
        document.body.classList.add("visionneuse-ouverte");
      };
      figure.addEventListener("click", ouvrir);
      figure.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          ouvrir();
        }
      });
    });
  }

  function construireLecteur() {
    let vue = document.getElementById("galerie-lecteur");
    if (vue) return vue;

    vue = document.createElement("div");
    vue.id = "galerie-lecteur";
    vue.className = "visionneuse lecteur";
    vue.innerHTML = `
      <button type="button" class="visionneuse__fermer" aria-label="Fermer">&times;</button>
      <figure class="lecteur__contenu">
        <div class="lecteur__cadre">
          <iframe src="" title="Vidéo du club" frameborder="0" allowfullscreen
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture"></iframe>
        </div>
        <figcaption class="lecteur__legende"></figcaption>
      </figure>`;
    document.body.appendChild(vue);

    function fermer() {
      vue.querySelector("iframe").src = ""; // coupe la lecture
      vue.classList.remove("est-ouverte");
      document.body.classList.remove("visionneuse-ouverte");
    }
    vue.querySelector(".visionneuse__fermer").addEventListener("click", fermer);
    vue.addEventListener("click", (e) => {
      if (e.target === vue) fermer();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && vue.classList.contains("est-ouverte")) fermer();
    });
    return vue;
  }

  function chargerVideos() {
    if (!grilleVideos) return;
    RC.api("/api/public/videos")
      .then((videos) => {
        if (videos === null) {
          messageVideo(
            (window.rcLangue && window.rcLangue.traduire("galerie.hors_ligne")) ||
              "Les vidéos du club s'affichent depuis l'espace membre. Contactez le Secrétariat pour y accéder."
          );
          return;
        }
        if (!videos.length) {
          messageVideo(
            (window.rcLangue && window.rcLangue.traduire("galerie.aucune_video")) ||
              "Aucune vidéo n'est publiée pour le moment."
          );
          return;
        }
        videoVide.style.display = "none";
        rendreVideos(videos);
      })
      .catch(() =>
        messageVideo(
          (window.rcLangue && window.rcLangue.traduire("galerie.indisponible")) ||
            "La galerie est momentanément indisponible."
        )
      );
  }

  /* ---------- Bascule Photos / Vidéos ---------- */

  if (ongletPhotos && ongletVideos) {
    function afficherVolet(surVideos) {
      voletPhotos.hidden = surVideos;
      voletVideos.hidden = !surVideos;
      ongletPhotos.classList.toggle("is-active", !surVideos);
      ongletVideos.classList.toggle("is-active", surVideos);
      ongletPhotos.setAttribute("aria-selected", String(!surVideos));
      ongletVideos.setAttribute("aria-selected", String(surVideos));
    }
    ongletPhotos.addEventListener("click", () => afficherVolet(false));
    ongletVideos.addEventListener("click", () => afficherVolet(true));
  }

  loadPhotos();
  chargerVideos();
})();
