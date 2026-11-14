// Tool 1: Ideen-Speicher – alle Gedanken zu zukünftigen Projekten an einem Ort.
import { store } from '../store.js';
import { esc, toast, relTime, richText } from '../ui.js';
import {
  STATUSES, statusById, ideas, saveIdea, newIdea, categories, progress, score, getIdea, quarterLabel,
} from './ideas-model.js';
import { openIdeaEditor } from './idea-editor.js';

// UI-Zustand (Filter) bleibt während der Sitzung erhalten.
const state = {
  q: '',
  status: 'open',      // 'open' = alles außer umgesetzt/verworfen, 'all', oder eine Status-ID
  category: '',
  tag: '',
  sort: 'new',
};

const FILTERS = [
  { id: 'open', label: 'Offen' },
  ...STATUSES.map((s) => ({ id: s.id, label: `${s.icon} ${s.label}` })),
  { id: 'all', label: 'Alle' },
];

function filtered() {
  const q = state.q.toLowerCase();
  let list = ideas().filter((i) => {
    if (state.status === 'open' && ['done', 'dropped'].includes(i.status)) return false;
    if (!['open', 'all'].includes(state.status) && i.status !== state.status) return false;
    if (state.category && i.category !== state.category) return false;
    if (state.tag && !(i.tags || []).includes(state.tag)) return false;
    if (q) {
      const hay = [i.title, i.description, i.category, ...(i.tags || [])].join(' ').toLowerCase();
      if (!q.split(/\s+/).every((w) => hay.includes(w))) return false;
    }
    return true;
  });
  const by = {
    new: (a, b) => b.createdAt.localeCompare(a.createdAt),
    updated: (a, b) => b.updatedAt.localeCompare(a.updatedAt),
    score: (a, b) => (score(b) ?? -1) - (score(a) ?? -1),
    title: (a, b) => a.title.localeCompare(b.title),
  }[state.sort];
  return list.sort(by);
}

function badge(status) {
  const s = statusById[status] || statusById.inbox;
  return `<span class="badge st-${s.id}">${s.icon} ${s.label}</span>`;
}

function ideaCard(i, { draggable = false } = {}) {
  const p = progress(i);
  const sc = score(i);
  return `
    <article class="card idea" data-id="${i.id}" ${draggable ? 'draggable="true"' : ''} tabindex="0">
      <div class="row between top">
        <h3>${esc(i.title)}</h3>
        ${sc != null ? `<span class="score" title="Score: Nutzen & Spaß im Verhältnis zum Aufwand">${sc}</span>` : ''}
      </div>
      ${i.description ? `<div class="desc">${richText(i.description.length > 220 ? i.description.slice(0, 220) + '…' : i.description)}</div>` : ''}
      <div class="meta">
        ${draggable ? '' : badge(i.status)}
        ${i.category ? `<span class="chip">${esc(i.category)}</span>` : ''}
        ${(i.tags || []).map((t) => `<span class="chip tag" data-tag="${esc(t)}">#${esc(t)}</span>`).join('')}
        ${i.effort ? `<span class="chip" title="Aufwand">⏱ ${esc(i.effort)}</span>` : ''}
        ${i.roadmap?.enabled ? `<span class="chip" title="Roadmap">🗺️ ${quarterLabel(i.roadmap.target)}</span>` : ''}
      </div>
      ${p ? `<div class="progress" title="${p.done}/${p.total} Schritte"><span style="width:${p.pct}%"></span></div>` : ''}
      <div class="muted small">${relTime(i.createdAt)}</div>
    </article>`;
}

function renderList(container) {
  const list = filtered();
  if (!ideas().length) {
    container.innerHTML = `
      <div class="empty">
        <div class="big">💡</div>
        <h3>Noch keine Ideen gespeichert</h3>
        <p class="muted">Schreib oben einfach los – jeder Gedanke landet erstmal in der Inbox.<br>
        Später entscheidest du in Ruhe: parken, verwerfen oder auf die Roadmap.</p>
        <button class="btn" data-seed>Beispiel-Ideen laden</button>
      </div>`;
    return;
  }
  container.innerHTML = list.length
    ? `<div class="grid ideas">${list.map((i) => ideaCard(i)).join('')}</div>`
    : '<p class="muted center">Keine Ideen für diesen Filter.</p>';
}

function renderBoard(container) {
  const list = filtered();
  const cols = STATUSES.filter((s) => state.status === 'all' || state.status === s.id
    || (state.status === 'open' && !['done', 'dropped'].includes(s.id)));
  container.innerHTML = `
    <div class="board">
      ${cols.map((s) => {
        const items = list.filter((i) => i.status === s.id);
        return `
          <section class="column" data-status="${s.id}">
            <header><span>${s.icon} ${s.label}</span><span class="count">${items.length}</span></header>
            <p class="muted small hint">${s.hint}</p>
            <div class="drop">${items.map((i) => ideaCard(i, { draggable: true })).join('')}</div>
          </section>`;
      }).join('')}
    </div>`;

  // Drag & Drop zwischen den Spalten = Status ändern.
  container.querySelectorAll('.idea[draggable]').forEach((card) => {
    card.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('text/plain', card.dataset.id);
      card.classList.add('dragging');
    });
    card.addEventListener('dragend', () => card.classList.remove('dragging'));
  });
  container.querySelectorAll('.column').forEach((col) => {
    col.addEventListener('dragover', (e) => { e.preventDefault(); col.classList.add('over'); });
    col.addEventListener('dragleave', () => col.classList.remove('over'));
    col.addEventListener('drop', (e) => {
      e.preventDefault();
      col.classList.remove('over');
      const idea = getIdea(e.dataTransfer.getData('text/plain'));
      if (idea && idea.status !== col.dataset.status) {
        saveIdea({ ...idea, status: col.dataset.status });
        toast(`→ ${statusById[col.dataset.status].label}`);
      }
    });
  });
}

function render(view, parts) {
  // Direktlink auf eine Idee: #/ideas/<id>
  if (parts[0] && getIdea(parts[0])) {
    setTimeout(() => openIdeaEditor(parts[0]), 0);
    history.replaceState(null, '', '#/ideas');
  }
  const mode = store.setting('ideas.view', 'list');
  const counts = Object.fromEntries(STATUSES.map((s) => [s.id, ideas().filter((i) => i.status === s.id).length]));
  counts.open = ideas().filter((i) => !['done', 'dropped'].includes(i.status)).length;
  counts.all = ideas().length;
  const tags = [...new Set(ideas().flatMap((i) => i.tags || []))].sort();

  view.innerHTML = `
    <div class="page-head">
      <div>
        <h1>💡 Ideen</h1>
        <p class="muted">Alles festhalten – entscheiden kannst du später.</p>
      </div>
      <button class="btn primary" data-new>+ Neue Idee</button>
    </div>

    <form class="quick" data-quick data-keep-focus>
      <input name="q" placeholder="Schnell notieren… (Enter)" autocomplete="off">
      <button class="btn">In die Inbox</button>
    </form>

    <div class="toolbar" data-keep-focus>
      <input type="search" data-search placeholder="🔍 Suchen…" value="${esc(state.q)}">
      <select data-cat>
        <option value="">Alle Kategorien</option>
        ${categories().filter((c) => ideas().some((i) => i.category === c)).map((c) => `<option ${state.category === c ? 'selected' : ''}>${esc(c)}</option>`).join('')}
      </select>
      ${tags.length ? `<select data-tagsel>
        <option value="">Alle Tags</option>
        ${tags.map((t) => `<option value="${esc(t)}" ${state.tag === t ? 'selected' : ''}>#${esc(t)}</option>`).join('')}
      </select>` : ''}
      <select data-sort>
        <option value="new" ${state.sort === 'new' ? 'selected' : ''}>Neueste zuerst</option>
        <option value="updated" ${state.sort === 'updated' ? 'selected' : ''}>Zuletzt bearbeitet</option>
        <option value="score" ${state.sort === 'score' ? 'selected' : ''}>Höchster Score</option>
        <option value="title" ${state.sort === 'title' ? 'selected' : ''}>A–Z</option>
      </select>
      <div class="seg">
        <button data-mode="list" class="${mode === 'list' ? 'on' : ''}">Liste</button>
        <button data-mode="board" class="${mode === 'board' ? 'on' : ''}">Board</button>
      </div>
    </div>

    <div class="filters">
      ${FILTERS.map((f) => `<button class="pill ${state.status === f.id ? 'on' : ''}" data-filter="${f.id}">${f.label} <span>${counts[f.id] ?? 0}</span></button>`).join('')}
    </div>

    <div data-results></div>`;

  const results = view.querySelector('[data-results]');
  const draw = () => (mode === 'board' ? renderBoard(results) : renderList(results));
  draw();

  view.querySelector('[data-new]').onclick = () => openIdeaEditor(null);
  view.querySelector('[data-quick]').addEventListener('submit', (e) => {
    e.preventDefault();
    const t = e.target.q.value.trim();
    if (!t) return;
    e.target.q.value = '';
    tool.quickAdd(t);
    view.querySelector('[data-quick] input')?.focus();
  });
  const search = view.querySelector('[data-search]');
  search.addEventListener('input', () => { state.q = search.value; draw(); });
  view.querySelector('[data-cat]').onchange = (e) => { state.category = e.target.value; draw(); };
  const tagSel = view.querySelector('[data-tagsel]');
  if (tagSel) tagSel.onchange = (e) => { state.tag = e.target.value; draw(); };
  view.querySelector('[data-sort]').onchange = (e) => { state.sort = e.target.value; draw(); };
  view.querySelectorAll('[data-mode]').forEach((b) => (b.onclick = () => store.setSetting('ideas.view', b.dataset.mode)));
  view.querySelectorAll('[data-filter]').forEach((b) => (b.onclick = () => { state.status = b.dataset.filter; render(view, []); }));

  results.addEventListener('click', (e) => {
    if (e.target.closest('a')) return;
    const tag = e.target.closest('[data-tag]');
    if (tag) { state.tag = tag.dataset.tag; render(view, []); return; }
    if (e.target.closest('[data-seed]')) { seedExamples(); return; }
    const card = e.target.closest('.idea');
    if (card) openIdeaEditor(card.dataset.id);
  });
  results.addEventListener('keydown', (e) => {
    const card = e.target.closest('.idea');
    if (card && e.key === 'Enter') openIdeaEditor(card.dataset.id);
  });
}

export function seedExamples() {
  const ex = [
    newIdea({
      title: 'Mats Hub weiter ausbauen',
      description: 'Persönlicher Hub für alle meine Tools.\n- Ideen-Speicher ✅\n- Gewohnheiten-Tracker\n- Finanz-Überblick',
      category: 'App / Tool', tags: ['hub', 'meta'], status: 'active', impact: 5, fun: 5, effort: 'L',
      roadmap: { enabled: true, target: '', milestones: [
        { id: 'm1', title: 'Ideen-Speicher bauen', done: true },
        { id: 'm2', title: 'Auf GitHub Pages veröffentlichen', done: false },
        { id: 'm3', title: 'Zweites Tool planen', done: false },
      ] },
    }),
    newIdea({ title: 'Gewohnheiten-Tracker', description: 'Tägliche Gewohnheiten abhaken, Streaks sehen.', category: 'App / Tool', tags: ['gesundheit'], status: 'planned', impact: 4, fun: 3, effort: 'M' }),
    newIdea({ title: 'Automatische Rechnungsablage', description: 'Rechnungen aus dem Mail-Postfach automatisch in einen Ordner sortieren.', category: 'Automatisierung', tags: ['finanzen'], status: 'inbox', impact: 3, fun: 2, effort: 'M' }),
    newIdea({ title: 'Smarte Pflanzenbewässerung', description: 'Feuchtigkeitssensor + kleine Pumpe + ESP32.', category: 'Hardware / DIY', tags: ['iot'], status: 'parked', impact: 2, fun: 5, effort: 'L' }),
  ];
  ex.reverse().forEach((i) => saveIdea(i));
  toast('Beispiele geladen – kannst du jederzeit löschen');
}

const tool = {
  id: 'ideas',
  name: 'Ideen',
  icon: '💡',
  description: 'Alle Gedanken zu zukünftigen Projekten – sammeln, bewerten, entscheiden.',
  render,
  quickAdd(title) {
    saveIdea(newIdea({ title }));
    toast('💡 In der Inbox gespeichert');
  },
  stats() {
    const all = ideas();
    const inbox = all.filter((i) => i.status === 'inbox').length;
    return [`${all.length} Ideen`, inbox ? `${inbox} in der Inbox` : null].filter(Boolean);
  },
};
export default tool;
