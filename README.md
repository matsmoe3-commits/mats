# Hub

Persönlicher Hub für Ideen, Roadmap und eigene Tools. Eine schlichte Web-App ohne Build-Schritt und ohne Abhängigkeiten. Sie läuft im Browser auf PC und Handy und lässt sich auf dem Handy zum Startbildschirm hinzufügen.

## Bereiche

- **Ideen**: Gedanken festhalten. Jede Idee hat einen von drei Status: *Idee*, *Geplant* oder *Fertig*. Eine Idee muss nie umgesetzt werden.
- **Roadmap**: Nur Ideen mit dem Status *Geplant*, in Reihenfolge und mit abhakbaren Schritten.
- **Projekte**: Ideen mit dem Status *Fertig*, mit Link zum Öffnen.
- **Einstellungen**: Backup als Datei und optionaler Sync über ein privates GitHub-Repo.

## Starten

Lokal: `python3 -m http.server 8000` im Projektordner ausführen und <http://localhost:8000> öffnen.

Online: Den Branch nach `main` mergen und unter *Settings → Pages → Source* die Option „GitHub Actions“ wählen. Der Workflow in `.github/workflows/pages.yml` veröffentlicht den Hub dann bei jedem Push.

## Daten

Die Daten liegen im Browser (localStorage), nicht im Repo. Unter *Einstellungen* kannst du sie exportieren. Wenn du mehrere Geräte nutzt, kannst du dort auch den Sync über ein privates GitHub-Repo einrichten.

## Neues Tool hinzufügen

Lege eine Datei in `js/tools/` an, die ein Objekt `{ id, name, description, render(view), count?() }` exportiert, und trage sie in `js/tools/index.js` ein. Daten speicherst du mit `store.all('<id>')` und `store.upsert('<id>', item)` aus `js/store.js`.
