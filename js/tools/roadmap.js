// Tool 2: Roadmap – nur die Ideen, die wirklich umgesetzt werden sollen, nach Quartal geordnet.
import { esc, toast } from '../ui.js';
import {
  ideas, saveIdea, progress, statusById, quarterOf, quarterLabel, getIdea,
} from './ideas-model.js';
import { openIdeaEditor } from './idea-editor.js';

const onRoadmap = () => ideas().filter((i) => i.roadmap?.enabled && i.status !== 'dropped');

function item(i) {
  const p = progress(i);
  const st = statusById[i.status];
  const next = (i.roadmap.milestones || []).find((m) => !m.done);
  const overdue = i.roadmap.target && i.roadmap.target < quarterOf() && i.status !== 'done';
  return `
    <article class="card rm-item st-border-${i.status}" data-id="${i.id}" tabindex="0">
      <div class="row between top">
        <h3>${esc(i.title)}</h3>
        <span class="badge st-${i.status}">${st.icon} ${st.label}</span>
      </div>
      ${overdue ? '<div class="warn small">⚠️ Zielquartal überschritten</div>' : ''}
      ${p ? `
        <div class="progress"><span style="width:${p.pct}%"></span></div>
        <div class="muted small">${p.done}/${p.total} Schritte · ${p.pct}%</div>` : ''}
      ${next ? `
        <label class="check next" data-next="${next.id}">
          <input type="checkbox"> <span>Nächster Schritt: <strong>${esc(next.title)}</strong></span>
        </label>` : (i.status !== 'done' ? '<div class="muted small">Noch keine Schritte geplant – klicken zum Ergänzen.</div>' : '')}
    </article>`;
}

function render(view) {
  const list = onRoadmap();
  const current = quarterOf();
  const groups = new Map();
  const open = list.filter((i) => i.status !== 'done');
  for (const i of open) {
    const key = i.roadmap.target && i.roadmap.target < current ? 'overdue' : (i.roadmap.target || 'later');
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(i);
  }
  const order = [...groups.keys()].sort((a, b) => {
    const rank = (k) => (k === 'overdue' ? '0' : k === 'later' ? '9' : `1${k}`);
    return rank(a).localeCompare(rank(b));
  });
  const title = (k) => (k === 'overdue' ? '⚠️ Überfällig' : k === 'later' ? '🌫️ Irgendwann' : k === current ? `📍 ${quarterLabel(k)} – jetzt` : quarterLabel(k));
  const done = list.filter((i) => i.status === 'done').sort((a, b) => (b.doneAt || '').localeCompare(a.doneAt || ''));
  const totalIdeas = ideas().length;

  view.innerHTML = `
    <div class="page-head">
      <div>
        <h1>🗺️ Roadmap</h1>
        <p class="muted">Nur was du wirklich umsetzen willst. ${totalIdeas ? `${open.length} von ${totalIdeas} Ideen sind eingeplant – der Rest darf in Ruhe reifen.` : ''}</p>
      </div>
    </div>
    ${!open.length ? `
      <div class="empty">
        <div class="big">🗺️</div>
        <h3>Noch nichts eingeplant</h3>
        <p class="muted">Setze eine Idee auf <strong>Geplant</strong> oder aktiviere „Auf die Roadmap“ – dann erscheint sie hier.</p>
        <a class="btn" href="#/ideas">Zu den Ideen</a>
      </div>` : `
      <div class="timeline">
        ${order.map((k) => `
          <section class="lane ${k === current ? 'now' : ''} ${k === 'overdue' ? 'overdue' : ''}">
            <h2>${title(k)} <span class="count">${groups.get(k).length}</span></h2>
            <div class="lane-items">${groups.get(k)
              .sort((a, b) => (a.status === 'active' ? -1 : 0) - (b.status === 'active' ? -1 : 0))
              .map(item).join('')}</div>
          </section>`).join('')}
      </div>`}
    ${done.length ? `
      <details class="done-box">
        <summary>✅ Umgesetzt (${done.length})</summary>
        <div class="lane-items">${done.map(item).join('')}</div>
      </details>` : ''}`;

  view.addEventListener('click', onClick);
}

function onClick(e) {
  const nextBox = e.target.closest('[data-next]');
  const card = e.target.closest('.rm-item');
  if (!card) return;
  if (nextBox) {
    if (!e.target.matches('input')) return; // nur echte Checkbox-Klicks zählen (Label-Klick löst sonst doppelt aus)
    const idea = getIdea(card.dataset.id);
    const ms = idea.roadmap.milestones.map((m) => (m.id === nextBox.dataset.next ? { ...m, done: true } : m));
    const allDone = ms.every((m) => m.done);
    saveIdea({ ...idea, status: idea.status === 'planned' ? 'active' : idea.status, roadmap: { ...idea.roadmap, milestones: ms } });
    toast(allDone ? '🎉 Alle Schritte erledigt – auf „Umgesetzt“ setzen?' : '✔️ Schritt erledigt');
    return;
  }
  openIdeaEditor(card.dataset.id);
}

export default {
  id: 'roadmap',
  name: 'Roadmap',
  icon: '🗺️',
  description: 'Die theoretische Roadmap – nur für Ideen, die wirklich umgesetzt werden sollen.',
  render(view) {
    view.removeEventListener('click', onClick);
    render(view);
  },
  stats() {
    const list = onRoadmap().filter((i) => i.status !== 'done');
    const active = list.filter((i) => i.status === 'active').length;
    return [`${list.length} eingeplant`, active ? `${active} in Arbeit` : null].filter(Boolean);
  },
};
