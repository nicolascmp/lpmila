/*
  Landing page bootstrap helpers (footer year and safe external-link defaults).
*/

(function initMain() {
  const yearNode = document.querySelector("[data-year]");
  if (yearNode) {
    yearNode.textContent = String(new Date().getFullYear());
  }

  document.querySelectorAll('a[href^="http"]').forEach((link) => {
    link.setAttribute("rel", "noopener noreferrer");
    if (!link.target) {
      link.setAttribute("target", "_blank");
    }
  });
})();
