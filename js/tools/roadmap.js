// Roadmap: nur die Ideen, die umgesetzt werden sollen – mit ihren Schritten.
import { esc } from '../ui.js';
import { icons } from '../icons.js';
import { byStatus, get, save, openEditor, progress } from '../ideas.js';

// Reihenfolge per "rank" (kleiner = weiter oben), sonst nach Erstellungsdatum.
const planned = () => byStatus('planned')
  .sort((a, b) => (a.rank ?? Infinity) - (b.rank ?? Infinity) || a.createdAt.localeCompare(b.createdAt));

function moveUp(id) {
  const list = planned();
  const n = list.findIndex((i) => i.id === id);
  if (n < 1) return;
  [list[n - 1], list[n]] = [list[n], list[n - 1]];
  list.forEach((i, rank) => { if (i.rank !== rank) save({ ...i, rank }); });
}

export default {
  id: 'roadmap',
  name: 'Roadmap',
  icon: icons.roadmap,
  description: 'Was umgesetzt werden soll, in Reihenfolge.',
  count: () => byStatus('planned').length,
  render(view) {
    const list = planned();
    view.innerHTML = `
      <h1>Roadmap</h1>
      <p class="lead">Nur Ideen mit dem Status „Geplant“. Alles andere darf einfach Idee bleiben.</p>
      ${list.length ? `<ol class="roadmap">${list.map((i, n) => `
        <li data-id="${i.id}">
          <div class="rm-head">
            <button class="rm-title" data-open>${esc(i.title)}</button>
            <span class="row-meta">${progress(i)}</span>
            ${n > 0 ? '<button class="btn-text" data-up>Nach oben</button>' : ''}
          </div>
          ${i.steps.length ? `<ul class="steps">${i.steps.map((s) => `
            <li><label><input type="checkbox" data-step="${s.id}" ${s.done ? 'checked' : ''}><span>${esc(s.title)}</span></label></li>`).join('')}
          </ul>` : ''}
        </li>`).join('')}</ol>`
        : '<p class="empty">Noch nichts geplant. Setze bei einer Idee den Status auf „Geplant“.</p>'}`;

    view.querySelector('.roadmap')?.addEventListener('click', (e) => {
      const id = e.target.closest('[data-id]')?.dataset.id;
      if (!id) return;
      if (e.target.closest('[data-open]')) openEditor(id);
      if (e.target.closest('[data-up]')) moveUp(id);
    });
    view.querySelector('.roadmap')?.addEventListener('change', (e) => {
      const stepId = e.target.dataset.step;
      if (!stepId) return;
      const idea = get(e.target.closest('[data-id]').dataset.id);
      save({ ...idea, steps: idea.steps.map((s) => (s.id === stepId ? { ...s, done: e.target.checked } : s)) });
    });
  },
};
