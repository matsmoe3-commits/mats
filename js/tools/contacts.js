// Kontakte: LinkedIn-Kontakte importieren, frühere Arbeitgeber festhalten
// und erkennen, mit wem man potenziell schon zusammengearbeitet hat.
import { store } from '../store.js';
import { esc, modal, toast, confirmDialog, fmtDate } from '../ui.js';
import { icons } from '../icons.js';
import { readExport, mergeConnections, sharedEmployers } from '../linkedin.js';

const C = 'contacts';
const LIMIT = 300; // so viele Zeilen auf einmal anzeigen – den Rest findet die Suche

const state = { tab: 'colleagues', q: '' };

const contacts = () => store.all(C);
const positions = () => store.setting('contacts.positions', []);
const lastImport = () => store.setting('contacts.lastImport', null);
const fullName = (c) => `${c.firstName} ${c.lastName}`.trim();
const years = (p) => [p.from?.slice(0, 4), p.to ? p.to.slice(0, 4) : 'heute'].filter(Boolean).join('–');

const TABS = {
  colleagues: { label: 'Mögliche Kollegen', test: (c) => c.tags?.includes('kollege') || sharedEmployers(c, positions()).length > 0 },
  interesting: { label: 'Interessant', test: (c) => c.tags?.includes('interessant') },
  new: { label: 'Neu', test: (c) => { const d = lastImport()?.date; return !!d && (c.firstSeen === d || c.changedOn === d); } },
  all: { label: 'Alle', test: () => true },
};

function meta(c) {
  const shared = sharedEmployers(c, positions());
  if (shared.length) return `Auch bei ${esc(shared.map((p) => p.company).join(', '))}`;
  if (c.tags?.includes('kollege')) return 'Kollege';
  if (c.tags?.includes('interessant')) return 'Interessant';
  return '';
}

function renderList(el) {
  const q = state.q.toLowerCase();
  const list = contacts()
    .filter(TABS[state.tab].test)
    .filter((c) => !q || [fullName(c), c.company, c.position, ...(c.history || []).map((h) => h.company)].join(' ').toLowerCase().includes(q))
    .sort((a, b) => fullName(a).localeCompare(fullName(b), 'de'));
  if (!list.length) {
    el.innerHTML = `<p class="empty">${state.tab === 'colleagues' && !positions().length
      ? 'Trag unter „Meine Stationen“ ein, wo du gearbeitet hast. Dann tauchen hier die passenden Leute auf.'
      : 'Keine Kontakte in dieser Ansicht.'}</p>`;
    return;
  }
  el.innerHTML = `<ul class="list">${list.slice(0, LIMIT).map((c) => `
    <li><button class="row" data-id="${esc(c.id)}">
      <span class="grow"><span class="row-title">${esc(fullName(c))}</span>
        <span class="row-sub">${esc([c.position, c.company].filter(Boolean).join(' · '))}</span></span>
      <span class="row-meta">${meta(c)}</span>
    </button></li>`).join('')}</ul>
    ${list.length > LIMIT ? `<p class="hint">Noch ${list.length - LIMIT} weitere. Die findest du über die Suche.</p>` : ''}`;
}

// ---------- Dialoge ----------

function openImport() {
  modal(`
    <h2>LinkedIn-Export importieren</h2>
    <ol class="howto">
      <li>Auf LinkedIn: <em>Einstellungen → Datenschutz → Kopie Ihrer Daten anfordern</em>.</li>
      <li>„Kontakte“ und „Positionen“ auswählen (oder das komplette Archiv) und anfordern.</li>
      <li>Die ZIP-Datei aus der Mail von LinkedIn hier auswählen. Entpacken musst du nichts.</li>
    </ol>
    <p class="hint">Die Datei bleibt auf deinem Gerät. Jeder neue Import ergänzt die Liste und merkt sich, wer die Firma gewechselt hat.</p>
    <div class="actions">
      <span></span>
      <div>
        <button type="button" class="btn-text" data-close-btn>Abbrechen</button>
        <label class="btn">Datei wählen<input type="file" accept=".zip,.csv" multiple hidden data-file></label>
      </div>
    </div>`, {
    onMount(el, close) {
      el.querySelector('[data-file]').addEventListener('change', async (e) => {
        try {
          const { connections, positions: pos } = await readExport(e.target.files);
          if (!connections && !pos) throw new Error('Keine Connections.csv oder Positions.csv gefunden');
          close();
          const parts = [];
          if (pos?.length) {
            store.setSetting('contacts.positions', pos);
            parts.push(`${pos.length} Stationen`);
          }
          if (connections) {
            // Zeitstempel statt Datum: so bleibt „Neu“ auch bei mehreren Importen am Tag eindeutig.
            const stamp = new Date().toISOString();
            const { items, stats } = mergeConnections(contacts(), connections, stamp);
            store.setSetting('contacts.lastImport', { date: stamp, ...stats });
            store.upsertMany(C, items);
            parts.push(`${stats.total} Kontakte, ${stats.added} neu, ${stats.changed} Firmenwechsel`);
          }
          toast(`Importiert: ${parts.join(' · ')}`);
        } catch (err) {
          console.error(err);
          toast(`Import fehlgeschlagen: ${err.message}`);
        }
      });
    },
  });
}

function openPositions() {
  const list = structuredClone(positions());
  modal(`
    <h2>Meine Stationen</h2>
    <p class="hint">Damit wird abgeglichen, wer bei denselben Firmen war wie du. Kommt beim Import automatisch mit, du kannst aber auch selbst etwas eintragen.</p>
    <ul class="steps" data-list></ul>
    <form class="inline-form" data-add>
      <input name="company" placeholder="Firma" required>
      <input name="from" placeholder="von (Jahr)" inputmode="numeric" maxlength="4">
      <input name="to" placeholder="bis" inputmode="numeric" maxlength="4">
      <button class="btn secondary">Hinzufügen</button>
    </form>
    <div class="actions"><span></span><div>
      <button type="button" class="btn-text" data-close-btn>Abbrechen</button>
      <button type="button" class="btn" data-save>Speichern</button>
    </div></div>`, {
    onMount(el, close) {
      const ul = el.querySelector('[data-list]');
      const draw = () => {
        ul.innerHTML = list.map((p, n) => `
          <li data-n="${n}"><span><strong>${esc(p.company)}</strong> <span class="muted">${esc([p.title, years(p)].filter(Boolean).join(' · '))}</span></span>
          <button type="button" class="btn-text" data-remove>Entfernen</button></li>`).join('')
          || '<li class="muted">Noch keine Stationen.</li>';
      };
      draw();
      ul.addEventListener('click', (e) => {
        if (!e.target.closest('[data-remove]')) return;
        list.splice(e.target.closest('li').dataset.n, 1);
        draw();
      });
      const form = el.querySelector('[data-add]');
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        list.push({ company: form.company.value.trim(), title: '', from: form.from.value.trim(), to: form.to.value.trim() });
        form.reset();
        form.company.focus();
        draw();
      });
      el.querySelector('[data-save]').onclick = () => {
        store.setSetting('contacts.positions', list);
        close();
        toast('Gespeichert');
      };
    },
  });
}

function openContact(id) {
  const c = structuredClone(store.get(C, id));
  if (!c) return;
  c.history ||= [];
  c.tags ||= [];
  const shared = sharedEmployers(c, positions());

  modal(`
    <form class="editor">
      <div>
        <h2>${esc(fullName(c))}</h2>
        <p class="muted">${esc([c.position, c.company].filter(Boolean).join(' · '))}</p>
      </div>
      ${shared.length ? `<p class="callout">Ihr wart beide bei ${shared.map((p) => `<strong>${esc(p.company)}</strong> <span class="muted">(du: ${esc(years(p))})</span>`).join(', ')}.</p>` : ''}

      <div class="field">
        <span class="label">Markieren</span>
        <div class="pills">
          <label class="pill"><input type="checkbox" name="kollege" ${c.tags.includes('kollege') ? 'checked' : ''}><span>Kollege</span></label>
          <label class="pill"><input type="checkbox" name="interessant" ${c.tags.includes('interessant') ? 'checked' : ''}><span>Interessant</span></label>
        </div>
      </div>

      <div class="field">
        <span class="label">Frühere Firmen</span>
        <ul class="steps" data-history></ul>
        <input data-new-company placeholder="Firma hinzufügen (Enter)">
      </div>

      <div class="field">
        <label class="label" for="notes">Notizen</label>
        <textarea id="notes" name="notes" rows="3" placeholder="Woher kennt ihr euch, worüber habt ihr gesprochen?">${esc(c.notes || '')}</textarea>
      </div>

      <p class="hint">
        ${c.url ? `<a href="${esc(c.url)}" target="_blank" rel="noopener">Profil auf LinkedIn</a> · ` : ''}
        ${c.email ? `${esc(c.email)} · ` : ''}
        ${c.connectedOn ? `Vernetzt seit ${fmtDate(c.connectedOn)}` : ''}
      </p>

      <div class="actions">
        <button type="button" class="btn-text danger" data-delete>Entfernen</button>
        <div>
          <button type="button" class="btn-text" data-close-btn>Abbrechen</button>
          <button class="btn">Speichern</button>
        </div>
      </div>
    </form>`, {
    onMount(el, close) {
      const form = el.querySelector('form');
      const ul = el.querySelector('[data-history]');
      const input = el.querySelector('[data-new-company]');
      const draw = () => {
        ul.innerHTML = c.history.map((h, n) => `
          <li data-n="${n}"><span>${esc(h.company)} <span class="muted">${esc([h.title, h.until ? `bis ${fmtDate(h.until)}` : ''].filter(Boolean).join(' · '))}</span></span>
          <button type="button" class="btn-text" data-remove>Entfernen</button></li>`).join('');
      };
      draw();
      ul.addEventListener('click', (e) => {
        if (!e.target.closest('[data-remove]')) return;
        c.history.splice(e.target.closest('li').dataset.n, 1);
        draw();
      });
      input.addEventListener('keydown', (e) => {
        if (e.key !== 'Enter') return;
        e.preventDefault();
        const v = input.value.trim();
        if (v) c.history.push({ company: v, title: '', source: 'manuell' });
        input.value = '';
        draw();
      });
      el.querySelector('[data-delete]').onclick = async () => {
        close();
        if (await confirmDialog(`${fullName(c)} aus der Liste entfernen?`)) store.remove(C, c.id);
      };
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const tags = ['kollege', 'interessant'].filter((t) => form[t].checked);
        store.upsert(C, { ...c, tags, notes: form.notes.value.trim() });
        close();
        toast('Gespeichert');
      });
    },
  });
}

// ---------- Seite ----------

export default {
  id: 'contacts',
  name: 'Kontakte',
  icon: icons.contacts,
  description: 'LinkedIn-Kontakte und mögliche Kollegen.',
  count: () => contacts().length,
  render(view) {
    const li = lastImport();
    const counts = Object.fromEntries(Object.entries(TABS).map(([k, t]) => [k, contacts().filter(t.test).length]));

    view.innerHTML = `
      <h1>Kontakte</h1>
      <div class="toolbar">
        <button class="btn" data-import>Importieren</button>
        <button class="btn secondary" data-positions>Meine Stationen${positions().length ? ` (${positions().length})` : ''}</button>
        ${li ? `<span class="hint">Letzter Import ${fmtDate(li.date)}: ${li.added} neu, ${li.changed} Firmenwechsel</span>` : ''}
      </div>
      ${contacts().length ? `
        <div class="filterbar">
          <nav class="tabs">
            ${Object.entries(TABS).map(([k, t]) =>
              `<button data-tab="${k}" class="${state.tab === k ? 'on' : ''}">${t.label} <span>${counts[k]}</span></button>`).join('')}
          </nav>
          <input type="search" name="search" placeholder="Name oder Firma" value="${esc(state.q)}">
        </div>
        <div data-list></div>` : `
        <p class="empty">Noch leer. Importier deinen LinkedIn-Export, dann geht’s los.</p>`}`;

    view.querySelector('[data-import]').onclick = openImport;
    view.querySelector('[data-positions]').onclick = openPositions;
    const listEl = view.querySelector('[data-list]');
    if (!listEl) return;
    renderList(listEl);
    view.querySelector('[name=search]').addEventListener('input', (e) => { state.q = e.target.value; renderList(listEl); });
    view.querySelectorAll('[data-tab]').forEach((b) => {
      b.onclick = () => { state.tab = b.dataset.tab; this.render(view); };
    });
    listEl.addEventListener('click', (e) => {
      const r = e.target.closest('[data-id]');
      if (r) openContact(r.dataset.id);
    });
  },
};
