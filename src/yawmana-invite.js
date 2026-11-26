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

/** Google Play keeps this as the install referrer, so the first open after installing goes straight to joining. */
export function playLink(base, invite) {
  const clean = base.split('&referrer=')[0];
  return invite ? `${clean}&referrer=${encodeURIComponent(`family=${invite.family}&token=${invite.token}`)}` : clean;
}

// Anonymous counts for the invitation funnel: platform class and page language only, never the link itself.
export const METRICS_URL = 'https://yawmanametrics-pjrab2cb7a-ww.a.run.app/v1/web';
const WEB_LANGUAGES = ['ar', 'de', 'fr', 'he', 'zh-hant', 'zh-hans', 'nl', 'sv', 'da', 'nb', 'fi'];

export function platformOf(nav = {}) {
  const agent = String(nav.userAgent || '');
  if (/iPhone|iPad|iPod/.test(agent) || (/Macintosh/.test(agent) && nav.maxTouchPoints > 1)) return 'ios';
  return /Android/.test(agent) ? 'android' : 'other';
}

export function pageLanguage(pathname = '/') {
  const first = pathname.split('/')[1];
  return WEB_LANGUAGES.includes(first) ? first : 'en';
}

export function countEvent(event, win = window) {
  const body = JSON.stringify({ schema: 1, event, platform: platformOf(win.navigator), language: pageLanguage(win.location.pathname) });
  try {
    // text/plain needs no CORS preflight; the reply is not read.
    if (win.navigator.sendBeacon?.(METRICS_URL, new Blob([body], { type: 'text/plain' }))) return;
    win.fetch?.(METRICS_URL, { method: 'POST', body, keepalive: true, mode: 'no-cors', credentials: 'omit', headers: { 'Content-Type': 'text/plain' } }).catch(() => {});
  } catch { /* counting never blocks the page */ }
}

export function initInvitePage(doc = document, win = window) {
  const open = doc.querySelector('[data-invite-open]');
  const copy = doc.querySelector('[data-invite-copy]');
  const status = doc.querySelector('[data-invite-status]');
  const play = doc.querySelector('[data-invite-play]');
  const fragment = () => parseInviteFragment(win.location.hash);

  const update = () => {
    const invite = fragment();
    const valid = Boolean(invite);
    if (open) {
      open.disabled = !valid;
    }
    if (copy) copy.disabled = !valid;
    if (play) play.href = playLink(play.getAttribute('href'), invite);
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
  play?.addEventListener('click', () => countEvent('invite_play_clicked', win));
  win.addEventListener('hashchange', update);
  update();
  countEvent('invite_page_opened', win);
}

if (typeof document !== 'undefined') initInvitePage();
