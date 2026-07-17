/*
  Pre-launch waitlist: collects an Instagram or TikTok handle via FormSubmit.
  Used while the Mila app is not yet available on the stores.
*/

(function initWaitlist() {
  const mount = document.querySelector("[data-waitlist]");
  if (!mount) {
    return;
  }

  const ENDPOINT = "https://formsubmit.co/ajax/support@mila-skincare.com";
  // Instagram / TikTok style handle: optional @, 1–30 chars
  const HANDLE_RE = /^@?[A-Za-z0-9._]{1,30}$/;

  mount.innerHTML = `
    <form class="waitlist" data-waitlist-form novalidate>
      <fieldset class="waitlist__platforms">
        <legend class="visually-hidden">Réseau social</legend>
        <label class="waitlist__choice">
          <input type="radio" name="platform" value="instagram" checked />
          Instagram
        </label>
        <label class="waitlist__choice">
          <input type="radio" name="platform" value="tiktok" />
          TikTok
        </label>
      </fieldset>
      <label class="visually-hidden" for="waitlist-handle">Pseudo</label>
      <div class="waitlist__row">
        <input
          class="waitlist__input"
          id="waitlist-handle"
          name="handle"
          type="text"
          autocomplete="username"
          spellcheck="false"
          maxlength="31"
          placeholder="@tonpseudo"
          required
        />
        <button class="btn btn--primary" type="submit">Me prévenir</button>
      </div>
      <input
        class="waitlist__honey"
        type="text"
        name="_honey"
        tabindex="-1"
        autocomplete="off"
        aria-hidden="true"
      />
      <p class="waitlist__hint">
        On te DM seulement pour t’annoncer le lancement — rien d’autre.
      </p>
      <p class="waitlist__status" data-waitlist-status role="status" aria-live="polite"></p>
    </form>
  `;

  const form = mount.querySelector("[data-waitlist-form]");
  const handleInput = form.querySelector("#waitlist-handle");
  const honeyInput = form.querySelector('input[name="_honey"]');
  const statusNode = form.querySelector("[data-waitlist-status]");
  const submitBtn = form.querySelector('button[type="submit"]');

  const setStatus = (message, kind) => {
    statusNode.textContent = message;
    statusNode.dataset.kind = kind || "";
  };

  const normalizeHandle = (raw) => {
    const trimmed = raw.trim().replace(/\s+/g, "");
    if (!trimmed) {
      return "";
    }
    return trimmed.startsWith("@") ? trimmed : `@${trimmed}`;
  };

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (honeyInput.value.trim()) {
      setStatus("Merci, tu es bien inscrit(e).", "ok");
      form.reset();
      return;
    }

    const handle = normalizeHandle(handleInput.value);
    if (!HANDLE_RE.test(handle)) {
      setStatus("Entre un pseudo Instagram ou TikTok valide.", "error");
      handleInput.focus();
      return;
    }

    const platformInput = form.querySelector('input[name="platform"]:checked');
    const platform = platformInput ? platformInput.value : "instagram";

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
          platform,
          handle,
          _subject: `Mila — liste d'attente (${platform})`,
          _template: "table",
          message: `Nouvelle inscription liste d'attente Mila via ${platform}.`,
        }),
      });

      if (!response.ok) {
        throw new Error(`Waitlist request failed (${response.status})`);
      }

      setStatus("C’est noté — on te prévient dès le lancement.", "ok");
      form.reset();
    } catch (_error) {
      setStatus(
        "Envoi impossible pour le moment. Écris-nous à support@mila-skincare.com.",
        "error"
      );
    } finally {
      submitBtn.disabled = false;
    }
  });
})();
