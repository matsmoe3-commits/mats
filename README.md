# 🧭 Mats Hub

Mein persönlicher Hub: ein Ort für alle meine Ideen, meine Roadmap und alle Tools, die ich mir mit der Zeit selbst baue.

Der Hub ist eine **installierbare Web-App (PWA)**: reines HTML/CSS/JavaScript, kein Build-Schritt, kein Server, keine Abhängigkeiten. Er läuft im Browser auf PC und Handy und lässt sich auf dem Handy wie eine App zum Startbildschirm hinzufügen.

## Tools

| Tool | Wozu |
|---|---|
| 💡 **Ideen** | Jeden Gedanken sofort festhalten (Schnellnotiz → Inbox). Später mit Kategorie, Tags und Bewertung versehen (Nutzen, Spaß, Aufwand → Score) und entscheiden. Liste oder Kanban-Board mit Drag & Drop. |
| 🗺️ **Roadmap** | Zeigt **nur** die Ideen, die wirklich umgesetzt werden sollen, nach Ziel-Quartal geordnet, mit Meilensteinen und Fortschritt. Alles andere darf in Ruhe reifen. |
| 🚀 **Projekte** | Startrampe zu allem, was schon umgesetzt ist, mit direktem Link zum Öffnen und zum Code. |
| ⚙️ **Setup** | Backup (JSON-Export/-Import) und optionaler GitHub-Sync. |

### Lebenszyklus einer Idee

```
📥 Inbox ──► 🅿️ Geparkt          (gute Idee, aber nicht jetzt)
        ├──► 🗑️ Verworfen        (bewusst nicht weiterverfolgen)
        └──► 🗺️ Geplant ──► 🔨 In Arbeit ──► ✅ Umgesetzt
              (erscheint auf der Roadmap)      (erscheint unter Projekte)
```

Nicht jede Idee muss umgesetzt werden: **Geparkt** und **Verworfen** sind ganz normale Endpunkte.

## Starten

**Lokal:** Im Projektordner `python3 -m http.server 8000` ausführen und <http://localhost:8000> öffnen.

**Online über GitHub Pages:**
1. Den Branch nach `main` mergen.
2. Im Repo unter *Settings → Pages → Source* die Option **GitHub Actions** wählen.
3. Der Workflow `.github/workflows/pages.yml` veröffentlicht den Hub dann bei jedem Push nach `main` unter `https://<user>.github.io/<repo>/`.
4. Auf dem Handy die Seite öffnen und *„Zum Startbildschirm hinzufügen“* wählen.

> ⚠️ Ist das Repo öffentlich, ist auch die Website öffentlich. Das ist kein Problem, denn sie enthält nur den Code. **Deine Ideen liegen nicht im Repo**, sondern lokal in deinem Browser bzw. in deiner eigenen Sync-Datei.

## Wo liegen meine Daten?

- Standardmäßig im **localStorage** des Browsers, also nur auf diesem Gerät.
- **Backup:** *Setup → Exportieren* erzeugt eine JSON-Datei.
- **Sync zwischen Geräten (optional):** *Setup → GitHub-Sync*. Die Daten werden als `hub-data.json` in einem Repo deiner Wahl gespeichert, am besten in einem **privaten** Repo wie `hub-daten`. Dafür brauchst du einen [Fine-grained Token](https://github.com/settings/personal-access-tokens/new) mit Zugriff nur auf dieses Repo und der Berechtigung *Contents: Read and write*. Beim Sync werden beide Stände zusammengeführt (der neuere Eintrag gewinnt, Löschungen werden übernommen).

## Ein neues Tool hinzufügen

1. Eine Datei `js/tools/mein-tool.js` anlegen:

   ```js
   import { store } from '../store.js';

   export default {
     id: 'habits',                 // wird zur URL: #/habits
     name: 'Gewohnheiten',
     icon: '✅',
     description: 'Tägliche Gewohnheiten abhaken.',
     render(view, routeParts) {
       const items = store.all('habits');   // eigene Datensammlung
       view.innerHTML = `<h1>✅ Gewohnheiten</h1> …`;
     },
     stats() { return [`${store.all('habits').length} Gewohnheiten`]; }, // optional, für die Startseite
   };
   ```

2. In `js/tools/index.js` importieren und in die Liste eintragen.

Damit erscheint das Tool automatisch auf der Startseite und in der Navigation, und Backup und Sync gelten auch für seine Daten.

## Struktur

```
index.html              App-Hülle
css/style.css           Design (hell/dunkel automatisch)
js/app.js               Router + Startseite
js/store.js             Datenspeicher, Export/Import, GitHub-Sync
js/ui.js                kleine UI-Helfer (Modal, Toast, …)
js/tools/index.js       Tool-Registry ← neue Tools hier eintragen
js/tools/ideas*.js      Ideen-Speicher (Modell, Liste/Board)
js/tools/idea-editor.js Bearbeitungsdialog inkl. Roadmap
js/tools/roadmap.js     Roadmap
js/tools/projects.js    Projekte
js/tools/settings.js    Einstellungen
sw.js, manifest…        Offline-Fähigkeit & Installierbarkeit
```
