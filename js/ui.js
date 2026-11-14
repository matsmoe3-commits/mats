// Kleine UI-Helfer ohne Framework.

export const esc = (s) =>
  String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

export const fmtDate = (iso) =>
  iso ? new Date(iso).toLocaleDateString('de-DE', { day: 'numeric', month: 'short', year: 'numeric' }) : '';

export function toast(msg) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(el._t);
  el._t = setTimeout(() => el.classList.remove('show'), 1800);
}

export function modal(html, { onMount } = {}) {
  const root = document.getElementById('modal-root');
  root.innerHTML = `<div class="backdrop"><div class="dialog" role="dialog" aria-modal="true">${html}</div></div>`;
  const backdrop = root.firstElementChild;
  const close = () => { root.innerHTML = ''; document.removeEventListener('keydown', onKey); };
  const onKey = (e) => { if (e.key === 'Escape') close(); };
  document.addEventListener('keydown', onKey);
  backdrop.addEventListener('mousedown', (e) => { if (e.target === backdrop) close(); });
  backdrop.querySelectorAll('[data-close-btn]').forEach((b) => b.addEventListener('click', close));
  onMount?.(backdrop.firstElementChild, close);
  backdrop.querySelector('input, textarea')?.focus();
  return close;
}

export function confirmDialog(text) {
  return new Promise((resolve) => {
    modal(`
      <p>${esc(text)}</p>
      <div class="actions"><span></span><div>
        <button class="btn-text" data-no>Abbrechen</button>
        <button class="btn danger" data-yes>Löschen</button>
      </div></div>`, {
      onMount(el, close) {
        el.querySelector('[data-yes]').onclick = () => { close(); resolve(true); };
        el.querySelector('[data-no]').onclick = () => { close(); resolve(false); };
      },
    });
  });
}
