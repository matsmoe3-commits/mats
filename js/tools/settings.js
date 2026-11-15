// Einstellungen: Backup und optionaler Sync zwischen Geräten.
import { sync, exportJSON, importJSON } from '../store.js';
import { icons } from '../icons.js';
import { esc, toast, fmtDate } from '../ui.js';

function render(view) {
  const c = sync.config();
  view.innerHTML = `
    <h1>Einstellungen</h1>

    <section class="section">
      <h2>Backup</h2>
      <p class="lead">Deine Daten liegen in diesem Browser. Exportiere sie ab und zu als Datei.</p>
      <div class="buttons">
        <button class="btn" data-export>Exportieren</button>
        <label class="btn secondary">Importieren<input type="file" accept=".json" data-import hidden></label>
      </div>
    </section>

    <section class="section">
      <h2>Sync zwischen Geräten</h2>
      <p class="lead">Optional. Speichert die Daten als Datei in einem privaten GitHub-Repo, damit Handy und PC denselben Stand haben.
        Dafür brauchst du einen <a href="https://github.com/settings/personal-access-tokens/new" target="_blank" rel="noopener">Fine-grained Token</a>
        mit Zugriff nur auf dieses Repo und der Berechtigung „Contents: Read and write“.</p>
      <form class="form" data-sync>
        <label>GitHub-Name<input name="owner" value="${esc(c.owner || '')}"></label>
        <label>Repo<input name="repo" value="${esc(c.repo || '')}" placeholder="hub-daten"></label>
        <label>Token<input name="token" type="password" value="${esc(c.token || '')}" autocomplete="off"></label>
        <label class="check"><input type="checkbox" name="auto" ${c.auto ? 'checked' : ''}> Automatisch synchronisieren</label>
        <div class="buttons">
          <button class="btn secondary">Speichern</button>
          <button type="button" class="btn" data-sync-now ${sync.enabled() ? '' : 'disabled'}>Jetzt synchronisieren</button>
        </div>
        ${c.lastSync ? `<p class="hint">Zuletzt synchronisiert: ${fmtDate(c.lastSync)}</p>` : ''}
      </form>
    </section>`;

  view.querySelector('[data-export]').onclick = exportJSON;
  view.querySelector('[data-import]').onchange = async (e) => {
    try { await importJSON(e.target.files[0]); toast('Importiert'); }
    catch (err) { toast('Import fehlgeschlagen'); console.error(err); }
  };
  const form = view.querySelector('[data-sync]');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    sync.saveConfig({
      ...c, owner: form.owner.value.trim(), repo: form.repo.value.trim(),
      token: form.token.value.trim(), auto: form.auto.checked,
    });
    toast('Gespeichert');
    render(view);
  });
  view.querySelector('[data-sync-now]').onclick = async (e) => {
    e.target.disabled = true;
    e.target.textContent = 'Synchronisiere …';
    try { await sync.syncNow(); toast('Synchronisiert'); }
    catch (err) { toast('Sync fehlgeschlagen'); console.error(err); }
    render(view);
  };
}

export default {
  id: 'settings',
  name: 'Einstellungen',
  icon: icons.settings,
  description: 'Backup und Sync.',
  render,
};
