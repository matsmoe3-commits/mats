// Stadt (Prototyp): die Tools des Hubs als 3D-Gebäude.
// Three.js wird erst geladen, wenn die Stadt geöffnet wird – die übrigen Seiten bleiben schnell.
import { icons } from '../icons.js';
import { byStatus } from '../ideas.js';
import { esc } from '../ui.js';

// Welches Tool welches Gebäude bekommt (Vorschlag aus der Idee „Startseite als Stadt“).
const KIND = { contacts: 'tower', ideas: 'workshop', roadmap: 'townhall', projects: 'museum' };

let night = new Date().getHours() >= 18 || new Date().getHours() < 7;
let city = null;

async function buildingsFrom() {
  const { tools } = await import('./index.js'); // erst hier, sonst zirkulärer Import
  const planned = byStatus('planned');
  // Geplante Vorhaben, die zu einem bestehenden Tool gehören (Link „#/contacts“), werden ein Kran am Gebäude.
  const extending = new Set(planned.map((i) => i.link?.match(/^#\/(\w+)/)?.[1]).filter(Boolean));
  const list = tools.filter((t) => KIND[t.id]).map((t) => ({
    key: t.id,
    kind: KIND[t.id],
    label: esc(t.name),
    sub: extending.has(t.id) ? 'im Ausbau' : '',
    addCrane: extending.has(t.id),
  }));
  // Hochhaus zuerst, damit es zentral an der Kreuzung steht
  list.sort((a, b) => (a.kind === 'tower' ? -1 : 0) - (b.kind === 'tower' ? -1 : 0));
  for (const i of planned) {
    if (i.link?.startsWith('#/')) continue;
    list.push({ key: `idea:${i.id}`, kind: 'construction', label: esc(i.title), sub: 'Baustelle' });
  }
  return list;
}

export default {
  id: 'city',
  name: 'Stadt',
  icon: icons.city,
  description: 'Deine Tools als Stadt (Prototyp).',
  count: () => '3D',
  async render(view) {
    city?.dispose();
    view.innerHTML = `
      <div class="city" data-city>
        <div class="city-controls">
          <button class="pill-btn" data-night>${night ? 'Tag' : 'Abend'}</button>
          <a class="pill-btn" href="#/">Liste</a>
        </div>
        <p class="city-hint">Tippen holt ein Gebäude heran, nochmal tippen öffnet es.</p>
      </div>`;
    const el = view.querySelector('[data-city]');
    const buildings = await buildingsFrom();
    const { mountCity } = await import('../city/scene.js');
    if (!el.isConnected) return; // inzwischen weggeklickt
    city = mountCity(el, buildings, {
      night,
      onOpen: (key) => {
        location.hash = key.startsWith('idea:') ? `#/ideas/${encodeURIComponent(key.slice(5))}` : `#/${key}`;
      },
    });
    view.querySelector('[data-night]').onclick = (e) => {
      night = !night;
      city.setNight(night);
      e.currentTarget.textContent = night ? 'Tag' : 'Abend';
    };
  },
};
