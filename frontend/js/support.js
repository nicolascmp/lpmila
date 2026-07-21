/*
  Support contact form: email-only reply channel, sent via FormSubmit.
*/

(function initSupportForm() {
  const mount = document.querySelector("[data-support-root]");
  if (!mount) {
    return;
  }

  const ENDPOINT = "https://formsubmit.co/ajax/support@mila-skincare.com";
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
  const MAX_MESSAGE = 4000;

  mount.innerHTML = `
    <form class="support-form" data-support-form novalidate>
      <div class="support-form__field">
        <span class="support-form__label" id="support-topic-label">Sujet</span>
        <select
          class="support-form__select"
          id="support-topic"
          name="topic"
          aria-labelledby="support-topic-label"
          required
        >
          <option value="">Choisir un sujet</option>
          <option value="compte">Compte &amp; connexion</option>
          <option value="abonnement">Abonnement &amp; paiement</option>
          <option value="technique">Problème technique</option>
          <option value="donnees">Données &amp; confidentialité</option>
          <option value="autre">Autre</option>
        </select>
      </div>

      <div class="support-form__field">
        <label class="support-form__label" for="support-email">
          E-mail pour te répondre
        </label>
        <input
          class="support-form__input"
          id="support-email"
          name="email"
          type="email"
          autocomplete="email"
          inputmode="email"
          maxlength="254"
          placeholder="ton@email.com"
          required
        />
      </div>

      <div class="support-form__field">
        <label class="support-form__label" for="support-message">Message</label>
        <textarea
          class="support-form__textarea"
          id="support-message"
          name="message"
          maxlength="${MAX_MESSAGE}"
          placeholder="Décris ta demande…"
          required
        ></textarea>
      </div>

      <input
        class="support-form__honey"
        type="text"
        name="_honey"
        tabindex="-1"
        autocomplete="off"
        aria-hidden="true"
      />

      <div class="support-form__actions">
        <button class="btn btn--primary" type="submit">Envoyer</button>
        <p class="support-form__status" data-support-status role="status" aria-live="polite"></p>
      </div>
      <p class="support-form__hint">
        On te répond uniquement par e-mail, sous quelques jours ouvrés.
        Pas de données de santé dans ce formulaire.
      </p>
    </form>
    <p class="support-form__alt">
      Ou écris directement à
      <a href="mailto:support@mila-skincare.com">support@mila-skincare.com</a>.
    </p>
  `;

  const form = mount.querySelector("[data-support-form]");
  const topicSelect = form.querySelector("#support-topic");
  const emailInput = form.querySelector("#support-email");
  const messageInput = form.querySelector("#support-message");
  const honeyInput = form.querySelector('input[name="_honey"]');
  const statusNode = form.querySelector("[data-support-status]");
  const submitBtn = form.querySelector('button[type="submit"]');

  const setStatus = (message, kind) => {
    statusNode.textContent = message;
    statusNode.dataset.kind = kind || "";
  };

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (honeyInput.value.trim()) {
      setStatus("Message envoyé. Merci !", "ok");
      form.reset();
      return;
    }

    const topic = topicSelect.value;
    const email = emailInput.value.trim().toLowerCase();
    const message = messageInput.value.trim();

    if (!topic) {
      setStatus("Choisis un sujet.", "error");
      topicSelect.focus();
      return;
    }

    if (!EMAIL_RE.test(email)) {
      setStatus("Entre une adresse e-mail valide.", "error");
      emailInput.focus();
      return;
    }

    if (message.length < 10 || message.length > MAX_MESSAGE) {
      setStatus("Ton message doit faire entre 10 et 4000 caractères.", "error");
      messageInput.focus();
      return;
    }

    submitBtn.disabled = true;
    setStatus("Envoi en cours…", "pending");

    try {
      const response = await fetch(ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          topic,
          email,
          message,
          _replyto: email,
          _subject: `Mila — support (${topic})`,
          _template: "table",
        }),
      });

      if (!response.ok) {
        throw new Error(`Support request failed (${response.status})`);
      }

      setStatus("Message envoyé. On te répond par e-mail dès que possible.", "ok");
      form.reset();
    } catch (_error) {
      setStatus(
        "Envoi impossible. Écris-nous à support@mila-skincare.com.",
        "error"
      );
    } finally {
      submitBtn.disabled = false;
    }
  });
})();
