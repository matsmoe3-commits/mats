# Skill-Katalog

Ausgewählte Skills, Plugins und Anbindungen für die Arbeit am Hub. Dieselben Daten zeigt das Tool *Skills* im Hub. Quelle der Wahrheit ist `js/skills-data.js`, diese Datei wird daraus erzeugt.

Recherchiert November 2026 in [anthropics/skills](https://github.com/anthropics/skills), [anthropics/claude-plugins-official](https://github.com/anthropics/claude-plugins-official), [obra/superpowers](https://github.com/obra/superpowers), [travisvn/awesome-claude-skills](https://github.com/travisvn/awesome-claude-skills) und [ComposioHQ/awesome-claude-skills](https://github.com/ComposioHQ/awesome-claude-skills), ergänzt um gezielte GitHub-Suche nach Anbindungen für die Ideen im Hub.

**Vor dem Einsatz von Community-Einträgen:** Code ansehen, bevor er installiert wird. Einträge mit Hinweis haben bekannte Risiken.

## Planen und Bauen

| Name | Art | Wofür | Wann | Quelle |
|---|---|---|---|---|
| Brainstorming | Skill | Macht aus einer groben Idee durch gezielte Fragen einen fertigen Entwurf, bevor gebaut wird. | Am Anfang jeder neuen Funktion oder jedes neuen Tools. | [obra/superpowers](https://github.com/obra/superpowers/tree/main/skills/brainstorming) |
| Writing Plans | Skill | Schreibt aus Anforderungen einen Umsetzungsplan in kleinen, prüfbaren Schritten. | Wenn eine Aufgabe mehrere Schritte hat, bevor Code geschrieben wird. | [obra/superpowers](https://github.com/obra/superpowers/tree/main/skills/writing-plans) |
| Executing Plans | Skill | Arbeitet einen fertigen Plan Schritt für Schritt ab und prüft jeden Schritt. | Wenn der Plan steht und umgesetzt werden soll. | [obra/superpowers](https://github.com/obra/superpowers/tree/main/skills/executing-plans) |
| Subagent-Driven Development | Skill | Verteilt unabhängige Teilaufgaben an eigene Unter-Agenten und prüft deren Ergebnisse. | Bei größeren Vorhaben mit mehreren unabhängigen Teilen. | [obra/superpowers](https://github.com/obra/superpowers/tree/main/skills/subagent-driven-development) |
| Dispatching Parallel Agents | Skill | Lässt mehrere Agenten gleichzeitig an unabhängigen Aufgaben arbeiten. | Wenn zwei oder mehr Aufgaben nichts miteinander zu tun haben. | [obra/superpowers](https://github.com/obra/superpowers/tree/main/skills/dispatching-parallel-agents) |
| Feature Dev | Plugin, offiziell | Kompletter Ablauf für neue Funktionen: Code erkunden, Architektur entwerfen, Qualität prüfen. | Für ein neues Tool im Hub von Anfang bis Ende. | [anthropics/claude-plugins-official](https://github.com/anthropics/claude-plugins-official/tree/main/plugins/feature-dev) |
| Using Git Worktrees | Skill | Arbeitet an einer neuen Funktion in einer abgetrennten Kopie, ohne den Hauptstand zu stören. | Wenn mehrere Dinge gleichzeitig entwickelt werden. | [obra/superpowers](https://github.com/obra/superpowers/tree/main/skills/using-git-worktrees) |
| Finishing a Development Branch | Skill | Hilft beim Abschluss: zusammenführen, Pull Request oder verwerfen, sauber entschieden. | Wenn eine Funktion fertig und getestet ist. | [obra/superpowers](https://github.com/obra/superpowers/tree/main/skills/finishing-a-development-branch) |
| Commit Commands | Plugin, offiziell | Einfache Befehle zum Committen, Pushen und Pull Requests erstellen. | Für den täglichen Git-Ablauf. | [anthropics/claude-plugins-official](https://github.com/anthropics/claude-plugins-official/tree/main/plugins/commit-commands) |
| CLAUDE.md Management | Plugin, offiziell | Pflegt die CLAUDE.md: prüft die Qualität und hält Erkenntnisse aus Sitzungen fest. | Damit jede Sitzung die Regeln und Grundsätze des Hubs kennt. | [anthropics/claude-plugins-official](https://github.com/anthropics/claude-plugins-official/tree/main/plugins/claude-md-management) |
| Claude Code Setup | Plugin, offiziell | Analysiert ein Projekt und empfiehlt passende Automatisierungen: Hooks, Skills, MCP-Server, Unter-Agenten. | Um herauszufinden, welche Werkzeuge sich für den Hub lohnen. | [anthropics/claude-plugins-official](https://github.com/anthropics/claude-plugins-official/tree/main/plugins/claude-code-setup) |

## Testen und Qualität

| Name | Art | Wofür | Wann | Quelle |
|---|---|---|---|---|
| Test-Driven Development | Skill | Erst den Test schreiben, dann den Code. Verhindert, dass Fehler unbemerkt bleiben. | Bei jeder neuen Funktion und jeder Fehlerbehebung. | [obra/superpowers](https://github.com/obra/superpowers/tree/main/skills/test-driven-development) |
| Systematic Debugging | Skill | Findet die eigentliche Ursache eines Fehlers, bevor etwas repariert wird. | Wenn etwas nicht funktioniert oder ein Test fehlschlägt. | [obra/superpowers](https://github.com/obra/superpowers/tree/main/skills/systematic-debugging) |
| Verification Before Completion | Skill | Erst prüfen, dann „fertig“ sagen: Tests wirklich laufen lassen und Ergebnis zeigen. | Vor jedem Commit und jeder Fertigmeldung. | [obra/superpowers](https://github.com/obra/superpowers/tree/main/skills/verification-before-completion) |
| Webapp Testing | Skill, offiziell | Testet Web-Apps im echten Browser mit Playwright: klicken, Screenshots, Fehlermeldungen lesen. | Um den Hub nach Änderungen im Browser zu prüfen, auch auf Handy-Größe. | [anthropics/skills](https://github.com/anthropics/skills/tree/main/skills/webapp-testing) |
| Code Review | Plugin, offiziell | Prüft Pull Requests mit mehreren spezialisierten Agenten und bewertet, wie sicher jeder Fund ist. | Bevor eine größere Änderung übernommen wird. | [anthropics/claude-plugins-official](https://github.com/anthropics/claude-plugins-official/tree/main/plugins/code-review) |
| Requesting Code Review | Skill | Lässt fertige Arbeit vor dem Zusammenführen gegen die Anforderungen prüfen. | Nach einer größeren Funktion. | [obra/superpowers](https://github.com/obra/superpowers/tree/main/skills/requesting-code-review) |
| Security Guidance | Plugin, offiziell | Warnt schon beim Schreiben vor Sicherheitslücken wie Einschleusung oder XSS und prüft jeden Commit. | Dauerhaft, weil im Hub persönliche Daten liegen. | [anthropics/claude-plugins-official](https://github.com/anthropics/claude-plugins-official/tree/main/plugins/security-guidance) |
| Claude Security | Plugin, offiziell | Gründliche Schwachstellen-Suche im eigenen Code, jeder Fund wird vor dem Melden gegengeprüft. | Vor dem Online-Stellen und regelmäßig danach. | [anthropics/claude-plugins-official](https://github.com/anthropics/claude-plugins-official/tree/main/plugins/claude-security) |

## Design und Oberfläche

| Name | Art | Wofür | Wann | Quelle |
|---|---|---|---|---|
| Frontend Design | Skill, offiziell | Hilft bei eigenständigem Design: Stil, Schrift und Entscheidungen, die nicht nach Standard-Vorlage aussehen. | Bei jeder neuen Oberfläche im Hub, gegen den „KI-Look“. | [anthropics/skills](https://github.com/anthropics/skills/tree/main/skills/frontend-design) |
| Theme Factory | Skill, offiziell | Zehn fertige Farb- und Schrift-Themen für Seiten, Berichte und Folien. | Wenn schnell ein stimmiges Farbschema gebraucht wird. | [anthropics/skills](https://github.com/anthropics/skills/tree/main/skills/theme-factory) |
| Playground | Plugin, offiziell | Baut kleine interaktive HTML-Spielwiesen mit Reglern und Live-Vorschau. | Um Varianten auszuprobieren, z. B. Farben oder Kamerawinkel der Stadt. | [anthropics/claude-plugins-official](https://github.com/anthropics/claude-plugins-official/tree/main/plugins/playground) |
| 3DViz Pro Max | Skill | Skill für 3D-Visualisierungen mit Three.js oder Blender, von der Idee zur Szene. | Für die Stadt: neue Gebäude, Licht, Animationen wie der Briefträger. | [viettranx/3dviz-pro-max](https://github.com/viettranx/3dviz-pro-max) |
| SwiftUI Agent Skill | Skill | Fundiertes Wissen für SwiftUI-Apps, von einem bekannten Swift-Lehrer. | Falls der Hub eine eigene iPhone- oder Apple-TV-App bekommt. | [twostraws/SwiftUI-Agent-Skill](https://github.com/twostraws/SwiftUI-Agent-Skill) |
| Apple Platform Skills | Skill | Skills für iOS-, macOS- und iPadOS-Entwicklung, von der Produktidee bis zum Code. | Für eine eigene Apple-App rund um den Hub. | [rshankras/claude-code-apple-skills](https://github.com/rshankras/claude-code-apple-skills) |
| Canvas Design | Skill, offiziell | Gestaltet Poster und Grafiken als PNG oder PDF. | Für einzelne Grafiken, z. B. Icons oder Bilder für Gebäudeschilder. | [anthropics/skills](https://github.com/anthropics/skills/tree/main/skills/canvas-design) |

## Dateien und Dokumente

| Name | Art | Wofür | Wann | Quelle |
|---|---|---|---|---|
| XLSX / CSV | Skill, offiziell | Liest, bereinigt und wertet Tabellen und CSV-Dateien aus. | Für Bank-CSVs, PayPal-Exporte und den LinkedIn-Export. | [anthropics/skills](https://github.com/anthropics/skills/tree/main/skills/xlsx) |
| PDF | Skill, offiziell | Liest Text und Tabellen aus PDFs, füllt Formulare aus, fügt Dateien zusammen. | Für Finanzberichte, Kontoauszüge und Verträge als PDF. | [anthropics/skills](https://github.com/anthropics/skills/tree/main/skills/pdf) |
| DOCX | Skill, offiziell | Erstellt und bearbeitet Word-Dokumente. | Zum Beispiel für einen automatisch erzeugten Lebenslauf. | [anthropics/skills](https://github.com/anthropics/skills/tree/main/skills/docx) |
| Invoice Organizer | Skill | Sortiert Rechnungen und Belege, liest die Daten aus und benennt Dateien einheitlich. | Für den Finanz-Eingang und die Steuer. | [ComposioHQ/awesome-claude-skills](https://github.com/ComposioHQ/awesome-claude-skills/tree/master/invoice-organizer) |
| Tailored Resume Generator | Skill | Passt den Lebenslauf an eine konkrete Stellenanzeige an. | Wenn der Karriere-Agent eine passende Rolle findet. | [ComposioHQ/awesome-claude-skills](https://github.com/ComposioHQ/awesome-claude-skills/tree/master/tailored-resume-generator) |
| CSV Data Summarizer | Skill | Wertet CSV-Dateien automatisch aus und erzeugt Übersichten mit Diagrammen. | Für schnelle Auswertungen, z. B. Ausgaben pro Monat. | [coffeefuelbump/csv-data-summarizer-claude-skill](https://github.com/coffeefuelbump/csv-data-summarizer-claude-skill) |
| Google Takeout Parser | Werkzeug | Bibliothek, die den Google-Datenexport (Takeout) lesbar macht. | Um die gespeicherten Orte aus Google Maps in den Hub zu holen. | [purarue/google_takeout_parser](https://github.com/purarue/google_takeout_parser) |

## Apple und Zuhause

| Name | Art | Wofür | Wann | Quelle |
|---|---|---|---|---|
| CalDAV MCP | Anbindung (MCP) | Anbindung an Kalender über CalDAV, das Verfahren, das auch iCloud nutzt. | Für den iCloud-Kalender, mit einem app-spezifischen Passwort von Apple. | [dominik1001/caldav-mcp](https://github.com/dominik1001/caldav-mcp) |
| iCloud Calendar MCP | Anbindung (MCP) | Eigens für den iCloud-Kalender gebaute Anbindung, im offiziellen MCP-Verzeichnis gelistet. | Alternative zu CalDAV MCP, speziell für iCloud. | [icloud-calendar-mcp/icloud-calendar-mcp](https://github.com/icloud-calendar-mcp/icloud-calendar-mcp) |
| macOS Calendar & Reminders MCP | Anbindung (MCP) | Greift auf dem Mac direkt auf Kalender und Erinnerungen zu. | Wenn ein Mac dauerhaft läuft und Erinnerungen dazukommen sollen. | [PsychQuant/che-ical-mcp](https://github.com/PsychQuant/che-ical-mcp) |
| HomeClaw (HomeKit) | Anbindung (MCP) | Steuert Apple Home: Lichter, Thermostate, Schlösser und Szenen. | Für die Smart-Home-Idee mit Apple Home. | [omarshahine/HomeClaw](https://github.com/omarshahine/HomeClaw) |
| Home Assistant MCP | Anbindung (MCP) | Steuert und automatisiert Home Assistant, sehr verbreitet. | Falls später Home Assistant als Zentrale dazukommt (kann Apple-Home-Geräte einbinden). | [homeassistant-ai/ha-mcp](https://github.com/homeassistant-ai/ha-mcp) |
| Apple Health MCP | Anbindung (MCP) | Beantwortet Fragen zu Schlaf, Training und Aktivität aus Apple-Health-Daten, lokal. | Für die Gesundheits-Idee und das Morgen-Briefing. | [neiltron/apple-health-mcp](https://github.com/neiltron/apple-health-mcp) |
| Apple Music MCP | Anbindung (MCP) | Zugriff auf Apple Music: Playlists, Mediathek, Katalog und Wiedergabe. | Für die Musik-Empfehlungen. | [epheterson/applemusic-mcp](https://github.com/epheterson/applemusic-mcp) |
| WhisperLiveKit | Werkzeug | Spracherkennung in Echtzeit, läuft lokal auf dem eigenen Rechner. | Für den Sprach-Eingang, wenn Aufnahmen nicht zu einem fremden Dienst sollen. | [QuentinFuxa/WhisperLiveKit](https://github.com/QuentinFuxa/WhisperLiveKit) |

## Nachrichten und Netzwerk

| Name | Art | Wofür | Wann | Quelle |
|---|---|---|---|---|
| WhatsApp MCP | Anbindung (MCP) | Liest und durchsucht die eigenen WhatsApp-Chats, Daten bleiben in einer lokalen Datenbank. **Hinweis:** Inoffiziell über WhatsApp Web. Verstößt gegen die Nutzungsbedingungen, Sperre des Kontos möglich. Letzte Änderung im Repo Mitte 2025. | Für den WhatsApp-Assistenten, nur lesend einsetzen. | [lharries/whatsapp-mcp](https://github.com/lharries/whatsapp-mcp) |
| iMessage | Plugin, offiziell | Liest iMessage-Chats direkt auf dem Mac, mit eingebauter Zugriffskontrolle. | Falls neben WhatsApp auch iMessage in den Assistenten soll. | [anthropics/claude-plugins-official](https://github.com/anthropics/claude-plugins-official/tree/main/external_plugins/imessage) |
| Telegram-Kanal | Plugin, offiziell | Verbindet Claude Code mit Telegram, inklusive Zugriffskontrolle. | Als Weg, das Morgen-Briefing als Nachricht aufs Handy zu bekommen. | [anthropics/claude-plugins-official](https://github.com/anthropics/claude-plugins-official/tree/main/external_plugins/telegram) |
| LinkedIn MCP Server | Anbindung (MCP) | Zugriff auf LinkedIn-Profile, Firmen und Stellenanzeigen. **Hinweis:** Inoffiziell. Automatisiertes Auslesen verstößt gegen die LinkedIn-Nutzungsbedingungen, Sperre des Kontos möglich. | Für Karriere-Agent und Updates zu Kontakten, ergänzend zum offiziellen Export. | [stickerdaniel/linkedin-mcp-server](https://github.com/stickerdaniel/linkedin-mcp-server) |

## Karten, Wetter, Reise

| Name | Art | Wofür | Wann | Quelle |
|---|---|---|---|---|
| Google Maps MCP | Anbindung (MCP) | 18 Werkzeuge für Ortssuche, Routen und Reiseplanung über Google Maps. **Hinweis:** Braucht einen Google-Maps-API-Schlüssel (mit Kostenlimit einrichten). | Für Restaurant-Empfehlungen unterwegs und Reiseplanung. | [cablate/mcp-google-map](https://github.com/cablate/mcp-google-map) |
| Open-Meteo MCP | Anbindung (MCP) | Wetterdaten über Open-Meteo, kostenlos und ohne Anmeldung. | Für das Wetter im Morgen-Briefing und in der Stadt. | [cmer81/open-meteo-mcp](https://github.com/cmer81/open-meteo-mcp) |

## Hosting und Sicherheit

| Name | Art | Wofür | Wann | Quelle |
|---|---|---|---|---|
| Cloudflare MCP | Anbindung (MCP), offiziell | Offizielle Anbindung an Cloudflare: Seiten, Speicher, Zugriffsschutz verwalten. | Zum Einrichten von Cloudflare Pages mit Login für den Hub. | [cloudflare/mcp-server-cloudflare](https://github.com/cloudflare/mcp-server-cloudflare) |
| GitHub | Plugin, offiziell | Offizielle GitHub-Anbindung: Repos, Issues, Pull Requests, Code-Review. | Für die Arbeit am privaten Repo des Hubs. | [anthropics/claude-plugins-official](https://github.com/anthropics/claude-plugins-official/tree/main/external_plugins/github) |
| Context7 | Plugin, offiziell | Holt aktuelle Dokumentation von Bibliotheken, statt auf veraltetes Wissen zu setzen. | Wenn mit Three.js, Cloudflare oder Apple-Schnittstellen gearbeitet wird. | [anthropics/claude-plugins-official](https://github.com/anthropics/claude-plugins-official/tree/main/external_plugins/context7) |

## Skills und Anbindungen bauen

| Name | Art | Wofür | Wann | Quelle |
|---|---|---|---|---|
| Skill Creator | Skill, offiziell | Erstellt neue Skills, verbessert bestehende und misst, wie gut sie funktionieren. | Wenn es für eine Aufgabe noch keinen passenden Skill gibt. | [anthropics/skills](https://github.com/anthropics/skills/tree/main/skills/skill-creator) |
| Writing Skills | Skill | Leitfaden zum Schreiben und Testen eigener Skills. | Ergänzend zum Skill Creator. | [obra/superpowers](https://github.com/obra/superpowers/tree/main/skills/writing-skills) |
| MCP Builder | Skill, offiziell | Leitfaden für eigene MCP-Server, um Dienste anzubinden, für die es noch nichts Gutes gibt. | Wenn eine Anbindung fehlt oder die vorhandenen nicht vertrauenswürdig sind. | [anthropics/skills](https://github.com/anthropics/skills/tree/main/skills/mcp-builder) |
| MCP Server Dev | Plugin, offiziell | Skills für Entwurf und Betrieb von MCP-Servern: Bereitstellung, Werkzeug-Design, Anmeldung. | Wenn eine eigene Anbindung online laufen soll, z. B. hinter dem Cloudflare-Login. | [anthropics/claude-plugins-official](https://github.com/anthropics/claude-plugins-official/tree/main/plugins/mcp-server-dev) |
| Plugin Dev | Plugin, offiziell | Werkzeugkasten für eigene Claude-Code-Plugins mit Agenten, Befehlen und Hooks. | Um Agenten des Hubs als Plugin zu bündeln. | [anthropics/claude-plugins-official](https://github.com/anthropics/claude-plugins-official/tree/main/plugins/plugin-dev) |

