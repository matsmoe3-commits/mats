// Projekte: alles, was umgesetzt ist – mit Link zum Öffnen.
import { esc, fmtDate } from '../ui.js';
import { icons } from '../icons.js';
import { byStatus, openEditor } from '../ideas.js';

export default {
  id: 'projects',
  name: 'Projekte',
  icon: icons.projects,
  description: 'Umgesetzte Projekte und Tools.',
  count: () => byStatus('done').length,
  render(view) {
    const list = byStatus('done').sort((a, b) => (b.doneAt || '').localeCompare(a.doneAt || ''));
    view.innerHTML = `
      <h1>Projekte</h1>
      ${list.length ? `<ul class="list">${list.map((i) => `
        <li><div class="row">
          <button class="row-title" data-id="${i.id}">${esc(i.title)}</button>
          <span class="row-meta">${fmtDate(i.doneAt)}</span>
          ${i.link ? `<a class="btn-text" href="${esc(i.link)}" ${/^https?:/.test(i.link) ? 'target="_blank" rel="noopener"' : ''}>Öffnen</a>` : ''}
        </div></li>`).join('')}</ul>`
        : '<p class="empty">Noch nichts fertig.</p>'}`;
    view.querySelectorAll('[data-id]').forEach((b) => { b.onclick = () => openEditor(b.dataset.id); });
  },
};
