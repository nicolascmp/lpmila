/*
  Renders the product story blocks (Analyse, Journal, Plan, Profil)
  to keep the landing HTML lean and one concern per file.
*/

(function initStory() {
  const root = document.querySelector("[data-story]");
  if (!root) {
    return;
  }

  const blocks = [
    {
      step: "01 — Analyse",
      title: "Un diagnostic peau lisible",
      copy:
        "Mila transforme ta photo en indice peau, avec une analyse front, joues, menton et zone T. Tu repars avec un message clair — et un potentiel réaliste sur 90 jours.",
      image: "assets/screens/diagnostic.png",
      alt: "Écran diagnostic peau Mila avec un score de 82 sur 100",
      reverse: false,
    },
    {
      step: "02 — Journal",
      title: "Un rituel quotidien simple",
      copy:
        "Capture ton évolution, note comment tu te sens, et suis les tendances. Moins d’intuition floue, plus de repères concrets.",
      image: "assets/screens/journal.png",
      alt: "Écran journal Mila avec photo du jour et sélection d’humeur",
      reverse: true,
    },
    {
      step: "03 — Mon plan",
      title: "Une routine qui tient la route",
      copy:
        "Nettoyant, sérum, hydratant, SPF… Mila structure tes étapes matin et soir, et te montre ce qui reste à faire — sans culpabiliser.",
      image: "assets/screens/routine.png",
      alt: "Écran routine du jour avec étapes de soins matin",
      reverse: false,
    },
    {
      step: "04 — Profil",
      title: "Voir tes progrès, vraiment",
      copy:
        "Bilan initial, bilans peau hebdo et espace pour l’évolution de ton score. La constance devient visible — et motivante.",
      image: "assets/screens/profil.png",
      alt: "Écran profil Mila avec bilan initial et progression",
      reverse: true,
    },
  ];

  const escapeHtml = (value) =>
    value
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");

  root.innerHTML = blocks
    .map((block) => {
      const rowClass = block.reverse
        ? "story__row story__row--reverse reveal"
        : "story__row reveal";
      return `
        <article class="${rowClass}" data-reveal>
          <div class="story__copy">
            <p class="eyebrow">${escapeHtml(block.step)}</p>
            <h3>${escapeHtml(block.title)}</h3>
            <p>${escapeHtml(block.copy)}</p>
          </div>
          <figure class="story__media">
            <div class="phone phone--solo">
              <img
                src="${escapeHtml(block.image)}"
                alt="${escapeHtml(block.alt)}"
                width="390"
                height="844"
                loading="lazy"
              />
            </div>
          </figure>
        </article>
      `;
    })
    .join("");

  document.dispatchEvent(new CustomEvent("mila:story-ready"));
})();
