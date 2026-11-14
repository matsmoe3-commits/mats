// App-Kern: Router, Navigation und Startseite.
import { store } from './store.js';
import { esc } from './ui.js';
import { tools } from './tools/index.js';

const view = document.getElementById('view');
const nav = document.getElementById('nav');

function renderHome() {
  view.innerHTML = `
    <h1>Hub</h1>
    <p class="lead">Ideen, Roadmap und eigene Tools an einem Ort.</p>
    <ul class="list">
      ${tools.filter((t) => t.count).map((t) => `
        <li><a class="row" href="#/${t.id}">
          <span><span class="row-title">${esc(t.name)}</span><span class="row-sub">${esc(t.description)}</span></span>
          <span class="row-meta">${t.count()}</span>
        </a></li>`).join('')}
    </ul>`;
}

function route() {
  const [id, ...rest] = location.hash.replace(/^#\/?/, '').split('/').map(decodeURIComponent);
  const tool = tools.find((t) => t.id === id);
  nav.innerHTML = tools.map((t) =>
    `<a href="#/${t.id}" ${tool === t ? 'aria-current="page"' : ''}>${esc(t.name)}</a>`).join('');
  document.title = tool ? `${tool.name} – Hub` : 'Hub';
  if (tool) tool.render(view, rest); else renderHome();
}

// Nach Datenänderungen neu zeichnen und den Fokus im gleichen Feld halten.
store.subscribe(() => {
  const name = view.contains(document.activeElement) ? document.activeElement.name : null;
  route();
  if (name) view.querySelector(`[name="${name}"]`)?.focus();
});
window.addEventListener('hashchange', () => { route(); window.scrollTo(0, 0); });
route();

if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
  navigator.serviceWorker.register('sw.js').catch(() => {});
}
