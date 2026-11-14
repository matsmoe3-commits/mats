// Einstellungen: Backup (Export/Import), GitHub-Sync, Daten zurücksetzen.
import { store, sync, exportJSON, importJSON } from '../store.js';
import { esc, toast, confirmDialog, relTime } from '../ui.js';
import { seedExamples } from './ideas.js';

function render(view) {
  const c = sync.config();
  const count = store.all('ideas').length;

  view.innerHTML = `
    <div class="page-head"><div><h1>⚙️ Einstellungen</h1>
      <p class="muted">Deine Daten liegen lokal in diesem Browser. Mach regelmäßig ein Backup oder richte den GitHub-Sync ein.</p></div></div>

    <section class="card settings">
      <h2>💾 Backup</h2>
      <p class="muted">${count} Ideen gespeichert. Export als JSON-Datei – lässt sich jederzeit wieder importieren.</p>
      <div class="row wrap">
        <button class="btn primary" data-export>Exportieren</button>
        <label class="btn">Importieren (zusammenführen)<input type="file" accept=".json,application/json" data-import hidden></label>
        <label class="btn ghost">Importieren (ersetzen)<input type="file" accept=".json,application/json" data-import-replace hidden></label>
      </div>
    </section>

    <section class="card settings">
      <h2>🔄 GitHub-Sync <small class="muted">(optional – für Handy + PC)</small></h2>
      <p class="muted">Speichert alle Daten als <code>${esc(c.path || 'hub-data.json')}</code> in einem GitHub-Repo. Am besten ein <strong>privates</strong> Repo nehmen
        und einen <a href="https://github.com/settings/personal-access-tokens/new" target="_blank" rel="noopener">Fine-grained Token</a>
        mit Zugriff nur auf dieses eine Repo und der Berechtigung <em>Contents: Read and write</em>.
        Der Token bleibt nur in diesem Browser gespeichert.</p>
      <form class="sync-form" data-sync>
        <div class="cols">
          <label>Besitzer (GitHub-Name)<input name="owner" value="${esc(c.owner || '')}" placeholder="dein-github-name"></label>
          <label>Repo<input name="repo" value="${esc(c.repo || '')}" placeholder="hub-daten"></label>
        </div>
        <div class="cols">
          <label>Branch<input name="branch" value="${esc(c.branch || 'main')}"></label>
          <label>Dateipfad<input name="path" value="${esc(c.path || 'hub-data.json')}"></label>
        </div>
        <label>Token<input name="token" type="password" value="${esc(c.token || '')}" placeholder="github_pat_…" autocomplete="off"></label>
        <label class="switch"><input type="checkbox" name="auto" ${c.auto ? 'checked' : ''}> Automatisch synchronisieren nach jeder Änderung</label>
        <div class="row wrap">
          <button class="btn">Speichern</button>
          <button type="button" class="btn primary" data-sync-now ${sync.enabled() ? '' : 'disabled'}>Jetzt synchronisieren</button>
          ${c.lastSync ? `<span class="muted small">Zuletzt: ${relTime(c.lastSync)}</span>` : ''}
        </div>
      </form>
    </section>

    <section class="card settings">
      <h2>🧪 Sonstiges</h2>
      <div class="row wrap">
        <button class="btn" data-seed>Beispiel-Ideen laden</button>
        <button class="btn danger ghost" data-wipe>Alle lokalen Daten löschen</button>
      </div>
    </section>`;

  view.querySelector('[data-export]').onclick = exportJSON;
  const imp = (mode) => async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try { await importJSON(file, mode); toast('Import erfolgreich'); }
    catch (err) { toast('Import fehlgeschlagen: ' + err.message, 4000); }
  };
  view.querySelector('[data-import]').onchange = imp('merge');
  view.querySelector('[data-import-replace]').onchange = async (e) => {
    if (await confirmDialog('Alle aktuellen Daten durch den Import ersetzen?')) await imp('replace')(e);
    e.target.value = '';
  };

  const form = view.querySelector('[data-sync]');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    sync.saveConfig({
      ...sync.config(),
      owner: form.owner.value.trim(), repo: form.repo.value.trim(),
      branch: form.branch.value.trim() || 'main', path: form.path.value.trim() || 'hub-data.json',
      token: form.token.value.trim(), auto: form.auto.checked,
    });
    toast('Sync-Einstellungen gespeichert');
    render(view);
  });
  view.querySelector('[data-sync-now]').onclick = async (e) => {
    e.target.disabled = true;
    e.target.textContent = 'Synchronisiere…';
    try { await sync.syncNow(); toast('✅ Synchronisiert'); }
    catch (err) { toast('Sync fehlgeschlagen: ' + err.message, 5000); }
    render(view);
  };

  view.querySelector('[data-seed]').onclick = () => { seedExamples(); location.hash = '#/ideas'; };
  view.querySelector('[data-wipe]').onclick = async () => {
    if (!(await confirmDialog('Wirklich ALLE lokalen Daten löschen? Vorher besser exportieren!'))) return;
    store.replace({ collections: {}, settings: {} });
    toast('Alles gelöscht');
  };
}

export default {
  id: 'settings',
  name: 'Einstellungen',
  short: 'Setup',
  icon: '⚙️',
  description: 'Backup, Import und Sync.',
  render,
};
