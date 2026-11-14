// Datenmodell und Bearbeitungsdialog für Ideen.
// Eine Idee hat genau einen von drei Zuständen:
//   idea    – nur ein Gedanke, muss nie umgesetzt werden
//   planned – soll umgesetzt werden, steht auf der Roadmap
//   done    – umgesetzt, erscheint unter Projekte
import { store, uid } from './store.js';
import { esc, modal, toast, confirmDialog } from './ui.js';

const C = 'ideas';

export const STATUS = { idea: 'Idee', planned: 'Geplant', done: 'Fertig' };

// Ältere Datenstände (mehr Status, "roadmap.milestones") auf das einfache Modell abbilden.
const LEGACY = { inbox: 'idea', parked: 'idea', dropped: 'idea', active: 'planned' };
function normalize(i) {
  if (LEGACY[i.status]) i.status = LEGACY[i.status];
  if (!STATUS[i.status]) i.status = 'idea';
  if (!i.steps) i.steps = i.roadmap?.milestones || [];
  if (i.notes == null) i.notes = i.description || '';
  return i;
}

export const all = () => store.all(C).map(normalize);
export const get = (id) => { const i = store.get(C, id); return i && normalize(i); };
export const byStatus = (s) => all().filter((i) => i.status === s);

export function save(idea) {
  if (idea.status === 'done' && !idea.doneAt) idea.doneAt = new Date().toISOString();
  return store.upsert(C, idea);
}

export function add(title) {
  save({ title, notes: '', status: 'idea', steps: [], link: '' });
  toast('Gespeichert');
}

export function progress(i) {
  if (!i.steps.length) return '';
  return `${i.steps.filter((s) => s.done).length}/${i.steps.length}`;
}

export function openEditor(id) {
  const existing = id ? get(id) : null;
  const idea = structuredClone(existing || { title: '', notes: '', status: 'idea', steps: [], link: '' });

  modal(`
    <form class="editor">
      <input class="title-input" name="title" required value="${esc(idea.title)}" placeholder="Titel">
      <textarea name="notes" rows="6" placeholder="Notizen">${esc(idea.notes)}</textarea>

      <div class="field">
        <span class="label">Status</span>
        <div class="segmented" role="radiogroup">
          ${Object.entries(STATUS).map(([k, v]) => `
            <label><input type="radio" name="status" value="${k}" ${idea.status === k ? 'checked' : ''}><span>${v}</span></label>`).join('')}
        </div>
      </div>

      <div class="field" data-steps-field>
        <span class="label">Schritte</span>
        <ul class="steps" data-steps></ul>
        <input data-new-step placeholder="Schritt hinzufügen">
      </div>

      <div class="field" data-link-field>
        <label class="label" for="link">Link</label>
        <input id="link" name="link" type="url" value="${esc(idea.link)}" placeholder="https://">
      </div>

      <div class="actions">
        ${existing ? '<button type="button" class="btn-text danger" data-delete>Löschen</button>' : '<span></span>'}
        <div>
          <button type="button" class="btn-text" data-close-btn>Abbrechen</button>
          <button class="btn">Speichern</button>
        </div>
      </div>
    </form>`, {
    onMount(el, close) {
      const form = el.querySelector('form');
      const list = el.querySelector('[data-steps]');
      const newStep = el.querySelector('[data-new-step]');

      // Schritte und Link nur zeigen, wenn die Idee umgesetzt werden soll.
      const sync = () => {
        const s = form.status.value;
        el.querySelector('[data-steps-field]').hidden = s === 'idea';
        el.querySelector('[data-link-field]').hidden = s === 'idea';
      };
      const renderSteps = () => {
        list.innerHTML = idea.steps.map((s, n) => `
          <li data-n="${n}">
            <label><input type="checkbox" ${s.done ? 'checked' : ''}><span>${esc(s.title)}</span></label>
            <button type="button" class="btn-text" data-remove aria-label="Entfernen">Entfernen</button>
          </li>`).join('');
      };
      sync(); renderSteps();

      form.addEventListener('change', (e) => {
        if (e.target.name === 'status') sync();
        if (e.target.type === 'checkbox') {
          idea.steps[e.target.closest('li').dataset.n].done = e.target.checked;
        }
      });
      list.addEventListener('click', (e) => {
        if (!e.target.closest('[data-remove]')) return;
        idea.steps.splice(e.target.closest('li').dataset.n, 1);
        renderSteps();
      });
      newStep.addEventListener('keydown', (e) => {
        if (e.key !== 'Enter') return;
        e.preventDefault();
        const t = newStep.value.trim();
        if (!t) return;
        idea.steps.push({ id: uid(), title: t, done: false });
        newStep.value = '';
        renderSteps();
      });

      el.querySelector('[data-delete]')?.addEventListener('click', async () => {
        close();
        if (await confirmDialog(`„${idea.title}“ löschen?`)) {
          store.remove(C, idea.id);
          toast('Gelöscht');
        }
      });

      form.addEventListener('submit', (e) => {
        e.preventDefault();
        save({
          ...idea,
          title: form.title.value.trim(),
          notes: form.notes.value.trim(),
          status: form.status.value,
          link: form.link.value.trim(),
        });
        close();
        toast('Gespeichert');
      });
    },
  });
}
