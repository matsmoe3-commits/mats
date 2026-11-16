# Grundsätze

Diese Regeln gelten für alles im Mats Hub, für jedes Tool und jeden Agenten. Bei einem Konflikt gehen sie jeder neuen Funktion vor.

## 1. Was hier drin passiert, bleibt hier drin

- Meine Daten (Ideen, Kontakte, Notizen, Nachrichten, Finanzen, Sprachaufnahmen) verlassen meine eigenen Geräte nicht in lesbarer Form.
- Keine Werbe-, Analyse- oder Tracking-Dienste, keine Schriften oder Bibliotheken von fremden Servern. Alles, was der Hub braucht, liegt im Repo (z. B. `vendor/three/`).
- Muss etwas doch auf einem fremden Server liegen (z. B. für den Abgleich zwischen Geräten), dann nur **Ende-zu-Ende-verschlüsselt**: Der Schlüssel liegt nur auf meinen Geräten, der Server sieht nur Datensalat.
- Jede Funktion, die Daten nach außen schicken würde, wird vorher benannt und braucht meine ausdrückliche Zustimmung. Das gilt auch für einzelne Anfragen wie Wetterdaten, bei denen nur der Ort rausgeht.
- Agenten lesen und melden, sie handeln nicht ungefragt nach außen. Sie verschicken z. B. keine Nachrichten in meinem Namen.

## 2. Nur ich komme rein

- Der Hub ist nie öffentlich erreichbar. Kein öffentliches GitHub Pages, keine öffentliche Adresse ohne Login.
- Jedes Gerät muss sich einmal als meins ausweisen. Fremde sehen nicht einmal die leere App.
- Zugänge (Tokens, Passwörter) liegen nie im Code oder im Repo.

## 3. Überall nutzbar

- Der Hub läuft auf iPhone, Mac und jedem Browser, später auch auf dem Fernseher.
- Eingaben gehen von überall: tippen, einsprechen, Siri, Apple Watch.
- Alle Geräte haben denselben Stand.

## 4. Mega einfach

- Einmal einrichten, danach keine Technik mehr sehen: kein Token-Abtippen, keine Einstellungen pro Gerät.
- Ein Eingang für alles. Der Hub entscheidet, wohin etwas gehört.
- Sicherheit darf die Bedienung nicht kompliziert machen. Wenn doch, ist die Lösung noch nicht gut genug.

## Stand und offene Punkte

| Thema | Stand |
|---|---|
| Daten im Browser, kein Tracking, keine fremden Bibliotheken | erfüllt |
| Öffentliche Veröffentlichung über GitHub Pages | entfernt |
| GitHub-Sync in den Einstellungen | **widerspricht Punkt 1**: schickt Daten unverschlüsselt an GitHub. Übergangslösung, wird ersetzt. Bis dahin nicht einschalten. |
| Hosting „überall, aber nur ich“ | offen, siehe unten |
| KI-Funktionen (Sprache zu Text, Perspektiven-Helfer, Termine erkennen) | offen, siehe unten |

### Offene Entscheidung: Wo läuft der Hub?

- **Eigener Rechner zu Hause** (z. B. Mac mini) **plus Tailscale** auf allen Geräten. Die Daten verlassen nie meine Geräte, und auch KI-Modelle können auf dem Mac laufen. Tailscale ist ein privates Netz nur für meine Geräte: einmal die App installieren, dann einfach an lassen. Der Rechner muss dauerhaft laufen, was der WhatsApp-Assistent ohnehin braucht.
- **Cloudflare Pages + Access** mit Ende-zu-Ende-verschlüsseltem Abgleich. Kein Rechner zu Hause nötig, aber die App liegt bei Cloudflare, und KI-Funktionen bräuchten einen externen Dienst.

### Offene Entscheidung: Wo laufen die KI-Funktionen?

- **Lokal** (Apple-Spracherkennung auf dem Gerät, Sprachmodell auf dem eigenen Mac): nichts geht nach außen, aber schwächer und hardwareabhängig.
- **Externer Anbieter**: deutlich besser, aber Inhalte verlassen meine Geräte. Das widerspricht Punkt 1 und bräuchte meine bewusste Ausnahme.
