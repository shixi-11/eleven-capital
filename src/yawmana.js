// These controls only copy an address or follow visitor-selected links. No requests are sent here.
for (const button of document.querySelectorAll('[data-copy-email]')) {
  button.addEventListener('click', async () => {
    const contact=button.closest('.product-contact'), address=contact.querySelector('.product-email bdi');
    const status=contact.querySelector('[role="status"]');
    try { await navigator.clipboard.writeText(address.textContent); status.textContent=button.dataset.copied; }
    catch {
      const selection=window.getSelection(), range=document.createRange();
      range.selectNodeContents(address);selection.removeAllRanges();selection.addRange(range);
      status.textContent=button.dataset.copyFailed;
    }
  });
}
for (const link of document.querySelectorAll('[data-yawmana-language]')) {
  link.addEventListener('click', () => { link.href=link.getAttribute('href').split('#')[0]+location.hash; });
}
