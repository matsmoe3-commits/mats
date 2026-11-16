# Hinweise für Claude

Persönlicher Hub von Mats. Sprache für Oberfläche, Commits und Antworten: Deutsch.

## Verbindliche Grundsätze

Lies `GRUNDSAETZE.md` vor jeder Änderung. Kurzfassung:

1. **Nur Mats hat Zugriff.** Externe Dienste sind erlaubt (GitHub, Cloudflare, KI-Anbieter), aber nichts ist öffentlich. Kein GitHub Pages, keine Adresse ohne Login, Repos privat. Keine Tokens oder Passwörter im Repo.
2. **Auf Laptop und iPhone nutzbar**, mit demselben Stand auf allen Geräten.
3. **Mega einfach**: einmal anmelden, dann keine Technik mehr sehen.

Neue Funktionen, die etwas öffentlich machen oder Dritten Zugriff geben könnten: vorher benennen und Mats fragen.

## Stil

- Schlicht, wenig „KI-Look“: keine Emojis, keine Slogans, keine Gedankenstriche in UI-Texten. Akzentfarbe Helllila, sparsam einsetzen.
- Kein Build-Schritt, reines HTML/CSS/JS mit ES-Modulen. Bibliotheken liegen in `vendor/`.
- Ideen, die der Hub mitbringen soll, kommen in `js/seed.js` (werden einmalig pro ID angelegt).
