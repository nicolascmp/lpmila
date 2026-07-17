/*
  Scroll-triggered reveal animations for landing sections.
  Re-binds after dynamic story content is injected.
*/

(function initReveal() {
  const observe = (nodes) => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)")
      .matches;

    if (reduceMotion || !("IntersectionObserver" in window)) {
      nodes.forEach((node) => node.classList.add("is-visible"));
      return null;
    }

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
    );

    nodes.forEach((node, index) => {
      node.style.transitionDelay = `${Math.min(index % 4, 3) * 70}ms`;
      observer.observe(node);
    });

    return observer;
  };

  let observer = observe(Array.from(document.querySelectorAll("[data-reveal]")));

  document.addEventListener("mila:story-ready", () => {
    if (observer) {
      observer.disconnect();
    }
    observer = observe(Array.from(document.querySelectorAll("[data-reveal]")));
  });
})();
