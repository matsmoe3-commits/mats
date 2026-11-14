// Kleine UI-Helfer ohne Framework.

export const esc = (s) =>
  String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

// Sehr einfaches Markdown-light: Absätze, Zeilenumbrüche, **fett**, Links, - Listen.
export function richText(s) {
  const lines = esc(s).split('\n');
  let html = '';
  let inList = false;
  for (const line of lines) {
    const m = line.match(/^\s*[-*]\s+(.*)/);
    if (m) {
      if (!inList) { html += '<ul>'; inList = true; }
      html += `<li>${inline(m[1])}</li>`;
      continue;
    }
    if (inList) { html += '</ul>'; inList = false; }
    html += line.trim() ? `<p>${inline(line)}</p>` : '';
  }
  if (inList) html += '</ul>';
  return html;
}
function inline(s) {
  return s
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/(https?:\/\/[^\s<]+)/g, '<a href="$1" target="_blank" rel="noopener">$1</a>');
}

export function toast(msg, ms = 2200) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(el._t);
  el._t = setTimeout(() => el.classList.remove('show'), ms);
}

export function modal(html, { onMount, wide = false } = {}) {
  const root = document.getElementById('modal-root');
  root.innerHTML = `
    <div class="modal-backdrop" data-close>
      <div class="modal ${wide ? 'wide' : ''}" role="dialog" aria-modal="true">${html}</div>
    </div>`;
  const backdrop = root.firstElementChild;
  const close = () => { root.innerHTML = ''; document.removeEventListener('keydown', onKey); };
  const onKey = (e) => { if (e.key === 'Escape') close(); };
  document.addEventListener('keydown', onKey);
  backdrop.addEventListener('mousedown', (e) => { if (e.target === backdrop) close(); });
  backdrop.querySelectorAll('[data-close-btn]').forEach((b) => b.addEventListener('click', close));
  onMount?.(backdrop.querySelector('.modal'), close);
  backdrop.querySelector('input, textarea, select')?.focus();
  return close;
}

export function confirmDialog(text) {
  return new Promise((resolve) => {
    modal(`
      <p>${esc(text)}</p>
      <div class="row end">
        <button class="btn ghost" data-no>Abbrechen</button>
        <button class="btn danger" data-yes>Ja</button>
      </div>`, {
      onMount(el, close) {
        el.querySelector('[data-yes]').onclick = () => { close(); resolve(true); };
        el.querySelector('[data-no]').onclick = () => { close(); resolve(false); };
      },
    });
  });
}

export const fmtDate = (iso) =>
  iso ? new Date(iso).toLocaleDateString('de-DE', { day: '2-digit', month: 'short', year: 'numeric' }) : '';

export function relTime(iso) {
  if (!iso) return '';
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return 'gerade eben';
  if (diff < 3600) return `vor ${Math.floor(diff / 60)} Min.`;
  if (diff < 86400) return `vor ${Math.floor(diff / 3600)} Std.`;
  if (diff < 86400 * 30) return `vor ${Math.floor(diff / 86400)} Tagen`;
  return fmtDate(iso);
}
