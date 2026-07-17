/*
  Shared renderer for Mila legal pages (privacy policy, terms of use).
  Reads blocks from window[data-legal-key] and escapes all text for XSS safety.
*/

(function renderLegalDocument() {
  const root = document.querySelector("[data-legal-root]");
  if (!root) {
    return;
  }

  const key = root.getAttribute("data-legal-key");
  const blocks = key && window[key];
  if (!Array.isArray(blocks)) {
    return;
  }

  const escapeHtml = (value) =>
    String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");

  const isSafeHttpUrl = (url) => /^https:\/\//i.test(String(url || ""));

  const linkify = (escaped) =>
    escaped
      .replaceAll(
        "support@mila-skincare.com",
        '<a href="mailto:support@mila-skincare.com">support@mila-skincare.com</a>'
      )
      .replaceAll(
        "Politique de confidentialité",
        '<a href="privacy.html">Politique de confidentialité</a>'
      )
      .replaceAll("\n", "<br />");

  const html = [];
  let listOpen = null;

  const closeList = () => {
    if (listOpen) {
      html.push(`</${listOpen}>`);
      listOpen = null;
    }
  };

  const openList = (tag) => {
    if (listOpen !== tag) {
      closeList();
      html.push(`<${tag}>`);
      listOpen = tag;
    }
  };

  blocks.forEach((block) => {
    const type = block.type;

    if (type === "li" || type === "oli") {
      openList("ul");
      html.push(`<li>${linkify(escapeHtml(block.text))}</li>`);
      return;
    }

    closeList();

    if (type === "meta") {
      html.push(`<p class="legal__meta">${linkify(escapeHtml(block.text))}</p>`);
      return;
    }

    if (type === "callout") {
      html.push(
        `<aside class="legal__callout" aria-label="${escapeHtml(block.title)}">` +
          `<p class="legal__callout-title">${escapeHtml(block.title)}</p>` +
          `<p>${linkify(escapeHtml(block.body))}</p>` +
          `</aside>`
      );
      return;
    }

    if (type === "h2") {
      html.push(`<h2>${escapeHtml(block.text)}</h2>`);
      return;
    }

    if (type === "h3") {
      html.push(`<h3>${escapeHtml(block.text)}</h3>`);
      return;
    }

    if (type === "link" && isSafeHttpUrl(block.href)) {
      html.push(
        `<p><a href="${escapeHtml(block.href)}" target="_blank" rel="noopener noreferrer">${escapeHtml(block.text)}</a></p>`
      );
      return;
    }

    if (type === "table" && Array.isArray(block.rows) && block.rows.length) {
      const [header, ...rows] = block.rows;
      html.push('<div class="legal__table-wrap"><table class="legal__table">');
      html.push("<thead><tr>");
      header.forEach((cell) => {
        html.push(`<th scope="col">${escapeHtml(cell)}</th>`);
      });
      html.push("</tr></thead><tbody>");
      rows.forEach((row) => {
        html.push("<tr>");
        row.forEach((cell) => {
          html.push(`<td>${linkify(escapeHtml(cell))}</td>`);
        });
        html.push("</tr>");
      });
      html.push("</tbody></table></div>");
      return;
    }

    if (type === "p") {
      html.push(`<p>${linkify(escapeHtml(block.text))}</p>`);
    }
  });

  closeList();
  root.innerHTML = html.join("");
})();
