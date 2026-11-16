// Ideen, die der Hub selbst mitbringt. Jede wird genau einmal angelegt (gemerkt in settings.seeded),
// danach gehört sie dir: ändern oder löschen ist ausdrücklich erlaubt und wird nicht rückgängig gemacht.
import { store } from './store.js';

const SEED = [
  {
    id: 'seed-linkedin-kontakte',
    title: 'LinkedIn-Kontakte: Kollegen-Radar',
    status: 'planned',
    rank: 0,
    notes: [
      'Alle LinkedIn-Kontakte durchgehen, festhalten, wo sie gearbeitet haben, und abgleichen, mit wem ich potenziell schon zusammengearbeitet habe.',
      'Ziel: eine laufend aktuelle Liste von Arbeitskollegen und interessanten Personen.',
      '',
      'Stand: Das Tool „Kontakte“ im Hub kann den LinkedIn-Datenexport (ZIP) einlesen, gleicht mit den eigenen Stationen ab und baut bei jedem Import eine Firmen-Historie auf.',
      '',
      'Wichtig: LinkedIn bietet für private Nutzer keine Schnittstelle zu den eigenen Kontakten, und automatisiertes Auslesen der Website verstößt gegen die Nutzungsbedingungen (Sperrrisiko). Der offizielle Datenexport ist deshalb die Grundlage. Er enthält nur die aktuelle Firma – frühere Arbeitgeber entstehen über wiederholte Importe oder werden von Hand ergänzt.',
    ].join('\n'),
    steps: [
      { id: 's1', title: 'Kontakte-Tool mit Import und Abgleich bauen', done: true },
      { id: 's2', title: 'LinkedIn-Datenexport anfordern und importieren', done: false },
      { id: 's3', title: 'Eigene Stationen prüfen (Positions.csv oder von Hand)', done: false },
      { id: 's4', title: 'Mögliche Kollegen durchgehen und markieren', done: false },
      { id: 's5', title: 'Regelmäßiges Update festlegen (z. B. wöchentlicher Export + Import)', done: false },
      { id: 's6', title: 'Prüfen, ob sich das tägliche Update erlaubt automatisieren lässt', done: false },
    ],
    link: '#/contacts',
  },
  {
    id: 'seed-stadt-menue',
    title: 'Startseite als Stadt',
    status: 'idea',
    notes: [
      'Die Startseite, auf der ich meine Tools auswähle, wird eine Stadt.',
      'Gezeigt werden nur Gebäude, die eine echte Funktion haben. Jedes Gebäude ist ein Tool oder Agent.',
      'Der Name steht direkt am Gebäude, zum Beispiel als Schild oder Leuchtschrift.',
      'Beispiel: Das LinkedIn-Kontakte-Tool ist ein Hochhaus.',
      'Der Stil soll eher realistisch sein, nicht comichaft.',
      'Je mehr Agenten ich baue, desto mehr Gebäude kommen dazu. Die Stadt wächst mit.',
      '',
      'Offene Fragen:',
      '- Welches Tool bekommt welchen Gebäudetyp (Hochhaus, Werkstatt, Bibliothek, Rathaus …)?',
      '- Wie sieht ein geplantes Tool aus? Vielleicht als Baustelle mit Kran.',
      '- Wie bleibt es auf dem Handy bedienbar?',
      '- Welche Technik: gezeichnete Bilder, 3D-Szene oder isometrische Grafik?',
    ].join('\n'),
    steps: [
      { id: 's1', title: 'Gebäudetyp pro Tool festlegen', done: false },
      { id: 's2', title: 'Stil festlegen (Referenzbilder sammeln)', done: false },
      { id: 's3', title: 'Technik wählen und Prototyp mit 2–3 Gebäuden bauen', done: false },
      { id: 's4', title: 'Geplante Tools als Baustellen darstellen', done: false },
      { id: 's5', title: 'Neue Tools erscheinen automatisch als neues Gebäude', done: false },
    ],
    link: '',
  },
];

export function applySeed() {
  const done = store.setting('seeded', []);
  const todo = SEED.filter((s) => !done.includes(s.id));
  if (!todo.length) return;
  store.upsertMany('ideas', todo);
  store.setSetting('seeded', [...done, ...todo.map((s) => s.id)]);
}
