/**
 * Rotary Club du François — Rend les tableaux défilables horizontalement
 * sur mobile, sans casser leur mise en page (thead/tbody alignés).
 */
(function () {
  "use strict";
  function wrap() {
    document.querySelectorAll("table").forEach((table) => {
      if (table.parentElement.classList.contains("table-scroll")) return;
      const wrapper = document.createElement("div");
      wrapper.className = "table-scroll";
      table.parentNode.insertBefore(wrapper, table);
      wrapper.appendChild(table);
    });
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", wrap);
  } else {
    wrap();
  }
})();
