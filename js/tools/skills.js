// Skill-Agent: sagt zu einer Aufgabe, welche Skills, Plugins und Anbindungen am besten passen.
// Läuft komplett lokal über den Katalog in js/skills-data.js.
import { esc } from '../ui.js';
import { icons } from '../icons.js';
import { all as allIdeas } from '../ideas.js';
import { SKILLS, CATEGORIES, searchSkills, skillsForIdea } from '../skills-data.js';

const KIND = { skill: 'Skill', plugin: 'Plugin', mcp: 'Anbindung', tool: 'Werkzeug' };
const state = { q: '', tab: 'ideas', open: null, expanded: new Set() };
const SHOW = 5; // pro Idee zuerst nur die wichtigsten

function row(s, why = []) {
  const open = state.open === s.id;
  return `
    <li class="skill ${open ? 'open' : ''}">
      <button class="row" data-skill="${s.id}" aria-expanded="${open}">
        <span class="grow">
          <span class="row-title">${esc(s.name)}</span>
          <span class="row-sub">${esc(s.de)}</span>
        </span>
        <span class="row-meta">${KIND[s.kind]}${s.trust === 'offiziell' ? ' · <span class="official">offiziell</span>' : ''}${s.note ? ' · <span class="caution">Hinweis</span>' : ''}</span>
      </button>
      ${open ? `
        <div class="skill-detail">
          <p><span class="label">Wann</span>${esc(s.when)}</p>
          ${why.length ? `<p><span class="label">Passt wegen</span>${why.map(esc).join(', ')}</p>` : ''}
          ${s.note ? `<p class="caution-box">${esc(s.note)}</p>` : ''}
          <p><span class="label">Quelle</span><a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.source)}</a></p>
        </div>` : ''}
    </li>`;
}

function renderResults(el) {
  if (state.q.trim()) {
    const res = searchSkills(state.q);
    el.innerHTML = res.length
      ? `<p class="hint">Am besten passend, oben zuerst</p><ul class="list">${res.map((r) => row(r.skill, r.why)).join('')}</ul>`
      : '<p class="empty">Dazu kenne ich noch nichts Passendes. Versuch andere Wörter, oder es ist ein Fall für den Skill Creator.</p>';
    return;
  }
  if (state.tab === 'ideas') {
    const ideas = allIdeas().filter((i) => i.status !== 'done')
      .map((i) => ({ idea: i, skills: skillsForIdea(i.id) }))
      .filter((x) => x.skills.length);
    el.innerHTML = ideas.length ? ideas.map(({ idea, skills }) => {
      // Offizielle zuerst, dann in Katalog-Reihenfolge
      const sorted = [...skills].sort((a, b) => (a.trust === 'offiziell' ? 0 : 1) - (b.trust === 'offiziell' ? 0 : 1));
      const all = state.expanded.has(idea.id);
      const shown = all ? sorted : sorted.slice(0, SHOW);
      return `
      <section class="skill-group">
        <h2>${esc(idea.title)}</h2>
        <ul class="list">${shown.map((s) => row(s)).join('')}</ul>
        ${sorted.length > SHOW ? `<button class="btn-text more" data-more="${esc(idea.id)}">${all ? 'Weniger zeigen' : `Alle ${sorted.length} zeigen`}</button>` : ''}
      </section>`;
    }).join('') : '<p class="empty">Keine passenden Ideen gefunden.</p>';
    return;
  }
  el.innerHTML = CATEGORIES.map((c) => `
    <section class="skill-group">
      <h2>${esc(c)}</h2>
      <ul class="list">${SKILLS.filter((s) => s.category === c).map((s) => row(s)).join('')}</ul>
    </section>`).join('');
}

export default {
  id: 'skills',
  name: 'Skills',
  icon: icons.skills,
  description: 'Welche Skills für welche Aufgabe am besten passen.',
  count: () => SKILLS.length,
  render(view) {
    view.innerHTML = `
      <h1>Skills</h1>
      <form class="add" data-search-form>
        <input name="q" type="search" value="${esc(state.q)}" placeholder="Was willst du machen? Zum Beispiel: Termine in den iCloud-Kalender eintragen" autocomplete="off">
      </form>
      <div class="filterbar" data-tabs ${state.q.trim() ? 'hidden' : ''}>
        <nav class="tabs">
          <button data-tab="ideas" class="${state.tab === 'ideas' ? 'on' : ''}">Für deine Ideen</button>
          <button data-tab="all" class="${state.tab === 'all' ? 'on' : ''}">Alle <span>${SKILLS.length}</span></button>
        </nav>
      </div>
      <div data-results></div>
      <p class="hint skills-source">${SKILLS.length} ausgewählte Einträge aus anthropics/skills, den offiziellen Claude-Code-Plugins, obra/superpowers und zwei kuratierten Listen, ergänzt um Anbindungen für deine Ideen. Stand November 2026.</p>`;

    const results = view.querySelector('[data-results]');
    const tabs = view.querySelector('[data-tabs]');
    renderResults(results);

    const input = view.querySelector('[name=q]');
    input.addEventListener('input', () => {
      state.q = input.value;
      state.open = null;
      tabs.hidden = !!state.q.trim();
      renderResults(results);
    });
    view.querySelector('[data-search-form]').addEventListener('submit', (e) => e.preventDefault());
    view.querySelectorAll('[data-tab]').forEach((b) => {
      b.onclick = () => { state.tab = b.dataset.tab; state.open = null; this.render(view); };
    });
    results.addEventListener('click', (e) => {
      const more = e.target.closest('[data-more]');
      if (more) {
        const id = more.dataset.more;
        if (state.expanded.has(id)) state.expanded.delete(id); else state.expanded.add(id);
        renderResults(results);
        return;
      }
      const b = e.target.closest('[data-skill]');
      if (!b) return;
      state.open = state.open === b.dataset.skill ? null : b.dataset.skill;
      renderResults(results);
    });
  },
};
