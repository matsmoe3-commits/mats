// LinkedIn-Datenexport einlesen und Kontakte mit den eigenen Arbeitgebern abgleichen.
// Quelle: LinkedIn → Einstellungen → Datenschutz → „Kopie Ihrer Daten anfordern“.
// Relevant sind Connections.csv (Kontakte) und Positions.csv (eigene Stationen).
// Keine Oberfläche hier – nur reine Funktionen, damit alles testbar bleibt.

// ---------- CSV ----------

export function parseCSV(text) {
  const rows = [];
  let row = [];
  let cell = '';
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') { cell += '"'; i++; }
      else if (c === '"') quoted = false;
      else cell += c;
    } else if (c === '"') quoted = true;
    else if (c === ',') { row.push(cell); cell = ''; }
    else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++;
      row.push(cell); rows.push(row); row = []; cell = '';
    } else cell += c;
  }
  if (cell || row.length) { row.push(cell); rows.push(row); }
  return rows;
}

// LinkedIn stellt Connections.csv ein paar Hinweiszeilen voran – daher die Kopfzeile suchen.
function table(text, firstColumn) {
  const rows = parseCSV(text.replace(/^﻿/, ''));
  const h = rows.findIndex((r) => r[0]?.trim() === firstColumn);
  if (h < 0) return null;
  const head = rows[h].map((x) => x.trim());
  return rows.slice(h + 1)
    .filter((r) => r.some((x) => x.trim()))
    .map((r) => Object.fromEntries(head.map((k, n) => [k, (r[n] || '').trim()])));
}

const MONTHS = { jan: 1, feb: 2, mar: 3, mär: 3, apr: 4, may: 5, mai: 5, jun: 6, jul: 7, aug: 8, sep: 9, oct: 10, okt: 10, nov: 11, dec: 12, dez: 12 };

// "15 Nov 2026" → "2026-11-15", "Jan 2020" → "2020-01", "2020" → "2020"
export function parseDate(s) {
  if (!s) return '';
  const parts = s.trim().split(/\s+/);
  const year = parts.find((p) => /^\d{4}$/.test(p));
  if (!year) return '';
  const mon = parts.map((p) => MONTHS[p.slice(0, 3).toLowerCase()]).find(Boolean);
  const day = parts.find((p) => /^\d{1,2}$/.test(p));
  const pad = (n) => String(n).padStart(2, '0');
  if (mon && day) return `${year}-${pad(mon)}-${pad(day)}`;
  if (mon) return `${year}-${pad(mon)}`;
  return year;
}

export function contactId(url, first, last) {
  const slug = url?.match(/linkedin\.com\/in\/([^/?#]+)/i)?.[1];
  return slug ? `li-${decodeURIComponent(slug).toLowerCase()}` : `name-${`${first} ${last}`.trim().toLowerCase().replace(/\s+/g, '-')}`;
}

export function parseConnections(text) {
  const rows = table(text, 'First Name');
  if (!rows) return null;
  return rows.map((r) => ({
    id: contactId(r.URL, r['First Name'], r['Last Name']),
    firstName: r['First Name'],
    lastName: r['Last Name'],
    url: r.URL,
    email: r['Email Address'] || '',
    company: r.Company,
    position: r.Position,
    connectedOn: parseDate(r['Connected On']),
  }));
}

export function parsePositions(text) {
  const rows = table(text, 'Company Name');
  if (!rows) return null;
  return rows.map((r) => ({
    company: r['Company Name'],
    title: r.Title,
    from: parseDate(r['Started On']),
    to: parseDate(r['Finished On']),
  }));
}

// ---------- ZIP (der LinkedIn-Export kommt als .zip) ----------
// Minimaler Leser: Zentralverzeichnis lesen, Einträge mit „deflate“ über DecompressionStream entpacken.

export async function readZip(buffer) {
  const v = new DataView(buffer);
  let eocd = buffer.byteLength - 22;
  while (eocd >= 0 && v.getUint32(eocd, true) !== 0x06054b50) eocd--;
  if (eocd < 0) throw new Error('Keine gültige ZIP-Datei');
  const count = v.getUint16(eocd + 10, true);
  let p = v.getUint32(eocd + 16, true);
  const files = {};
  for (let n = 0; n < count; n++) {
    const method = v.getUint16(p + 10, true);
    const size = v.getUint32(p + 20, true);
    const nameLen = v.getUint16(p + 28, true);
    const extraLen = v.getUint16(p + 30, true);
    const commentLen = v.getUint16(p + 32, true);
    const local = v.getUint32(p + 42, true);
    const name = new TextDecoder().decode(new Uint8Array(buffer, p + 46, nameLen));
    p += 46 + nameLen + extraLen + commentLen;
    if (!/\.csv$/i.test(name)) continue;
    const start = local + 30 + v.getUint16(local + 26, true) + v.getUint16(local + 28, true);
    const raw = new Uint8Array(buffer, start, size);
    let bytes = raw;
    if (method === 8) {
      const stream = new Blob([raw]).stream().pipeThrough(new DecompressionStream('deflate-raw'));
      bytes = new Uint8Array(await new Response(stream).arrayBuffer());
    } else if (method !== 0) continue;
    files[name.split('/').pop()] = new TextDecoder().decode(bytes);
  }
  return files;
}

// Liest beliebige ausgewählte Dateien (.zip oder .csv) und erkennt Kontakte bzw. Stationen am Inhalt.
export async function readExport(fileList) {
  const texts = [];
  for (const f of fileList) {
    if (/\.zip$/i.test(f.name)) texts.push(...Object.values(await readZip(await f.arrayBuffer())));
    else texts.push(await f.text());
  }
  let connections = null;
  let positions = null;
  for (const t of texts) {
    connections ||= parseConnections(t);
    positions ||= parsePositions(t);
  }
  return { connections, positions };
}

// ---------- Abgleich ----------

const LEGAL = /\b(gmbh|ag|se|kg|ug|co|ohg|e\.?\s?v|inc|llc|ltd|limited|plc|corp|corporation|company|group|gruppe|holding|deutschland|germany|international)\b/g;

export function normCompany(name) {
  return (name || '').toLowerCase()
    .replace(/&/g, ' und ')
    .replace(LEGAL, ' ')
    .replace(/[^a-z0-9äöüß]+/g, ' ')
    .trim();
}

export function sameCompany(a, b) {
  const x = normCompany(a);
  const y = normCompany(b);
  if (!x || !y) return false;
  if (x === y) return true;
  // „Siemens“ vs. „Siemens Healthineers“: Präfix zählt, aber nur ab einer sinnvollen Länge.
  const [s, l] = x.length < y.length ? [x, y] : [y, x];
  return s.length >= 4 && l.startsWith(`${s} `);
}

// Alle Firmen, die von einem Kontakt bekannt sind: aktuelle + frühere (aus Importen oder manuell).
export function companiesOf(c) {
  return [c.company, ...(c.history || []).map((h) => h.company)].filter(Boolean);
}

// Gemeinsame Arbeitgeber zwischen Kontakt und eigenen Stationen.
export function sharedEmployers(contact, myPositions) {
  const out = [];
  for (const pos of myPositions) {
    if (companiesOf(contact).some((co) => sameCompany(co, pos.company)) && !out.some((o) => sameCompany(o.company, pos.company))) {
      out.push(pos);
    }
  }
  return out;
}

// Neuen Import mit dem bisherigen Stand zusammenführen.
// Hat ein Kontakt die Firma gewechselt, wandert die alte Firma in die Historie –
// so entsteht mit jedem Import ein Lebenslauf, den der Export selbst nicht enthält.
export function mergeConnections(existing, imported, today = new Date().toISOString()) {
  const byId = new Map(existing.map((c) => [c.id, c]));
  const items = [];
  const stats = { total: imported.length, added: 0, changed: 0 };
  for (const imp of imported) {
    const old = byId.get(imp.id);
    if (!old) {
      items.push({ ...imp, history: [], tags: [], notes: '', firstSeen: today, lastSeen: today });
      stats.added++;
      continue;
    }
    const history = [...(old.history || [])];
    const moved = !!old.company && !sameCompany(old.company, imp.company);
    if (moved) {
      if (!history.some((h) => sameCompany(h.company, old.company))) {
        history.push({ company: old.company, title: old.position || '', until: today, source: 'import' });
      }
      stats.changed++;
    }
    items.push({ ...old, ...imp, history, lastSeen: today, changedOn: moved ? today : old.changedOn || '' });
  }
  return { items, stats };
}
