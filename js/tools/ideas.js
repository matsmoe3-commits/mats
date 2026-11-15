// Ideen: alles festhalten, später entscheiden.
import { esc } from '../ui.js';
import { icons } from '../icons.js';
import { all, add, openEditor, STATUS, progress, get } from '../ideas.js';

const state = { q: '', filter: 'all' };

function rows() {
  const q = state.q.toLowerCase();
  return all()
    .filter((i) => state.filter === 'all' || i.status === state.filter)
    .filter((i) => !q || `${i.title} ${i.notes}`.toLowerCase().includes(q))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

function renderList(el) {
  const list = rows();
  if (!all().length) {
    el.innerHTML = '<p class="empty">Noch keine Ideen. Schreib oben die erste auf.</p>';
    return;
  }
  el.innerHTML = list.length
    ? `<ul class="list">${list.map((i) => `
        <li><button class="row" data-id="${i.id}">
          <span class="row-title">${esc(i.title)}</span>
          <span class="row-meta">${progress(i) ? `${progress(i)} · ` : ''}${STATUS[i.status]}</span>
        </button></li>`).join('')}</ul>`
    : '<p class="empty">Nichts gefunden.</p>';
}

export default {
  id: 'ideas',
  name: 'Ideen',
  icon: icons.ideas,
  description: 'Gedanken zu zukünftigen Projekten sammeln.',
  count: () => all().length,
  render(view, [id]) {
    if (id && get(id)) {
      history.replaceState(null, '', '#/ideas'); // sonst öffnet jedes Neuzeichnen den Dialog erneut
      setTimeout(() => openEditor(id));
    }
    const counts = { all: all().length };
    for (const k of Object.keys(STATUS)) counts[k] = all().filter((i) => i.status === k).length;

    view.innerHTML = `
      <h1>Ideen</h1>
      <form class="add" data-add>
        <input name="title" placeholder="Neue Idee" autocomplete="off">
        <button class="btn">Hinzufügen</button>
      </form>
      <div class="filterbar">
        <nav class="tabs">
          ${[['all', 'Alle'], ...Object.entries(STATUS)].map(([k, v]) =>
            `<button data-filter="${k}" class="${state.filter === k ? 'on' : ''}">${v} <span>${counts[k]}</span></button>`).join('')}
        </nav>
        <input type="search" name="search" placeholder="Suchen" value="${esc(state.q)}">
      </div>
      <div data-list></div>`;

    const listEl = view.querySelector('[data-list]');
    renderList(listEl);

    view.querySelector('[data-add]').addEventListener('submit', (e) => {
      e.preventDefault();
      const t = e.target.title.value.trim();
      if (t) add(t);
    });
    view.querySelector('[name=search]').addEventListener('input', (e) => { state.q = e.target.value; renderList(listEl); });
    view.querySelectorAll('[data-filter]').forEach((b) => {
      b.onclick = () => { state.filter = b.dataset.filter; this.render(view, []); };
    });
    listEl.addEventListener('click', (e) => {
      const r = e.target.closest('[data-id]');
      if (r) openEditor(r.dataset.id);
    });
  },
};
