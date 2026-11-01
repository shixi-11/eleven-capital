export const FAMILY_ID_PATTERN = '[A-Za-z0-9_-]{1,80}';
export const TOKEN_PATTERN = '[A-Za-z0-9_-]{43}';
const INVITE_PATTERN = new RegExp(`^#family=(${FAMILY_ID_PATTERN})&token=(${TOKEN_PATTERN})$`);

export function parseInviteFragment(hash = '') {
  const match = INVITE_PATTERN.exec(hash);
  return match && match[0].length === hash.length ? { family: match[1], token: match[2] } : null;
}

export function inviteLink({ family, token }) {
  return `yawmana://family/${family}?token=${token}`;
}

export function initInvitePage(doc = document, win = window) {
  const open = doc.querySelector('[data-invite-open]');
  const copy = doc.querySelector('[data-invite-copy]');
  const status = doc.querySelector('[data-invite-status]');
  const fragment = () => parseInviteFragment(win.location.hash);

  const update = () => {
    const invite = fragment();
    const valid = Boolean(invite);
    if (open) {
      open.disabled = !valid;
    }
    if (copy) copy.disabled = !valid;
    const displayed = valid ? `${win.location.origin}${win.location.pathname}${win.location.hash}` : '';
    const url = doc.querySelector('[data-invite-url]');
    if (url) url.textContent = displayed;
    if (status) status.textContent = valid ? '' : status.dataset.invalid;
  };

  open?.addEventListener('click', (event) => {
    const invite = fragment();
    if (!invite) { event.preventDefault(); return; }
    win.location.href = inviteLink(invite);
  });
  copy?.addEventListener('click', async () => {
    const invite = fragment();
    if (!invite) return;
    const link = `${win.location.origin}${win.location.pathname}#family=${invite.family}&token=${invite.token}`;
    try {
      await win.navigator.clipboard.writeText(link);
      status.textContent = copy.dataset.copied;
    } catch {
      const range = doc.createRange();
      range.selectNodeContents(doc.querySelector('[data-invite-url]'));
      const selection = win.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      status.textContent = copy.dataset.copyFailed;
    }
  });
  for (const link of doc.querySelectorAll('[data-invite-language]')) {
    link.addEventListener('click', () => {
      const hash = win.location.hash;
      if (hash) link.href = `${link.getAttribute('href').split('#')[0]}${hash}`;
    });
  }
  win.addEventListener('hashchange', update);
  update();
}

if (typeof document !== 'undefined') initInvitePage();
