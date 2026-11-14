// Gemeinsames Datenmodell für Ideen – genutzt von Ideen, Roadmap und Projekte.
import { store, uid } from '../store.js';

export const COLLECTION = 'ideas';

// Lebenszyklus einer Idee. Nicht jede Idee muss umgesetzt werden:
// "Geparkt" und "Verworfen" sind gleichwertige Endpunkte.
export const STATUSES = [
  { id: 'inbox',   label: 'Inbox',     icon: '📥', hint: 'Frischer Gedanke, noch nicht bewertet' },
  { id: 'parked',  label: 'Geparkt',   icon: '🅿️', hint: 'Gute Idee, aber (noch) nicht umsetzen' },
  { id: 'planned', label: 'Geplant',   icon: '🗺️', hint: 'Soll umgesetzt werden – steht auf der Roadmap' },
  { id: 'active',  label: 'In Arbeit', icon: '🔨', hint: 'Wird gerade umgesetzt' },
  { id: 'done',    label: 'Umgesetzt', icon: '✅', hint: 'Fertig – erscheint unter „Projekte“' },
  { id: 'dropped', label: 'Verworfen', icon: '🗑️', hint: 'Bewusst nicht weiterverfolgt' },
];
export const statusById = Object.fromEntries(STATUSES.map((s) => [s.id, s]));

export const DEFAULT_CATEGORIES = ['App / Tool', 'Website', 'Automatisierung', 'Hardware / DIY', 'Business', 'Lernen', 'Persönlich', 'Kreativ', 'Sonstiges'];

export const EFFORTS = [
  { id: 'S', label: 'S – ein Nachmittag', weight: 1 },
  { id: 'M', label: 'M – ein paar Tage', weight: 2 },
  { id: 'L', label: 'L – einige Wochen', weight: 3 },
  { id: 'XL', label: 'XL – Monate', weight: 4 },
];
export const effortById = Object.fromEntries(EFFORTS.map((e) => [e.id, e]));

// Einfache Priorisierungshilfe: Nutzen × Lust im Verhältnis zum Aufwand (0–100).
export function score(idea) {
  const impact = Number(idea.impact || 0);
  const fun = Number(idea.fun || 0);
  if (!impact && !fun) return null;
  const w = effortById[idea.effort]?.weight || 2;
  const raw = ((impact || 3) * 2 + (fun || 3)) / (w + 1); // max (10+5)/2 = 7.5
  return Math.round(Math.min(100, (raw / 7.5) * 100));
}

export function ideas() { return store.all(COLLECTION); }
export function getIdea(id) { return store.get(COLLECTION, id); }

export function saveIdea(idea) {
  // Wer auf "Geplant"/"In Arbeit" steht, landet automatisch auf der Roadmap.
  if (['planned', 'active'].includes(idea.status)) {
    idea.roadmap = { milestones: [], ...(idea.roadmap || {}), enabled: true };
  }
  if (idea.status === 'done' && !idea.doneAt) idea.doneAt = new Date().toISOString();
  if (idea.status !== 'done') idea.doneAt = null;
  return store.upsert(COLLECTION, idea);
}

export function newIdea(partial = {}) {
  return {
    title: '', description: '', category: '', tags: [], status: 'inbox',
    priority: 0, impact: 0, fun: 0, effort: '', link: '', repo: '',
    roadmap: { enabled: false, target: '', milestones: [] },
    ...partial,
  };
}

export function categories() {
  const used = ideas().map((i) => i.category).filter(Boolean);
  return [...new Set([...DEFAULT_CATEGORIES, ...used])];
}

export function allTags() {
  return [...new Set(ideas().flatMap((i) => i.tags || []))].sort((a, b) => a.localeCompare(b));
}

export function progress(idea) {
  const ms = idea.roadmap?.milestones || [];
  if (!ms.length) return null;
  const done = ms.filter((m) => m.done).length;
  return { done, total: ms.length, pct: Math.round((done / ms.length) * 100) };
}

export const newMilestone = (title) => ({ id: uid(), title, done: false });

// ---------- Quartale für die Roadmap ----------
export function quarterOf(date = new Date()) {
  return `${date.getFullYear()}-Q${Math.floor(date.getMonth() / 3) + 1}`;
}
export function upcomingQuarters(n = 8) {
  const d = new Date();
  d.setDate(1);
  const out = [];
  for (let i = 0; i < n; i++) {
    out.push(quarterOf(d));
    d.setMonth(d.getMonth() + 3);
  }
  return out;
}
export const quarterLabel = (q) => {
  if (!q) return 'Irgendwann';
  const [y, qq] = q.split('-');
  return `${qq} ${y}`;
};
