# Hinweise für Claude

Persönlicher Hub von Mats. Sprache für Oberfläche, Commits und Antworten: Deutsch.

## Verbindliche Grundsätze

Lies `GRUNDSAETZE.md` vor jeder Änderung. Kurzfassung:

1. **Nichts nach extern.** Keine Daten in lesbarer Form an fremde Server. Keine CDNs, Fonts, Analyse- oder Tracking-Dienste. Bibliotheken liegen in `vendor/`. Was doch extern liegen muss, nur Ende-zu-Ende-verschlüsselt.
2. **Nur Mats kommt rein.** Nie öffentlich veröffentlichen (kein GitHub Pages, keine offenen Adressen). Keine Tokens oder Passwörter im Repo.
3. **Überall nutzbar**, auf iPhone, Mac und Browser.
4. **Mega einfach** zu bedienen. Sicherheit darf die Bedienung nicht verkomplizieren.

Neue Funktionen, die Daten nach außen schicken würden: vorher benennen und Mats fragen, nicht einfach einbauen.

## Stil

- Schlicht, wenig „KI-Look“: keine Emojis, keine Slogans, keine Gedankenstriche in UI-Texten. Akzentfarbe Helllila, sparsam einsetzen.
- Kein Build-Schritt, reines HTML/CSS/JS mit ES-Modulen.
- Ideen, die der Hub mitbringen soll, kommen in `js/seed.js` (werden einmalig pro ID angelegt).
