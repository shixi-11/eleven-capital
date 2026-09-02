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
document.addEventListener("click", (event) => {
  if (!event.target.closest(".site-header")) closeMenu();
});
window.matchMedia("(min-width: 1001px)").addEventListener("change", closeMenu);
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
