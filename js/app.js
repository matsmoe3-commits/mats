// App-Kern: Kopfzeile, Startseite mit runden Icons und Router.
import { store } from './store.js';
import { esc } from './ui.js';
import { icons, logo } from './icons.js';
import { tools } from './tools/index.js';
import { byStatus } from './ideas.js';
import { applySeed } from './seed.js';

const header = document.getElementById('header');
const view = document.getElementById('view');

// Filter der Startseite: alle Kacheln, nur fertige Tools oder nur geplante Vorhaben.
const FILTERS = { all: 'Alle', tools: 'Tools', planned: 'Geplant' };
const ui = { filterOpen: false };
const filter = () => store.setting('home.filter', 'all');

function renderHeader(tool) {
  const home = !tool;
  header.innerHTML = `
    <div class="header-bar">
      <a href="#/" class="brand">${logo}<span>Mats Hub</span></a>
      <div class="header-actions">
        ${home ? `<button class="pill-btn ${ui.filterOpen || filter() !== 'all' ? 'on' : ''}" data-filter-toggle aria-expanded="${ui.filterOpen}">
          ${icons.filter}<span>${filter() === 'all' ? 'Filter' : FILTERS[filter()]}</span></button>` : ''}
        <a href="#/settings" class="pill-btn icon-only ${tool?.id === 'settings' ? 'on' : ''}" aria-label="Einstellungen" title="Einstellungen">${icons.settings}</a>
      </div>
    </div>
    ${home && ui.filterOpen ? `
      <div class="filter-row" role="radiogroup" aria-label="Filter">
        ${Object.entries(FILTERS).map(([k, v]) =>
          `<button class="pill ${filter() === k ? 'on' : ''}" data-filter="${k}" role="radio" aria-checked="${filter() === k}">${v}</button>`).join('')}
      </div>` : ''}
    ${tool ? `<nav class="crumbs"><a href="#/">Übersicht</a><span>/</span><span>${esc(tool.name)}</span></nav>` : ''}`;

  header.querySelector('[data-filter-toggle]')?.addEventListener('click', () => { ui.filterOpen = !ui.filterOpen; route(); });
  header.querySelectorAll('[data-filter]').forEach((b) => {
    b.onclick = () => store.setSetting('home.filter', b.dataset.filter);
  });
}

const initials = (title) => title.split(/\s+/).filter((w) => /^[\p{L}\d]/u.test(w)).slice(0, 2).map((w) => w[0].toUpperCase()).join('');

function renderHome() {
  const f = filter();
  const toolTiles = tools.filter((t) => t.id !== 'settings').map((t) => ({
    href: `#/${t.id}`, label: t.name, sub: t.count ? String(t.count()) : '', icon: t.icon,
  }));
  // Geplante Vorhaben erscheinen als „leere“ Kreise – Tools, die es noch nicht gibt.
  const plannedTiles = byStatus('planned').map((i) => ({
    href: `#/ideas/${encodeURIComponent(i.id)}`, label: i.title, sub: 'Geplant', text: initials(i.title), planned: true,
  }));
  const tiles = f === 'tools' ? toolTiles : f === 'planned' ? plannedTiles : [...toolTiles, ...plannedTiles];

  view.innerHTML = tiles.length ? `
    <ul class="launcher">
      ${tiles.map((t) => `
        <li><a class="tile ${t.planned ? 'planned' : ''}" href="${t.href}">
          <span class="circle">${t.icon || `<span class="initials">${esc(t.text)}</span>`}</span>
          <span class="tile-label">${esc(t.label)}</span>
          ${t.sub ? `<span class="tile-sub">${esc(t.sub)}</span>` : ''}
        </a></li>`).join('')}
    </ul>` : '<p class="empty center">Nichts in dieser Ansicht.</p>';
}

function route() {
  const [id, ...rest] = location.hash.replace(/^#\/?/, '').split('/').map(decodeURIComponent);
  const tool = tools.find((t) => t.id === id);
  renderHeader(tool);
  document.title = tool ? `${tool.name} · Mats Hub` : 'Mats Hub';
  if (tool) tool.render(view, rest); else renderHome();
}

// Nach Datenänderungen neu zeichnen und den Fokus im gleichen Feld halten.
store.subscribe(() => {
  const name = view.contains(document.activeElement) ? document.activeElement.name : null;
  route();
  if (name) view.querySelector(`[name="${name}"]`)?.focus();
});
window.addEventListener('hashchange', () => { ui.filterOpen = false; route(); window.scrollTo(0, 0); });

applySeed();
route();

if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
  navigator.serviceWorker.register('sw.js').catch(() => {});
}
