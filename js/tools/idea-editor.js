// Bearbeitungsdialog für eine Idee – inklusive optionaler Roadmap (Zielquartal + Meilensteine).
import { esc, modal, toast, confirmDialog, fmtDate } from '../ui.js';
import { store } from '../store.js';
import {
  COLLECTION, STATUSES, EFFORTS, categories, allTags, getIdea, newIdea, saveIdea,
  newMilestone, upcomingQuarters, quarterLabel, score,
} from './ideas-model.js';

const stars = (name, value, max = 5) => `
  <div class="stars" data-stars="${name}">
    ${Array.from({ length: max }, (_, i) => `<button type="button" class="${i < value ? 'on' : ''}" data-v="${i + 1}" aria-label="${i + 1}">●</button>`).join('')}
    <input type="hidden" name="${name}" value="${value || 0}">
  </div>`;

export function openIdeaEditor(id, preset = {}) {
  const existing = id ? getIdea(id) : null;
  const idea = structuredClone(existing || newIdea(preset));
  idea.roadmap ||= { enabled: false, target: '', milestones: [] };
  idea.roadmap.milestones ||= [];

  const quarters = upcomingQuarters(10);
  if (idea.roadmap.target && !quarters.includes(idea.roadmap.target)) quarters.unshift(idea.roadmap.target);

  modal(`
    <form class="editor" data-keep-focus>
      <div class="row between">
        <h2>${existing ? 'Idee bearbeiten' : 'Neue Idee'}</h2>
        <button type="button" class="btn icon ghost" data-close-btn aria-label="Schließen">✕</button>
      </div>

      <label>Titel
        <input name="title" required value="${esc(idea.title)}" placeholder="Worum geht's in einem Satz?">
      </label>

      <label>Beschreibung / Gedanken
        <textarea name="description" rows="5" placeholder="Was ist das Problem? Wie könnte die Lösung aussehen? (- Listen, **fett** und Links funktionieren)">${esc(idea.description)}</textarea>
      </label>

      <div class="cols">
        <label>Status
          <select name="status">
            ${STATUSES.map((s) => `<option value="${s.id}" ${idea.status === s.id ? 'selected' : ''}>${s.icon} ${s.label}</option>`).join('')}
          </select>
          <small class="muted" data-status-hint></small>
        </label>
        <label>Kategorie
          <input name="category" list="cat-list" value="${esc(idea.category)}" placeholder="z. B. App / Tool">
          <datalist id="cat-list">${categories().map((c) => `<option value="${esc(c)}">`).join('')}</datalist>
        </label>
      </div>

      <label>Tags <small class="muted">(mit Komma trennen)</small>
        <input name="tags" list="tag-list" value="${esc((idea.tags || []).join(', '))}" placeholder="z. B. ki, haushalt, fitness">
        <datalist id="tag-list">${allTags().map((t) => `<option value="${esc(t)}">`).join('')}</datalist>
      </label>

      <fieldset class="rating">
        <legend>Bewertung <small class="muted">– hilft bei der Entscheidung, was umgesetzt wird</small></legend>
        <div class="cols three">
          <div><span class="lbl">Nutzen</span>${stars('impact', idea.impact)}</div>
          <div><span class="lbl">Lust / Spaß</span>${stars('fun', idea.fun)}</div>
          <label class="lbl">Aufwand
            <select name="effort">
              <option value="">–</option>
              ${EFFORTS.map((e) => `<option value="${e.id}" ${idea.effort === e.id ? 'selected' : ''}>${e.label}</option>`).join('')}
            </select>
          </label>
        </div>
        <div class="score-line muted">Score: <strong data-score>–</strong></div>
      </fieldset>

      <fieldset class="roadmap-box">
        <legend>
          <label class="switch"><input type="checkbox" name="rm_enabled" ${idea.roadmap.enabled ? 'checked' : ''}> Auf die Roadmap</label>
        </legend>
        <div data-rm-body ${idea.roadmap.enabled ? '' : 'hidden'}>
          <label>Ziel-Quartal
            <select name="rm_target">
              <option value="">Irgendwann</option>
              ${quarters.map((q) => `<option value="${q}" ${idea.roadmap.target === q ? 'selected' : ''}>${quarterLabel(q)}</option>`).join('')}
            </select>
          </label>
          <div class="lbl">Meilensteine / nächste Schritte</div>
          <ul class="milestones" data-ms></ul>
          <div class="row">
            <input data-ms-new placeholder="Neuer Schritt… (Enter)">
            <button type="button" class="btn" data-ms-add>+</button>
          </div>
        </div>
      </fieldset>

      <div class="cols">
        <label>Link (wenn umgesetzt: wo läuft es?)
          <input name="link" type="url" value="${esc(idea.link)}" placeholder="https://…">
        </label>
        <label>Code / Repo
          <input name="repo" value="${esc(idea.repo)}" placeholder="github.com/… oder Pfad">
        </label>
      </div>

      ${existing ? `<p class="muted small">Erstellt ${fmtDate(existing.createdAt)} · zuletzt geändert ${fmtDate(existing.updatedAt)}</p>` : ''}

      <div class="row between">
        <div>${existing ? '<button type="button" class="btn danger ghost" data-delete>Löschen</button>' : ''}</div>
        <div class="row">
          <button type="button" class="btn ghost" data-close-btn>Abbrechen</button>
          <button class="btn primary">Speichern</button>
        </div>
      </div>
    </form>`, {
    wide: true,
    onMount(el, close) {
      const form = el.querySelector('form');
      const msList = el.querySelector('[data-ms]');
      const statusHint = el.querySelector('[data-status-hint]');
      const rmBox = el.querySelector('[data-rm-body]');

      const updateHint = () => {
        statusHint.textContent = STATUSES.find((s) => s.id === form.status.value)?.hint || '';
      };
      const updateScore = () => {
        const s = score({ impact: form.impact.value, fun: form.fun.value, effort: form.effort.value });
        el.querySelector('[data-score]').textContent = s == null ? '–' : `${s} / 100`;
      };
      const renderMs = () => {
        msList.innerHTML = idea.roadmap.milestones.map((m, i) => `
          <li data-i="${i}" class="${m.done ? 'done' : ''}">
            <label class="check"><input type="checkbox" ${m.done ? 'checked' : ''} data-ms-toggle> <span>${esc(m.title)}</span></label>
            <span class="ms-actions">
              <button type="button" class="btn icon ghost" data-ms-up title="Nach oben">↑</button>
              <button type="button" class="btn icon ghost" data-ms-del title="Entfernen">✕</button>
            </span>
          </li>`).join('') || '<li class="muted empty-ms">Noch keine Schritte.</li>';
      };

      updateHint(); updateScore(); renderMs();

      form.status.addEventListener('change', () => {
        updateHint();
        if (['planned', 'active'].includes(form.status.value) && !form.rm_enabled.checked) {
          form.rm_enabled.checked = true;
          rmBox.hidden = false;
        }
      });
      form.effort.addEventListener('change', updateScore);
      form.rm_enabled.addEventListener('change', () => { rmBox.hidden = !form.rm_enabled.checked; });

      el.querySelectorAll('[data-stars]').forEach((box) => {
        const input = box.querySelector('input');
        box.addEventListener('click', (e) => {
          const b = e.target.closest('button');
          if (!b) return;
          const v = Number(b.dataset.v);
          input.value = Number(input.value) === v ? 0 : v; // erneut klicken = zurücksetzen
          box.querySelectorAll('button').forEach((x, i) => x.classList.toggle('on', i < input.value));
          updateScore();
        });
      });

      const msInput = el.querySelector('[data-ms-new]');
      const addMs = () => {
        const t = msInput.value.trim();
        if (!t) return;
        idea.roadmap.milestones.push(newMilestone(t));
        msInput.value = '';
        renderMs();
        msInput.focus();
      };
      el.querySelector('[data-ms-add]').onclick = addMs;
      msInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); addMs(); } });
      msList.addEventListener('click', (e) => {
        const li = e.target.closest('li[data-i]');
        if (!li) return;
        const i = Number(li.dataset.i);
        const ms = idea.roadmap.milestones;
        if (e.target.closest('[data-ms-del]')) { ms.splice(i, 1); renderMs(); }
        else if (e.target.closest('[data-ms-up]') && i > 0) { [ms[i - 1], ms[i]] = [ms[i], ms[i - 1]]; renderMs(); }
      });
      msList.addEventListener('change', (e) => {
        if (!e.target.matches('[data-ms-toggle]')) return;
        const i = Number(e.target.closest('li').dataset.i);
        idea.roadmap.milestones[i].done = e.target.checked;
        renderMs();
      });

      el.querySelector('[data-delete]')?.addEventListener('click', async () => {
        close();
        if (await confirmDialog(`„${idea.title}“ wirklich löschen? (Tipp: „Verworfen“ behält die Idee als Erinnerung.)`)) {
          store.remove(COLLECTION, idea.id);
          toast('Idee gelöscht');
        }
      });

      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const f = form;
        const saved = saveIdea({
          ...idea,
          title: f.title.value.trim(),
          description: f.description.value.trim(),
          status: f.status.value,
          category: f.category.value.trim(),
          tags: f.tags.value.split(',').map((t) => t.trim().toLowerCase()).filter(Boolean),
          impact: Number(f.impact.value),
          fun: Number(f.fun.value),
          effort: f.effort.value,
          link: f.link.value.trim(),
          repo: f.repo.value.trim(),
          roadmap: { ...idea.roadmap, enabled: f.rm_enabled.checked, target: f.rm_target.value },
        });
        close();
        toast(existing ? 'Gespeichert' : `„${saved.title}“ gespeichert`);
      });
    },
  });
}
