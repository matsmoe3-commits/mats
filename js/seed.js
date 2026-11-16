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
      'Der Name steht direkt am Gebäude, als Schild oder Leuchtschrift.',
      'Der Stil soll eher realistisch sein, nicht comichaft.',
      'Je mehr Agenten ich baue, desto mehr Gebäude kommen dazu. Die Stadt wächst mit.',
      '',
      'Entschieden:',
      '- Optik: 3D in isometrischer Ansicht, keine gezeichneten Bilder.',
      '- Tools, die noch im Bau sind (Status „Geplant“), stehen als Baustelle mit Kran da.',
      '- Welches Tool welchen Gebäudetyp bekommt, entscheide ich mit.',
      '',
      'Vorschlag Gebäudetypen (noch nicht entschieden):',
      '- Kontakte (LinkedIn): Hochhaus mit Glasfassade',
      '- Ideen: Werkstatt mit Glasdach',
      '- Roadmap: Rathaus bzw. Planungsamt mit Uhrturm',
      '- Projekte: Museum für alles, was fertig ist',
      '- Einstellungen: kein Gebäude, bleibt der Button oben rechts',
      '',
      'Bedienung auf dem Handy (Vorschlag):',
      '- Hochformat zeigt die Stadt als eine Straße, durch die man seitlich wischt. Die Kamera fährt mit, ein Gebäude ist immer groß und gut lesbar im Bild.',
      '- Erster Tipp auf ein Gebäude: Kamera fährt heran, das Schild wird groß. Zweiter Tipp: Tool öffnet sich.',
      '- Am PC: die ganze Stadt auf einen Blick, mit der Maus drehen und zoomen.',
      '- Immer verfügbar: ein Knopf „Liste“, der die heutigen runden Icons zeigt, für den schnellen Zugriff.',
      '',
      'Technik (Vorschlag): Three.js im Browser, Gebäude aus Code erzeugt statt fertiger Modelle. So entsteht jedes neue Gebäude automatisch, und die Seite bleibt klein und schnell. Realistischer Look über weiches Licht, Schatten und abends beleuchtete Fenster.',
    ].join('\n'),
    steps: [
      { id: 's1', title: 'Gebäudetyp pro Tool zusammen festlegen', done: false },
      { id: 's2', title: 'Stil festlegen (Referenzbilder sammeln)', done: false },
      { id: 's3', title: 'Prototyp in 3D mit 2–3 Gebäuden bauen', done: false },
      { id: 's4', title: 'Geplante Tools als Baustelle mit Kran darstellen', done: false },
      { id: 's5', title: 'Handy-Bedienung umsetzen (Straße zum Wischen + Liste)', done: false },
      { id: 's6', title: 'Neue Tools erscheinen automatisch als neues Gebäude', done: false },
    ],
    link: '',
  },
  {
    id: 'seed-whatsapp-assistent',
    title: 'WhatsApp-Assistent: wem sollte ich mal wieder schreiben?',
    status: 'idea',
    notes: [
      'Ein Agent, der meine WhatsApp-Chats im Blick hat und mir sagt:',
      '- wem ich mal wieder schreiben sollte, weil der letzte Kontakt lange her ist,',
      '- wer mir wichtig ist (ich lege das fest, der Agent macht Vorschläge),',
      '- welche Nachrichten ich noch nicht beantwortet habe.',
      '',
      'Was man wissen muss:',
      '- WhatsApp hat für private Konten keine offizielle Schnittstelle. Die Business-API gilt nur für Firmennummern.',
      '- Inoffizielle Werkzeuge, die WhatsApp Web fernsteuern, verstoßen gegen die Nutzungsbedingungen. Konten werden dafür gesperrt, im schlimmsten Fall mein privates.',
      '- In den Chats stehen Nachrichten anderer Leute, die nicht zugestimmt haben. Deshalb: alles nur lokal auf meinem Gerät, nichts an fremde Server.',
      '',
      'Mögliche Wege:',
      '- Chat-Export: WhatsApp kann einzelne Chats als Datei exportieren. Der Hub liest sie ein. Erlaubt und sicher, aber Handarbeit pro Chat.',
      '- Nur Metadaten: Für die meisten Fragen reicht, wer wann zuletzt geschrieben hat. Der Inhalt muss gar nicht gespeichert werden.',
      '- Manuelle Liste: wichtige Personen mit Wunsch-Rhythmus (z. B. alle 2 Wochen), der Hub erinnert. Ganz ohne WhatsApp-Zugriff.',
      '',
      'Passt gut zu den Kontakten: dieselben Personen, ein gemeinsames Profil.',
    ].join('\n'),
    steps: [
      { id: 's1', title: 'Entscheiden, welcher Weg (Export, Metadaten, manuelle Liste)', done: false },
      { id: 's2', title: 'Liste wichtiger Personen mit Wunsch-Rhythmus anlegen', done: false },
      { id: 's3', title: 'Chat-Export einlesen und „unbeantwortet“ erkennen', done: false },
      { id: 's4', title: 'Täglicher Hinweis: wem heute schreiben', done: false },
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
