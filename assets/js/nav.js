/**
 * Rotary Club du François — Menu de navigation mobile.
 *
 * Sous 860px, la barre de navigation est repliée derrière un bouton
 * hamburger. Le menu se ferme au clic sur un lien, à l'appui sur Échap et
 * dès que la fenêtre repasse au-dessus du point de rupture — de sorte que
 * l'état du menu ne « colle » jamais lors d'une rotation de l'appareil.
 */
(function () {
  "use strict";

  var toggle = document.getElementById("nav-toggle");
  var nav = document.getElementById("site-nav");
  if (!toggle || !nav) return;

  var POINT_DE_RUPTURE = window.matchMedia("(min-width: 861px)");

  function ouvrir() {
    nav.classList.add("is-open");
    toggle.classList.add("is-open");
    toggle.setAttribute("aria-expanded", "true");
    toggle.setAttribute("aria-label", "Fermer le menu");
  }

  function fermer() {
    nav.classList.remove("is-open");
    toggle.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Ouvrir le menu");
  }

  toggle.addEventListener("click", function () {
    if (nav.classList.contains("is-open")) {
      fermer();
    } else {
      ouvrir();
    }
  });

  nav.addEventListener("click", function (e) {
    if (e.target.tagName === "A") fermer();
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") fermer();
  });

  // Retour au bureau : on rend la main au CSS, le menu redevient une barre.
  function surChangementDeTaille(e) {
    if (e.matches) fermer();
  }
  if (typeof POINT_DE_RUPTURE.addEventListener === "function") {
    POINT_DE_RUPTURE.addEventListener("change", surChangementDeTaille);
  } else if (typeof POINT_DE_RUPTURE.addListener === "function") {
    POINT_DE_RUPTURE.addListener(surChangementDeTaille); // Safari ancien
  }
})();
