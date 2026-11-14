// Zentraler Datenspeicher des Hubs.
// Alle Tools legen ihre Daten in einer gemeinsamen Struktur ab:
//   { version, updatedAt, collections: { <toolId>: [...] }, settings: {...} }
// Gespeichert wird im localStorage; optional Sync mit einer JSON-Datei in einem GitHub-Repo.

const KEY = 'mats-hub:data';
const SYNC_KEY = 'mats-hub:sync';
const VERSION = 1;

const listeners = new Set();
let suppressPush = false;
let data = load();

function empty() {
  return { version: VERSION, updatedAt: new Date().toISOString(), collections: {}, settings: {}, deleted: {} };
}

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return empty();
    const parsed = JSON.parse(raw);
    return migrate(parsed);
  } catch (e) {
    console.error('Konnte Daten nicht laden', e);
    return empty();
  }
}

function migrate(d) {
  if (!d || typeof d !== 'object') return empty();
  d.collections ||= {};
  d.settings ||= {};
  d.deleted ||= {}; // Tombstones: { <id>: <ISO-Zeit> } – damit Löschungen den Sync überleben
  d.version = VERSION;
  return d;
}

function persist({ silent = false } = {}) {
  data.updatedAt = new Date().toISOString();
  localStorage.setItem(KEY, JSON.stringify(data));
  if (!silent) listeners.forEach((fn) => fn(data));
  if (!suppressPush) scheduleAutoPush();
}

export const uid = () =>
  Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

export const store = {
  subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn); },
  all(collection) { return (data.collections[collection] ||= []); },
  get(collection, id) { return this.all(collection).find((x) => x.id === id); },
  upsert(collection, item) {
    const list = this.all(collection);
    const now = new Date().toISOString();
    const idx = item.id ? list.findIndex((x) => x.id === item.id) : -1;
    if (idx >= 0) {
      list[idx] = { ...list[idx], ...item, updatedAt: now };
      persist();
      return list[idx];
    }
    const created = { ...item, id: item.id || uid(), createdAt: now, updatedAt: now };
    list.unshift(created);
    persist();
    return created;
  },
  remove(collection, id) {
    data.collections[collection] = this.all(collection).filter((x) => x.id !== id);
    data.deleted[id] = new Date().toISOString();
    persist();
  },
  setting(key, fallback) { return data.settings[key] ?? fallback; },
  setSetting(key, value) { data.settings[key] = value; persist(); },
  snapshot() { return JSON.parse(JSON.stringify(data)); },
  replace(newData) { data = migrate(newData); persist(); },
  // Führt zwei Datenstände zusammen: pro Eintrag gewinnt das jüngere updatedAt.
  merge(other) {
    other = migrate(other);
    data.deleted = { ...other.deleted, ...data.deleted };
    for (const [name, items] of Object.entries(other.collections)) {
      const mine = this.all(name);
      const byId = new Map(mine.map((x) => [x.id, x]));
      for (const item of items) {
        const cur = byId.get(item.id);
        if (!cur || (item.updatedAt || '') > (cur.updatedAt || '')) byId.set(item.id, item);
      }
      data.collections[name] = [...byId.values()].filter((x) => !data.deleted[x.id]).sort((a, b) =>
        (b.createdAt || '').localeCompare(a.createdAt || ''));
    }
    data.settings = { ...other.settings, ...data.settings };
    persist();
  },
};

// ---------- Export / Import ----------

export function exportJSON() {
  const blob = new Blob([JSON.stringify(store.snapshot(), null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `mats-hub-backup-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

export async function importJSON(file, mode = 'merge') {
  const parsed = JSON.parse(await file.text());
  if (mode === 'replace') store.replace(parsed);
  else store.merge(parsed);
}

// ---------- GitHub-Sync (optional) ----------
// Speichert den kompletten Datenstand als JSON-Datei in einem (am besten privaten) Repo.
// Benötigt einen Fine-grained Personal Access Token mit "Contents: Read and write" nur für dieses Repo.

export const sync = {
  config() {
    try { return JSON.parse(localStorage.getItem(SYNC_KEY)) || {}; } catch { return {}; }
  },
  saveConfig(cfg) { localStorage.setItem(SYNC_KEY, JSON.stringify(cfg)); },
  enabled() { const c = this.config(); return !!(c.token && c.owner && c.repo); },

  async _req(method, body) {
    const c = this.config();
    const path = c.path || 'hub-data.json';
    const url = `https://api.github.com/repos/${c.owner}/${c.repo}/contents/${encodeURIComponent(path).replace(/%2F/g, '/')}`
      + (method === 'GET' ? `?ref=${encodeURIComponent(c.branch || 'main')}` : '');
    const res = await fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${c.token}`,
        Accept: 'application/vnd.github+json',
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    if (method === 'GET' && res.status === 404) return null;
    if (!res.ok) throw new Error(`GitHub ${res.status}: ${(await res.text()).slice(0, 200)}`);
    return res.json();
  },

  async pull() {
    const file = await this._req('GET');
    if (!file) return { sha: null, data: null };
    const json = new TextDecoder().decode(Uint8Array.from(atob(file.content.replace(/\n/g, '')), (c) => c.charCodeAt(0)));
    return { sha: file.sha, data: JSON.parse(json) };
  },

  // Holt den Remote-Stand, führt zusammen und schreibt das Ergebnis zurück.
  async syncNow() {
    const c = this.config();
    const remote = await this.pull();
    if (remote.data) {
      suppressPush = true;
      try { store.merge(remote.data); } finally { suppressPush = false; }
    }
    const bytes = new TextEncoder().encode(JSON.stringify(store.snapshot(), null, 2));
    let bin = '';
    bytes.forEach((b) => { bin += String.fromCharCode(b); });
    await this._req('PUT', {
      message: `Hub-Sync ${new Date().toISOString()}`,
      content: btoa(bin),
      branch: c.branch || 'main',
      ...(remote.sha ? { sha: remote.sha } : {}),
    });
    this.saveConfig({ ...c, lastSync: new Date().toISOString() });
  },
};

let pushTimer = null;
let syncing = false;
function scheduleAutoPush() {
  if (!sync.enabled() || !sync.config().auto) return;
  clearTimeout(pushTimer);
  pushTimer = setTimeout(async () => {
    if (syncing) return scheduleAutoPush();
    syncing = true;
    try { await sync.syncNow(); } catch (e) { console.warn('Auto-Sync fehlgeschlagen', e); }
    finally { syncing = false; }
  }, 4000);
}
