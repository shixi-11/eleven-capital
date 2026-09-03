const menu = document.querySelector(".menu-toggle");
const panel = document.querySelector("#mobile-menu");
function closeMenu() {
  menu?.setAttribute("aria-expanded", "false");
  if (panel) panel.hidden = true;
}
menu?.addEventListener("click", () => {
  const open = menu.getAttribute("aria-expanded") !== "true";
  menu.setAttribute("aria-expanded", String(open));
  panel.hidden = !open;
});
panel?.addEventListener("click", (event) => {
  if (event.target.closest("a")) closeMenu();
});
document.addEventListener("keydown", (event) => {
  if (
    event.key === "Escape" &&
    menu?.getAttribute("aria-expanded") === "true"
  ) {
    closeMenu();
    menu.focus();
  }
});

// The brief stays in this document. Only the visitor's mail client sends it.
const inquiry = document.querySelector('[data-inquiry]');
if (inquiry) {
  const result = inquiry.querySelector('.inquiry-result');
  const summary = inquiry.querySelector('#inquiry-summary');
  const status = inquiry.querySelector('.inquiry-status');
  const send = inquiry.querySelector('[data-inquiry-send]');
  inquiry.addEventListener('submit', event => {
    event.preventDefault();
    for (const field of inquiry.querySelectorAll('input,textarea:not([readonly])')) field.value = field.value.trim();
    if (!inquiry.reportValidity()) return;
    const fields = ['name','email','company','interest','goal','timing','budget'];
    const separator = /^(zh|ja)/.test(document.documentElement.lang) ? '：' : ': ';
    const lines = fields.map(name => {
      const field = inquiry.elements.namedItem(name);
      const value = field.tagName === 'SELECT' ? field.selectedOptions[0].textContent.trim() : field.value.trim();
      const label = field.closest('label').childNodes[0].textContent.replace(/\s*\*$/, '').trim();
      return value ? label + separator + value : '';
    }).filter(Boolean);
    summary.value = lines.join('\n\n');
    send.href = 'mailto:info@elevencapital.ltd?subject=' + encodeURIComponent(inquiry.dataset.subject) + '&body=' + encodeURIComponent(summary.value);
    result.hidden = false;
    status.textContent = inquiry.dataset.ready;
    summary.focus();
  });
  inquiry.addEventListener('input', () => {
    // Do not let a visitor send an out-of-date summary after changing the brief.
    result.hidden = true;
    summary.value = '';
    send.href = 'mailto:info@elevencapital.ltd';
    status.textContent = '';
  });
  inquiry.querySelector('[data-inquiry-copy]').addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(summary.value);
      status.textContent = inquiry.dataset.copied;
    } catch {
      summary.focus();
      summary.select();
      status.textContent = inquiry.dataset.copyFailed;
    }
  });
  document.querySelectorAll('[data-offer]').forEach(link => link.addEventListener('click', () => {
    document.querySelector('#project-enquiry').open = true;
    inquiry.elements.namedItem('interest').value = link.dataset.offer;
    result.hidden = true;
    summary.value = '';
    status.textContent = '';
    inquiry.elements.namedItem('name').focus({preventScroll:true});
  }));
  // Keep native GET submission impossible if the script fails or is disabled.
  inquiry.querySelector('[data-inquiry-controls]').disabled = false;
}
document.addEventListener("click", (event) => {
  if (!event.target.closest(".site-header")) closeMenu();
});
window.matchMedia("(min-width: 851px)").addEventListener("change", closeMenu);
document.querySelectorAll("[data-language]").forEach((language) =>
  language.addEventListener("click", (event) => {
    const link = event.currentTarget;
    link.href = link.getAttribute("href").split("#")[0] + window.location.hash;
  }),
);
document.addEventListener("click", (event) => {
  if (!event.target.closest(".language-picker"))
    document.querySelector(".language-picker")?.removeAttribute("open");
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    const picker = document.querySelector(".language-picker[open]");
    if (picker) {
      picker.removeAttribute("open");
      picker.querySelector("summary").focus();
    }
  }
});
