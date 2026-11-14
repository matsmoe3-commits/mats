// App-Kern: Router + Tool-Registry + Startseite (Hub).
import { store } from './store.js';
import { esc } from './ui.js';
import { tools } from './tools/index.js';

const view = document.getElementById('view');
const nav = document.getElementById('nav');

function renderNav(active) {
  nav.innerHTML = tools
    .filter((t) => t.nav !== false)
    .map((t) => `<a href="#/${t.id}" class="${active === t.id ? 'active' : ''}" title="${esc(t.name)}">
        <span class="ico">${t.icon}</span><span class="lbl">${esc(t.short || t.name)}</span></a>`)
    .join('');
}

function renderHome() {
  const cards = tools.filter((t) => t.id !== 'settings').map((t) => {
    const stats = t.stats?.() || [];
    return `
      <a class="tool-card" href="#/${t.id}">
        <div class="tool-ico">${t.icon}</div>
        <div>
          <h3>${esc(t.name)}</h3>
          <p class="muted">${esc(t.description)}</p>
          ${stats.length ? `<div class="chips">${stats.map((s) => `<span class="chip">${esc(s)}</span>`).join('')}</div>` : ''}
        </div>
      </a>`;
  }).join('');

  const hour = new Date().getHours();
  const greet = hour < 11 ? 'Guten Morgen' : hour < 18 ? 'Hallo' : 'Guten Abend';

  view.innerHTML = `
    <section class="hero">
      <h1>${greet}, Mats 👋</h1>
      <p class="muted">Dein persönlicher Hub – Ideen festhalten, Projekte planen, eigene Tools an einem Ort.</p>
      <form id="quick" class="quick">
        <input name="q" placeholder="💡 Neuer Gedanke… (Enter zum Speichern)" autocomplete="off">
        <button class="btn primary">Speichern</button>
      </form>
    </section>
    <section class="grid tools">${cards}
      <div class="tool-card placeholder">
        <div class="tool-ico">➕</div>
        <div><h3>Nächstes Tool</h3><p class="muted">Neue Tools kommen als Modul in <code>js/tools/</code> dazu.</p></div>
      </div>
    </section>`;

  view.querySelector('#quick').addEventListener('submit', (e) => {
    e.preventDefault();
    const input = e.target.q;
    const title = input.value.trim();
    if (!title) return;
    tools.find((t) => t.id === 'ideas').quickAdd(title);
    input.value = '';
  });
}

function route() {
  const hash = location.hash.replace(/^#\/?/, '');
  const [toolId, ...rest] = hash.split('/').map(decodeURIComponent);
  const tool = tools.find((t) => t.id === toolId);
  renderNav(tool?.id);
  if (!tool) { renderHome(); document.title = 'Mats Hub'; return; }
  document.title = `${tool.name} · Mats Hub`;
  tool.render(view, rest);
}

window.addEventListener('hashchange', () => { route(); window.scrollTo(0, 0); });
// Bei Datenänderungen aktuelle Ansicht neu zeichnen und den Eingabefokus danach wiederherstellen.
function focusKey(el) {
  if (!el || !view.contains(el) || !el.matches('input, textarea, select')) return null;
  if (el.name) return `[name="${el.name}"]`;
  const attr = [...el.attributes].find((a) => a.name.startsWith('data-'));
  return attr ? `[${attr.name}]` : null;
}
store.subscribe(() => {
  const a = document.activeElement;
  const key = focusKey(a);
  const sel = key && a.selectionStart != null ? [a.selectionStart, a.selectionEnd] : null;
  route();
  if (!key) return;
  const el = view.querySelector(key);
  if (!el) return;
  el.focus();
  if (sel && el.value != null) try { el.setSelectionRange(...sel); } catch { /* nicht jedes Feld unterstützt das */ }
});
route();

if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
  navigator.serviceWorker.register('sw.js').catch(() => {});
}
