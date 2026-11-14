// Tool 3: Projekte – die Startrampe zu allem, was schon umgesetzt ist (und was gerade entsteht).
import { esc, fmtDate, richText } from '../ui.js';
import { ideas, progress } from './ideas-model.js';
import { openIdeaEditor } from './idea-editor.js';

const host = (url) => { try { return new URL(url).host; } catch { return url; } };
const repoUrl = (r) => (!r ? '' : /^https?:\/\//.test(r) ? r : r.startsWith('github.com') ? `https://${r}` : '');

function card(i) {
  const p = progress(i);
  const repo = repoUrl(i.repo);
  return `
    <article class="card project" data-id="${i.id}">
      <div class="row between top">
        <h3>${esc(i.title)}</h3>
        ${i.status === 'active' ? '<span class="badge st-active">🔨 In Arbeit</span>' : ''}
      </div>
      ${i.description ? `<div class="desc">${richText(i.description.split('\n')[0])}</div>` : ''}
      ${i.status === 'active' && p ? `<div class="progress"><span style="width:${p.pct}%"></span></div>` : ''}
      <div class="row wrap">
        ${i.link ? `<a class="btn primary" href="${esc(i.link)}" target="_blank" rel="noopener">Öffnen ↗</a>` : ''}
        ${repo ? `<a class="btn ghost" href="${esc(repo)}" target="_blank" rel="noopener">Code</a>` : ''}
        <button class="btn ghost" data-edit>Details</button>
      </div>
      <div class="muted small">
        ${i.link ? esc(host(i.link)) + ' · ' : ''}${i.doneAt ? `fertig seit ${fmtDate(i.doneAt)}` : esc(i.category || '')}
      </div>
    </article>`;
}

export default {
  id: 'projects',
  name: 'Projekte',
  icon: '🚀',
  description: 'Alle umgesetzten Projekte & Tools – mit direktem Link zum Öffnen.',
  render(view) {
    const done = ideas().filter((i) => i.status === 'done')
      .sort((a, b) => (b.doneAt || '').localeCompare(a.doneAt || ''));
    const active = ideas().filter((i) => i.status === 'active');

    view.innerHTML = `
      <div class="page-head">
        <div>
          <h1>🚀 Projekte</h1>
          <p class="muted">Was aus deinen Ideen geworden ist. Trag bei einer Idee einen Link ein und setze sie auf „Umgesetzt“ – dann erscheint sie hier.</p>
        </div>
      </div>
      ${active.length ? `<h2 class="section">🔨 Gerade in Arbeit</h2><div class="grid ideas">${active.map(card).join('')}</div>` : ''}
      <h2 class="section">✅ Umgesetzt</h2>
      ${done.length ? `<div class="grid ideas">${done.map(card).join('')}</div>` : `
        <div class="empty">
          <div class="big">🚀</div>
          <h3>Noch nichts umgesetzt – aber das kommt!</h3>
          <p class="muted">Der Mats Hub selbst ist ein guter erster Kandidat. 😉</p>
        </div>`}`;

    view.querySelectorAll('[data-edit]').forEach((b) => {
      b.onclick = () => openIdeaEditor(b.closest('.project').dataset.id);
    });
  },
  stats() {
    const done = ideas().filter((i) => i.status === 'done').length;
    return [`${done} umgesetzt`];
  },
};
