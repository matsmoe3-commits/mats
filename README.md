# Mats Hub

> Für alles hier gelten die [Grundsätze](GRUNDSAETZE.md): nur ich habe Zugriff, auf Laptop und Handy nutzbar, mega einfach.

Persönlicher Hub für Ideen, Roadmap und eigene Tools. Eine schlichte Web-App ohne Build-Schritt und ohne Abhängigkeiten. Sie läuft im Browser auf PC und Handy und lässt sich auf dem Handy zum Startbildschirm hinzufügen.

Die Startseite zeigt alle Tools als runde Icons. Geplante Vorhaben erscheinen dort als gestrichelte Kreise. Oben rechts filterst du zwischen *Alle*, *Tools* und *Geplant* und kommst zu den Einstellungen.

## Stadt (Prototyp)

Unter *Stadt* erscheinen die Tools als 3D-Gebäude in isometrischer Ansicht:

| Tool | Gebäude |
|---|---|
| Kontakte | Hochhaus |
| Ideen | Werkstatt mit Sheddach |
| Roadmap | Rathaus mit Uhrturm |
| Projekte | Museum |
| Skills | Werkzeugladen |

Geplante Vorhaben stehen als Baustelle mit Kran da. Gehört ein geplantes Vorhaben zu einem bestehenden Tool, steht der Kran neben dessen Gebäude. Abends leuchten die Fenster. Ein Tipp auf ein Gebäude holt es heran, ein zweiter Tipp öffnet das Tool.

Die Gebäude entstehen aus Code (`js/city/scene.js`), Three.js liegt in `vendor/three/`. Es wird erst geladen, wenn die Stadt geöffnet wird.

## Tools

- **Ideen**: Gedanken festhalten. Jede Idee hat einen von drei Status: *Idee*, *Geplant* oder *Fertig*. Eine Idee muss nie umgesetzt werden.
- **Roadmap**: Nur Ideen mit dem Status *Geplant*, in Reihenfolge und mit abhakbaren Schritten.
- **Projekte**: Ideen mit dem Status *Fertig*, mit Link zum Öffnen.
- **Kontakte**: Liest deinen LinkedIn-Datenexport ein und gleicht deine Kontakte mit deinen eigenen Stationen ab. So siehst du, wer schon bei denselben Firmen war wie du. Kontakte lassen sich als *Kollege* oder *Interessant* markieren und mit Notizen versehen.
- **Skills**: Der Skill-Agent. Du beschreibst eine Aufgabe, er nennt die passendsten Skills, Plugins und Anbindungen mit Begründung. Dazu Empfehlungen pro Idee und der ganze Katalog mit 55 ausgewählten Einträgen von GitHub (siehe `SKILLS.md`). In der Stadt ist das der Werkzeugladen.
- **Einstellungen**: Backup als Datei und optionaler Sync über ein **privates** GitHub-Repo. Der Sync wird später durch einen bequemeren Abgleich hinter dem Login ersetzt.

## Kontakte und LinkedIn

LinkedIn bietet Privatpersonen keine Schnittstelle zu den eigenen Kontakten. Automatisiertes Auslesen der Website verstößt gegen die Nutzungsbedingungen. Grundlage ist deshalb der offizielle Datenexport:

1. Auf LinkedIn unter *Einstellungen → Datenschutz → Kopie Ihrer Daten anfordern* „Kontakte“ und „Positionen“ anfordern.
2. Die ZIP-Datei aus der E-Mail unter *Kontakte → Importieren* auswählen. Entpacken ist nicht nötig, und die Datei wird nur lokal im Browser gelesen.

Der Export enthält von jedem Kontakt nur die **aktuelle** Firma. Damit trotzdem ein Lebenslauf entsteht, gleicht jeder weitere Import den alten Stand ab: Hat jemand die Firma gewechselt, wandert die alte Firma in die Historie. Frühere Firmen lassen sich außerdem von Hand ergänzen. Je regelmäßiger du importierst, desto vollständiger wird das Bild.

## Starten

Lokal: `python3 -m http.server 8000` im Projektordner ausführen und <http://localhost:8000> öffnen.

Online: Der Hub wird nie öffentlich veröffentlicht. Geplant ist Cloudflare Pages mit vorgeschaltetem Login (Cloudflare Access), sodass nur ich reinkomme, siehe `GRUNDSAETZE.md`.

## Daten

Alle Daten liegen im Browser (localStorage), nicht im Repo. Das gilt auch für Kontakte. Unter *Einstellungen* lassen sie sich als Datei exportieren oder über ein **privates** GitHub-Repo zwischen Geräten abgleichen.

## Aufbau

```
index.html             App-Hülle
css/style.css          Design (hell/dunkel automatisch)
js/app.js              Kopfzeile, Startseite, Router
js/store.js            Datenspeicher, Export/Import, Sync
js/ideas.js            Ideen: Datenmodell + Bearbeitungsdialog
js/linkedin.js         LinkedIn-Export lesen (CSV/ZIP) und abgleichen
js/skills-data.js      Skill-Katalog und Suche (Quelle für SKILLS.md)
js/icons.js            Icons und Logo
js/seed.js             Ideen, die der Hub einmalig mitbringt
js/tools/              ein Modul pro Tool + index.js (Registry)
js/city/scene.js       3D-Stadt (Three.js)
vendor/three/          Three.js (MIT-Lizenz), lokal statt über fremde Server
```

## Neues Tool hinzufügen

Lege eine Datei in `js/tools/` an, die ein Objekt `{ id, name, icon, description, render(view), count?() }` exportiert, und trage sie in `js/tools/index.js` ein. Danach erscheint das Tool als Icon auf der Startseite. Daten speicherst du mit `store.all('<id>')`, `store.upsert('<id>', item)` und `store.upsertMany('<id>', items)` aus `js/store.js`.
