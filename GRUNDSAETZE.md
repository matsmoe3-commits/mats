# Grundsätze

Diese Regeln gelten für alles im Mats Hub, für jedes Tool und jeden Agenten. Bei einem Konflikt gehen sie jeder neuen Funktion vor.

## 1. Nur ich habe Zugriff

- Daten dürfen bei externen Diensten liegen oder verarbeitet werden (GitHub, Cloudflare, KI-Anbieter, Apple), aber **zugreifen kann nur ich**.
- Nichts ist öffentlich: kein öffentliches GitHub Pages, keine Adresse, die ohne Login erreichbar ist, keine öffentlichen Repos mit Daten.
- Repos mit Code oder Daten sind **privat**.
- Zugänge (Tokens, Passwörter, Schlüssel) liegen nie im Code oder im Repo.
- Externe Dienste nur mit Einstellungen, bei denen meine Daten nicht weitergegeben oder zum Training genutzt werden, soweit der Dienst das anbietet.
- Agenten lesen und melden, sie handeln nicht ungefragt nach außen. Sie verschicken z. B. keine Nachrichten in meinem Namen.

## 2. Auf Laptop und Handy nutzbar

- Der Hub läuft auf meinem Laptop und meinem iPhone, im Browser und als App auf dem Startbildschirm. Später gern auch auf dem Fernseher.
- Eingaben gehen von überall: tippen, einsprechen, Siri, Apple Watch.
- Alle Geräte haben denselben Stand.

## 3. Mega einfach

- Einmal pro Gerät anmelden, danach keine Technik mehr sehen: kein Token-Abtippen, keine Einstellungen pro Gerät.
- Ein Eingang für alles. Der Hub entscheidet, wohin etwas gehört.
- Sicherheit darf die Bedienung nicht kompliziert machen. Wenn doch, ist die Lösung noch nicht gut genug.

## Stand und nächste Schritte

| Thema | Stand |
|---|---|
| Daten im Browser, kein Tracking | erfüllt |
| Öffentliche Veröffentlichung über GitHub Pages | entfernt, weil öffentlich |
| Repo `matsmoe3-commits/mats` | **auf privat stellen** |
| GitHub-Sync in den Einstellungen | erlaubt mit **privatem** Repo. Unbequem, weil der Token auf jedem Gerät eingetippt werden muss. Wird durch einen Abgleich hinter dem Login ersetzt. |
| Hosting „Laptop und Handy, aber nur ich“ | Empfehlung: Cloudflare Pages + Cloudflare Access (siehe unten) |

### Empfehlung Hosting: Cloudflare Pages + Access

- Der Code bleibt im privaten GitHub-Repo, Cloudflare veröffentlicht ihn bei jedem Push automatisch.
- Vor der Seite steht ein Login: nur meine E-Mail-Adresse kommt rein (Code per Mail oder Login mit Apple, GitHub oder Google).
- Laptop und iPhone melden sich je einmal an und bleiben angemeldet. Alle anderen sehen nur die Anmeldemaske.
- Kostenlos für einzelne Nutzer.
- Hinter demselben Login kann später auch der Abgleich zwischen den Geräten laufen, ganz ohne Token.
