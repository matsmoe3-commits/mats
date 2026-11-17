// Skill-Katalog: ausgewählte Skills, Plugins und Anbindungen (MCP-Server) aus GitHub.
// Recherchiert November 2026 in: anthropics/skills, anthropics/claude-plugins-official,
// obra/superpowers, travisvn/awesome-claude-skills, ComposioHQ/awesome-claude-skills
// sowie gezielte GitHub-Suche nach Anbindungen für die Ideen im Hub.
//
// Felder: kind  = skill | plugin | mcp | tool
//         trust = offiziell (Anthropic oder Hersteller) | community
//         ideas = IDs aus js/seed.js, für die der Eintrag besonders nützlich ist
//         note  = Hinweis, der vor dem Einsatz wichtig ist

const gh = (path) => `https://github.com/${path}`;
const AS = (name) => gh(`anthropics/skills/tree/main/skills/${name}`);
const AP = (name) => gh(`anthropics/claude-plugins-official/tree/main/plugins/${name}`);
const AE = (name) => gh(`anthropics/claude-plugins-official/tree/main/external_plugins/${name}`);
const SP = (name) => gh(`obra/superpowers/tree/main/skills/${name}`);

export const CATEGORIES = [
  'Planen und Bauen',
  'Testen und Qualität',
  'Design und Oberfläche',
  'Dateien und Dokumente',
  'Apple und Zuhause',
  'Nachrichten und Netzwerk',
  'Karten, Wetter, Reise',
  'Hosting und Sicherheit',
  'Skills und Anbindungen bauen',
];

const ALL_DEV = ['seed-developer-agent'];

export const SKILLS = [
  // ---------- Planen und Bauen ----------
  { id: 'brainstorming', name: 'Brainstorming', kind: 'skill', trust: 'community', source: 'obra/superpowers', url: SP('brainstorming'),
    category: 'Planen und Bauen',
    de: 'Macht aus einer groben Idee durch gezielte Fragen einen fertigen Entwurf, bevor gebaut wird.',
    when: 'Am Anfang jeder neuen Funktion oder jedes neuen Tools.',
    keywords: ['idee', 'ideen', 'entwurf', 'planen', 'konzept', 'neu', 'feature', 'funktion', 'brainstorm', 'design'],
    ideas: [...ALL_DEV, 'seed-stadt-menue'] },
  { id: 'writing-plans', name: 'Writing Plans', kind: 'skill', trust: 'community', source: 'obra/superpowers', url: SP('writing-plans'),
    category: 'Planen und Bauen',
    de: 'Schreibt aus Anforderungen einen Umsetzungsplan in kleinen, prüfbaren Schritten.',
    when: 'Wenn eine Aufgabe mehrere Schritte hat, bevor Code geschrieben wird.',
    keywords: ['plan', 'planen', 'schritte', 'roadmap', 'umsetzung', 'aufgabe', 'anforderungen'],
    ideas: ALL_DEV },
  { id: 'executing-plans', name: 'Executing Plans', kind: 'skill', trust: 'community', source: 'obra/superpowers', url: SP('executing-plans'),
    category: 'Planen und Bauen',
    de: 'Arbeitet einen fertigen Plan Schritt für Schritt ab und prüft jeden Schritt.',
    when: 'Wenn der Plan steht und umgesetzt werden soll.',
    keywords: ['plan', 'umsetzen', 'abarbeiten', 'bauen', 'implementieren'],
    ideas: ALL_DEV },
  { id: 'subagent-driven-development', name: 'Subagent-Driven Development', kind: 'skill', trust: 'community', source: 'obra/superpowers', url: SP('subagent-driven-development'),
    category: 'Planen und Bauen',
    de: 'Verteilt unabhängige Teilaufgaben an eigene Unter-Agenten und prüft deren Ergebnisse.',
    when: 'Bei größeren Vorhaben mit mehreren unabhängigen Teilen.',
    keywords: ['agenten', 'subagent', 'parallel', 'aufteilen', 'gross', 'team'],
    ideas: ALL_DEV },
  { id: 'dispatching-parallel-agents', name: 'Dispatching Parallel Agents', kind: 'skill', trust: 'community', source: 'obra/superpowers', url: SP('dispatching-parallel-agents'),
    category: 'Planen und Bauen',
    de: 'Lässt mehrere Agenten gleichzeitig an unabhängigen Aufgaben arbeiten.',
    when: 'Wenn zwei oder mehr Aufgaben nichts miteinander zu tun haben.',
    keywords: ['parallel', 'gleichzeitig', 'agenten', 'schneller'],
    ideas: ALL_DEV },
  { id: 'feature-dev', name: 'Feature Dev', kind: 'plugin', trust: 'offiziell', source: 'anthropics/claude-plugins-official', url: AP('feature-dev'),
    category: 'Planen und Bauen',
    de: 'Kompletter Ablauf für neue Funktionen: Code erkunden, Architektur entwerfen, Qualität prüfen.',
    when: 'Für ein neues Tool im Hub von Anfang bis Ende.',
    keywords: ['feature', 'funktion', 'tool', 'neu', 'bauen', 'architektur', 'entwickeln'],
    ideas: ALL_DEV },
  { id: 'using-git-worktrees', name: 'Using Git Worktrees', kind: 'skill', trust: 'community', source: 'obra/superpowers', url: SP('using-git-worktrees'),
    category: 'Planen und Bauen',
    de: 'Arbeitet an einer neuen Funktion in einer abgetrennten Kopie, ohne den Hauptstand zu stören.',
    when: 'Wenn mehrere Dinge gleichzeitig entwickelt werden.',
    keywords: ['git', 'branch', 'worktree', 'isoliert', 'parallel'],
    ideas: ALL_DEV },
  { id: 'finishing-a-development-branch', name: 'Finishing a Development Branch', kind: 'skill', trust: 'community', source: 'obra/superpowers', url: SP('finishing-a-development-branch'),
    category: 'Planen und Bauen',
    de: 'Hilft beim Abschluss: zusammenführen, Pull Request oder verwerfen, sauber entschieden.',
    when: 'Wenn eine Funktion fertig und getestet ist.',
    keywords: ['fertig', 'abschluss', 'merge', 'pull', 'request', 'branch', 'git'],
    ideas: ALL_DEV },
  { id: 'commit-commands', name: 'Commit Commands', kind: 'plugin', trust: 'offiziell', source: 'anthropics/claude-plugins-official', url: AP('commit-commands'),
    category: 'Planen und Bauen',
    de: 'Einfache Befehle zum Committen, Pushen und Pull Requests erstellen.',
    when: 'Für den täglichen Git-Ablauf.',
    keywords: ['git', 'commit', 'push', 'pull', 'request', 'speichern', 'github'],
    ideas: ALL_DEV },
  { id: 'claude-md-management', name: 'CLAUDE.md Management', kind: 'plugin', trust: 'offiziell', source: 'anthropics/claude-plugins-official', url: AP('claude-md-management'),
    category: 'Planen und Bauen',
    de: 'Pflegt die CLAUDE.md: prüft die Qualität und hält Erkenntnisse aus Sitzungen fest.',
    when: 'Damit jede Sitzung die Regeln und Grundsätze des Hubs kennt.',
    keywords: ['claude', 'regeln', 'grundsaetze', 'gedaechtnis', 'projekt', 'anweisungen'],
    ideas: ALL_DEV },
  { id: 'claude-code-setup', name: 'Claude Code Setup', kind: 'plugin', trust: 'offiziell', source: 'anthropics/claude-plugins-official', url: AP('claude-code-setup'),
    category: 'Planen und Bauen',
    de: 'Analysiert ein Projekt und empfiehlt passende Automatisierungen: Hooks, Skills, MCP-Server, Unter-Agenten.',
    when: 'Um herauszufinden, welche Werkzeuge sich für den Hub lohnen.',
    keywords: ['empfehlung', 'automatisierung', 'setup', 'hooks', 'skills', 'mcp', 'agenten'],
    ideas: ALL_DEV },

  // ---------- Testen und Qualität ----------
  { id: 'test-driven-development', name: 'Test-Driven Development', kind: 'skill', trust: 'community', source: 'obra/superpowers', url: SP('test-driven-development'),
    category: 'Testen und Qualität',
    de: 'Erst den Test schreiben, dann den Code. Verhindert, dass Fehler unbemerkt bleiben.',
    when: 'Bei jeder neuen Funktion und jeder Fehlerbehebung.',
    keywords: ['test', 'testen', 'tdd', 'qualitaet', 'fehler'],
    ideas: ALL_DEV },
  { id: 'systematic-debugging', name: 'Systematic Debugging', kind: 'skill', trust: 'community', source: 'obra/superpowers', url: SP('systematic-debugging'),
    category: 'Testen und Qualität',
    de: 'Findet die eigentliche Ursache eines Fehlers, bevor etwas repariert wird.',
    when: 'Wenn etwas nicht funktioniert oder ein Test fehlschlägt.',
    keywords: ['fehler', 'bug', 'debug', 'debugging', 'kaputt', 'problem', 'ursache', 'finden', 'funktioniert'],
    ideas: ALL_DEV },
  { id: 'verification-before-completion', name: 'Verification Before Completion', kind: 'skill', trust: 'community', source: 'obra/superpowers', url: SP('verification-before-completion'),
    category: 'Testen und Qualität',
    de: 'Erst prüfen, dann „fertig“ sagen: Tests wirklich laufen lassen und Ergebnis zeigen.',
    when: 'Vor jedem Commit und jeder Fertigmeldung.',
    keywords: ['pruefen', 'fertig', 'verifizieren', 'test', 'qualitaet'],
    ideas: ALL_DEV },
  { id: 'webapp-testing', name: 'Webapp Testing', kind: 'skill', trust: 'offiziell', source: 'anthropics/skills', url: AS('webapp-testing'),
    category: 'Testen und Qualität',
    de: 'Testet Web-Apps im echten Browser mit Playwright: klicken, Screenshots, Fehlermeldungen lesen.',
    when: 'Um den Hub nach Änderungen im Browser zu prüfen, auch auf Handy-Größe.',
    keywords: ['test', 'testen', 'browser', 'playwright', 'screenshot', 'webapp', 'handy', 'oberflaeche'],
    ideas: ALL_DEV },
  { id: 'code-review', name: 'Code Review', kind: 'plugin', trust: 'offiziell', source: 'anthropics/claude-plugins-official', url: AP('code-review'),
    category: 'Testen und Qualität',
    de: 'Prüft Pull Requests mit mehreren spezialisierten Agenten und bewertet, wie sicher jeder Fund ist.',
    when: 'Bevor eine größere Änderung übernommen wird.',
    keywords: ['review', 'pruefen', 'code', 'pull', 'request', 'qualitaet'],
    ideas: ALL_DEV },
  { id: 'requesting-code-review', name: 'Requesting Code Review', kind: 'skill', trust: 'community', source: 'obra/superpowers', url: SP('requesting-code-review'),
    category: 'Testen und Qualität',
    de: 'Lässt fertige Arbeit vor dem Zusammenführen gegen die Anforderungen prüfen.',
    when: 'Nach einer größeren Funktion.',
    keywords: ['review', 'pruefen', 'anforderungen', 'fertig'],
    ideas: ALL_DEV },
  { id: 'security-guidance', name: 'Security Guidance', kind: 'plugin', trust: 'offiziell', source: 'anthropics/claude-plugins-official', url: AP('security-guidance'),
    category: 'Testen und Qualität',
    de: 'Warnt schon beim Schreiben vor Sicherheitslücken wie Einschleusung oder XSS und prüft jeden Commit.',
    when: 'Dauerhaft, weil im Hub persönliche Daten liegen.',
    keywords: ['sicherheit', 'security', 'luecke', 'xss', 'schutz', 'daten', 'privat'],
    ideas: [...ALL_DEV, 'seed-kontrollraum'] },
  { id: 'claude-security', name: 'Claude Security', kind: 'plugin', trust: 'offiziell', source: 'anthropics/claude-plugins-official', url: AP('claude-security'),
    category: 'Testen und Qualität',
    de: 'Gründliche Schwachstellen-Suche im eigenen Code, jeder Fund wird vor dem Melden gegengeprüft.',
    when: 'Vor dem Online-Stellen und regelmäßig danach.',
    keywords: ['sicherheit', 'security', 'schwachstelle', 'audit', 'pruefen', 'online'],
    ideas: [...ALL_DEV, 'seed-kontrollraum'] },

  // ---------- Design und Oberfläche ----------
  { id: 'frontend-design', name: 'Frontend Design', kind: 'skill', trust: 'offiziell', source: 'anthropics/skills', url: AS('frontend-design'),
    category: 'Design und Oberfläche',
    de: 'Hilft bei eigenständigem Design: Stil, Schrift und Entscheidungen, die nicht nach Standard-Vorlage aussehen.',
    when: 'Bei jeder neuen Oberfläche im Hub, gegen den „KI-Look“.',
    keywords: ['design', 'oberflaeche', 'ui', 'aussehen', 'schoen', 'stil', 'schrift', 'clean', 'look'],
    ideas: [...ALL_DEV, 'seed-stadt-menue'] },
  { id: 'theme-factory', name: 'Theme Factory', kind: 'skill', trust: 'offiziell', source: 'anthropics/skills', url: AS('theme-factory'),
    category: 'Design und Oberfläche',
    de: 'Zehn fertige Farb- und Schrift-Themen für Seiten, Berichte und Folien.',
    when: 'Wenn schnell ein stimmiges Farbschema gebraucht wird.',
    keywords: ['farben', 'theme', 'schrift', 'stil', 'design'],
    ideas: [] },
  { id: 'playground', name: 'Playground', kind: 'plugin', trust: 'offiziell', source: 'anthropics/claude-plugins-official', url: AP('playground'),
    category: 'Design und Oberfläche',
    de: 'Baut kleine interaktive HTML-Spielwiesen mit Reglern und Live-Vorschau.',
    when: 'Um Varianten auszuprobieren, z. B. Farben oder Kamerawinkel der Stadt.',
    keywords: ['ausprobieren', 'prototyp', 'vorschau', 'regler', 'html', 'varianten'],
    ideas: ['seed-stadt-menue'] },
  { id: '3dviz-pro-max', name: '3DViz Pro Max', kind: 'skill', trust: 'community', source: 'viettranx/3dviz-pro-max', url: gh('viettranx/3dviz-pro-max'),
    category: 'Design und Oberfläche',
    de: 'Skill für 3D-Visualisierungen mit Three.js oder Blender, von der Idee zur Szene.',
    when: 'Für die Stadt: neue Gebäude, Licht, Animationen wie der Briefträger.',
    keywords: ['3d', 'threejs', 'three', 'stadt', 'gebaeude', 'animation', 'visualisierung', 'szene', 'blender'],
    ideas: ['seed-stadt-menue', 'seed-sprach-kalender', 'seed-kontrollraum'] },
  { id: 'swiftui-agent-skill', name: 'SwiftUI Agent Skill', kind: 'skill', trust: 'community', source: 'twostraws/SwiftUI-Agent-Skill', url: gh('twostraws/SwiftUI-Agent-Skill'),
    category: 'Design und Oberfläche',
    de: 'Fundiertes Wissen für SwiftUI-Apps, von einem bekannten Swift-Lehrer.',
    when: 'Falls der Hub eine eigene iPhone- oder Apple-TV-App bekommt.',
    keywords: ['iphone', 'ios', 'app', 'swift', 'swiftui', 'apple', 'tv', 'watch'],
    ideas: ['seed-fernseher', 'seed-gesundheit', 'seed-apple-music'] },
  { id: 'claude-code-apple-skills', name: 'Apple Platform Skills', kind: 'skill', trust: 'community', source: 'rshankras/claude-code-apple-skills', url: gh('rshankras/claude-code-apple-skills'),
    category: 'Design und Oberfläche',
    de: 'Skills für iOS-, macOS- und iPadOS-Entwicklung, von der Produktidee bis zum Code.',
    when: 'Für eine eigene Apple-App rund um den Hub.',
    keywords: ['iphone', 'ios', 'macos', 'mac', 'app', 'apple', 'swift'],
    ideas: ['seed-fernseher', 'seed-gesundheit'] },
  { id: 'canvas-design', name: 'Canvas Design', kind: 'skill', trust: 'offiziell', source: 'anthropics/skills', url: AS('canvas-design'),
    category: 'Design und Oberfläche',
    de: 'Gestaltet Poster und Grafiken als PNG oder PDF.',
    when: 'Für einzelne Grafiken, z. B. Icons oder Bilder für Gebäudeschilder.',
    keywords: ['grafik', 'poster', 'bild', 'icon', 'png', 'design'],
    ideas: [] },

  // ---------- Dateien und Dokumente ----------
  { id: 'xlsx', name: 'XLSX / CSV', kind: 'skill', trust: 'offiziell', source: 'anthropics/skills', url: AS('xlsx'),
    category: 'Dateien und Dokumente',
    de: 'Liest, bereinigt und wertet Tabellen und CSV-Dateien aus.',
    when: 'Für Bank-CSVs, PayPal-Exporte und den LinkedIn-Export.',
    keywords: ['csv', 'tabelle', 'excel', 'xlsx', 'bank', 'paypal', 'export', 'daten', 'finanzen', 'auswerten'],
    ideas: ['seed-finanz-eingang', 'seed-linkedin-kontakte'] },
  { id: 'pdf', name: 'PDF', kind: 'skill', trust: 'offiziell', source: 'anthropics/skills', url: AS('pdf'),
    category: 'Dateien und Dokumente',
    de: 'Liest Text und Tabellen aus PDFs, füllt Formulare aus, fügt Dateien zusammen.',
    when: 'Für Finanzberichte, Kontoauszüge und Verträge als PDF.',
    keywords: ['pdf', 'bericht', 'kontoauszug', 'vertrag', 'dokument', 'auslesen', 'finanzen'],
    ideas: ['seed-finanz-eingang'] },
  { id: 'docx', name: 'DOCX', kind: 'skill', trust: 'offiziell', source: 'anthropics/skills', url: AS('docx'),
    category: 'Dateien und Dokumente',
    de: 'Erstellt und bearbeitet Word-Dokumente.',
    when: 'Zum Beispiel für einen automatisch erzeugten Lebenslauf.',
    keywords: ['word', 'docx', 'dokument', 'lebenslauf', 'cv', 'brief'],
    ideas: ['seed-karriere'] },
  { id: 'invoice-organizer', name: 'Invoice Organizer', kind: 'skill', trust: 'community', source: 'ComposioHQ/awesome-claude-skills', url: gh('ComposioHQ/awesome-claude-skills/tree/master/invoice-organizer'),
    category: 'Dateien und Dokumente',
    de: 'Sortiert Rechnungen und Belege, liest die Daten aus und benennt Dateien einheitlich.',
    when: 'Für den Finanz-Eingang und die Steuer.',
    keywords: ['rechnung', 'rechnungen', 'beleg', 'belege', 'finanzen', 'steuererklaerung', 'sortieren', 'quittung'],
    ideas: ['seed-finanz-eingang'] },
  { id: 'tailored-resume-generator', name: 'Tailored Resume Generator', kind: 'skill', trust: 'community', source: 'ComposioHQ/awesome-claude-skills', url: gh('ComposioHQ/awesome-claude-skills/tree/master/tailored-resume-generator'),
    category: 'Dateien und Dokumente',
    de: 'Passt den Lebenslauf an eine konkrete Stellenanzeige an.',
    when: 'Wenn der Karriere-Agent eine passende Rolle findet.',
    keywords: ['lebenslauf', 'cv', 'bewerbung', 'job', 'stelle', 'karriere', 'rolle'],
    ideas: ['seed-karriere'] },
  { id: 'csv-data-summarizer', name: 'CSV Data Summarizer', kind: 'skill', trust: 'community', source: 'coffeefuelbump/csv-data-summarizer-claude-skill', url: gh('coffeefuelbump/csv-data-summarizer-claude-skill'),
    category: 'Dateien und Dokumente',
    de: 'Wertet CSV-Dateien automatisch aus und erzeugt Übersichten mit Diagrammen.',
    when: 'Für schnelle Auswertungen, z. B. Ausgaben pro Monat.',
    keywords: ['csv', 'auswertung', 'diagramm', 'ueberblick', 'finanzen', 'ausgaben'],
    ideas: ['seed-finanz-eingang'] },
  { id: 'google-takeout-parser', name: 'Google Takeout Parser', kind: 'tool', trust: 'community', source: 'purarue/google_takeout_parser', url: gh('purarue/google_takeout_parser'),
    category: 'Dateien und Dokumente',
    de: 'Bibliothek, die den Google-Datenexport (Takeout) lesbar macht.',
    when: 'Um die gespeicherten Orte aus Google Maps in den Hub zu holen.',
    keywords: ['google', 'takeout', 'export', 'maps', 'orte', 'gespeichert', 'reise'],
    ideas: ['seed-reise'] },

  // ---------- Apple und Zuhause ----------
  { id: 'caldav-mcp', name: 'CalDAV MCP', kind: 'mcp', trust: 'community', source: 'dominik1001/caldav-mcp', url: gh('dominik1001/caldav-mcp'),
    category: 'Apple und Zuhause',
    de: 'Anbindung an Kalender über CalDAV, das Verfahren, das auch iCloud nutzt.',
    when: 'Für den iCloud-Kalender, mit einem app-spezifischen Passwort von Apple.',
    keywords: ['kalender', 'icloud', 'termin', 'termine', 'caldav', 'apple', 'eintragen'],
    ideas: ['seed-sprach-kalender', 'seed-morgen-briefing'] },
  { id: 'icloud-calendar-mcp', name: 'iCloud Calendar MCP', kind: 'mcp', trust: 'community', source: 'icloud-calendar-mcp/icloud-calendar-mcp', url: gh('icloud-calendar-mcp/icloud-calendar-mcp'),
    category: 'Apple und Zuhause',
    de: 'Eigens für den iCloud-Kalender gebaute Anbindung, im offiziellen MCP-Verzeichnis gelistet.',
    when: 'Alternative zu CalDAV MCP, speziell für iCloud.',
    keywords: ['kalender', 'icloud', 'termin', 'apple'],
    ideas: ['seed-sprach-kalender'] },
  { id: 'che-ical-mcp', name: 'macOS Calendar & Reminders MCP', kind: 'mcp', trust: 'community', source: 'PsychQuant/che-ical-mcp', url: gh('PsychQuant/che-ical-mcp'),
    category: 'Apple und Zuhause',
    de: 'Greift auf dem Mac direkt auf Kalender und Erinnerungen zu.',
    when: 'Wenn ein Mac dauerhaft läuft und Erinnerungen dazukommen sollen.',
    keywords: ['kalender', 'erinnerungen', 'mac', 'macos', 'apple', 'aufgaben'],
    ideas: ['seed-sprach-kalender'] },
  { id: 'homeclaw', name: 'HomeClaw (HomeKit)', kind: 'mcp', trust: 'community', source: 'omarshahine/HomeClaw', url: gh('omarshahine/HomeClaw'),
    category: 'Apple und Zuhause',
    de: 'Steuert Apple Home: Lichter, Thermostate, Schlösser und Szenen.',
    when: 'Für die Smart-Home-Idee mit Apple Home.',
    keywords: ['smart', 'home', 'homekit', 'apple', 'licht', 'heizung', 'thermostat', 'szene', 'zuhause', 'fernseher'],
    ideas: ['seed-smart-home', 'seed-morgen-briefing'] },
  { id: 'ha-mcp', name: 'Home Assistant MCP', kind: 'mcp', trust: 'community', source: 'homeassistant-ai/ha-mcp', url: gh('homeassistant-ai/ha-mcp'),
    category: 'Apple und Zuhause',
    de: 'Steuert und automatisiert Home Assistant, sehr verbreitet.',
    when: 'Falls später Home Assistant als Zentrale dazukommt (kann Apple-Home-Geräte einbinden).',
    keywords: ['smart', 'home', 'assistant', 'automatisierung', 'licht', 'heizung', 'zuhause'],
    ideas: ['seed-smart-home'] },
  { id: 'apple-health-mcp', name: 'Apple Health MCP', kind: 'mcp', trust: 'community', source: 'neiltron/apple-health-mcp', url: gh('neiltron/apple-health-mcp'),
    category: 'Apple und Zuhause',
    de: 'Beantwortet Fragen zu Schlaf, Training und Aktivität aus Apple-Health-Daten, lokal.',
    when: 'Für die Gesundheits-Idee und das Morgen-Briefing.',
    keywords: ['gesundheit', 'health', 'schlaf', 'training', 'schritte', 'fitness', 'gym', 'apple', 'watch'],
    ideas: ['seed-gesundheit', 'seed-morgen-briefing'] },
  { id: 'applemusic-mcp', name: 'Apple Music MCP', kind: 'mcp', trust: 'community', source: 'epheterson/applemusic-mcp', url: gh('epheterson/applemusic-mcp'),
    category: 'Apple und Zuhause',
    de: 'Zugriff auf Apple Music: Playlists, Mediathek, Katalog und Wiedergabe.',
    when: 'Für die Musik-Empfehlungen.',
    keywords: ['musik', 'apple', 'music', 'playlist', 'songs', 'empfehlung', 'hoeren'],
    ideas: ['seed-apple-music'] },
  { id: 'whisperlivekit', name: 'WhisperLiveKit', kind: 'tool', trust: 'community', source: 'QuentinFuxa/WhisperLiveKit', url: gh('QuentinFuxa/WhisperLiveKit'),
    category: 'Apple und Zuhause',
    de: 'Spracherkennung in Echtzeit, läuft lokal auf dem eigenen Rechner.',
    when: 'Für den Sprach-Eingang, wenn Aufnahmen nicht zu einem fremden Dienst sollen.',
    keywords: ['sprache', 'speech', 'text', 'einsprechen', 'diktieren', 'whisper', 'aufnahme', 'lokal'],
    ideas: ['seed-sprach-kalender', 'seed-second-brain', 'seed-perspektiven'] },

  // ---------- Nachrichten und Netzwerk ----------
  { id: 'whatsapp-mcp', name: 'WhatsApp MCP', kind: 'mcp', trust: 'community', source: 'lharries/whatsapp-mcp', url: gh('lharries/whatsapp-mcp'),
    category: 'Nachrichten und Netzwerk',
    de: 'Liest und durchsucht die eigenen WhatsApp-Chats, Daten bleiben in einer lokalen Datenbank.',
    when: 'Für den WhatsApp-Assistenten, nur lesend einsetzen.',
    keywords: ['whatsapp', 'chat', 'nachrichten', 'schreiben', 'antworten', 'freunde', 'kontakt'],
    ideas: ['seed-whatsapp-assistent', 'seed-perspektiven'],
    note: 'Inoffiziell über WhatsApp Web. Verstößt gegen die Nutzungsbedingungen, Sperre des Kontos möglich. Letzte Änderung im Repo Mitte 2025.' },
  { id: 'imessage', name: 'iMessage', kind: 'plugin', trust: 'offiziell', source: 'anthropics/claude-plugins-official', url: AE('imessage'),
    category: 'Nachrichten und Netzwerk',
    de: 'Liest iMessage-Chats direkt auf dem Mac, mit eingebauter Zugriffskontrolle.',
    when: 'Falls neben WhatsApp auch iMessage in den Assistenten soll.',
    keywords: ['imessage', 'nachrichten', 'sms', 'apple', 'chat', 'mac'],
    ideas: ['seed-whatsapp-assistent'] },
  { id: 'telegram', name: 'Telegram-Kanal', kind: 'plugin', trust: 'offiziell', source: 'anthropics/claude-plugins-official', url: AE('telegram'),
    category: 'Nachrichten und Netzwerk',
    de: 'Verbindet Claude Code mit Telegram, inklusive Zugriffskontrolle.',
    when: 'Als Weg, das Morgen-Briefing als Nachricht aufs Handy zu bekommen.',
    keywords: ['telegram', 'nachricht', 'handy', 'briefing', 'morgen', 'benachrichtigung'],
    ideas: ['seed-morgen-briefing'] },
  { id: 'linkedin-mcp-server', name: 'LinkedIn MCP Server', kind: 'mcp', trust: 'community', source: 'stickerdaniel/linkedin-mcp-server', url: gh('stickerdaniel/linkedin-mcp-server'),
    category: 'Nachrichten und Netzwerk',
    de: 'Zugriff auf LinkedIn-Profile, Firmen und Stellenanzeigen.',
    when: 'Für Karriere-Agent und Updates zu Kontakten, ergänzend zum offiziellen Export.',
    keywords: ['linkedin', 'kontakte', 'profil', 'firma', 'job', 'stellen', 'karriere', 'netzwerk'],
    ideas: ['seed-linkedin-kontakte', 'seed-karriere'],
    note: 'Inoffiziell. Automatisiertes Auslesen verstößt gegen die LinkedIn-Nutzungsbedingungen, Sperre des Kontos möglich.' },

  // ---------- Karten, Wetter, Reise ----------
  { id: 'mcp-google-map', name: 'Google Maps MCP', kind: 'mcp', trust: 'community', source: 'cablate/mcp-google-map', url: gh('cablate/mcp-google-map'),
    category: 'Karten, Wetter, Reise',
    de: '18 Werkzeuge für Ortssuche, Routen und Reiseplanung über Google Maps.',
    when: 'Für Restaurant-Empfehlungen unterwegs und Reiseplanung.',
    keywords: ['google', 'maps', 'karte', 'restaurant', 'restaurants', 'naehe', 'orte', 'route', 'reise', 'unterwegs', 'essen'],
    ideas: ['seed-reise'],
    note: 'Braucht einen Google-Maps-API-Schlüssel (mit Kostenlimit einrichten).' },
  { id: 'open-meteo-mcp', name: 'Open-Meteo MCP', kind: 'mcp', trust: 'community', source: 'cmer81/open-meteo-mcp', url: gh('cmer81/open-meteo-mcp'),
    category: 'Karten, Wetter, Reise',
    de: 'Wetterdaten über Open-Meteo, kostenlos und ohne Anmeldung.',
    when: 'Für das Wetter im Morgen-Briefing und in der Stadt.',
    keywords: ['wetter', 'temperatur', 'warm', 'regen', 'briefing', 'morgen', 'vorhersage'],
    ideas: ['seed-morgen-briefing', 'seed-stadt-menue', 'seed-reise'] },

  // ---------- Hosting und Sicherheit ----------
  { id: 'cloudflare-mcp', name: 'Cloudflare MCP', kind: 'mcp', trust: 'offiziell', source: 'cloudflare/mcp-server-cloudflare', url: gh('cloudflare/mcp-server-cloudflare'),
    category: 'Hosting und Sicherheit',
    de: 'Offizielle Anbindung an Cloudflare: Seiten, Speicher, Zugriffsschutz verwalten.',
    when: 'Zum Einrichten von Cloudflare Pages mit Login für den Hub.',
    keywords: ['cloudflare', 'hosting', 'online', 'login', 'zugriff', 'access', 'pages', 'deploy', 'sicher'],
    ideas: ALL_DEV },
  { id: 'github', name: 'GitHub', kind: 'plugin', trust: 'offiziell', source: 'anthropics/claude-plugins-official', url: AE('github'),
    category: 'Hosting und Sicherheit',
    de: 'Offizielle GitHub-Anbindung: Repos, Issues, Pull Requests, Code-Review.',
    when: 'Für die Arbeit am privaten Repo des Hubs.',
    keywords: ['github', 'repo', 'issue', 'pull', 'request', 'code'],
    ideas: ALL_DEV },
  { id: 'context7', name: 'Context7', kind: 'plugin', trust: 'offiziell', source: 'anthropics/claude-plugins-official', url: AE('context7'),
    category: 'Hosting und Sicherheit',
    de: 'Holt aktuelle Dokumentation von Bibliotheken, statt auf veraltetes Wissen zu setzen.',
    when: 'Wenn mit Three.js, Cloudflare oder Apple-Schnittstellen gearbeitet wird.',
    keywords: ['dokumentation', 'docs', 'bibliothek', 'aktuell', 'threejs', 'api'],
    ideas: ALL_DEV },

  // ---------- Skills und Anbindungen bauen ----------
  { id: 'skill-creator', name: 'Skill Creator', kind: 'skill', trust: 'offiziell', source: 'anthropics/skills', url: AS('skill-creator'),
    category: 'Skills und Anbindungen bauen',
    de: 'Erstellt neue Skills, verbessert bestehende und misst, wie gut sie funktionieren.',
    when: 'Wenn es für eine Aufgabe noch keinen passenden Skill gibt.',
    keywords: ['skill', 'erstellen', 'bauen', 'neu', 'verbessern', 'agent'],
    ideas: ALL_DEV },
  { id: 'writing-skills', name: 'Writing Skills', kind: 'skill', trust: 'community', source: 'obra/superpowers', url: SP('writing-skills'),
    category: 'Skills und Anbindungen bauen',
    de: 'Leitfaden zum Schreiben und Testen eigener Skills.',
    when: 'Ergänzend zum Skill Creator.',
    keywords: ['skill', 'schreiben', 'testen', 'eigene'],
    ideas: ALL_DEV },
  { id: 'mcp-builder', name: 'MCP Builder', kind: 'skill', trust: 'offiziell', source: 'anthropics/skills', url: AS('mcp-builder'),
    category: 'Skills und Anbindungen bauen',
    de: 'Leitfaden für eigene MCP-Server, um Dienste anzubinden, für die es noch nichts Gutes gibt.',
    when: 'Wenn eine Anbindung fehlt oder die vorhandenen nicht vertrauenswürdig sind.',
    keywords: ['mcp', 'anbindung', 'server', 'api', 'schnittstelle', 'dienst', 'bauen', 'agent'],
    ideas: [...ALL_DEV, 'seed-kontrollraum'] },
  { id: 'mcp-server-dev', name: 'MCP Server Dev', kind: 'plugin', trust: 'offiziell', source: 'anthropics/claude-plugins-official', url: AP('mcp-server-dev'),
    category: 'Skills und Anbindungen bauen',
    de: 'Skills für Entwurf und Betrieb von MCP-Servern: Bereitstellung, Werkzeug-Design, Anmeldung.',
    when: 'Wenn eine eigene Anbindung online laufen soll, z. B. hinter dem Cloudflare-Login.',
    keywords: ['mcp', 'server', 'anbindung', 'deploy', 'login', 'auth'],
    ideas: ALL_DEV },
  { id: 'plugin-dev', name: 'Plugin Dev', kind: 'plugin', trust: 'offiziell', source: 'anthropics/claude-plugins-official', url: AP('plugin-dev'),
    category: 'Skills und Anbindungen bauen',
    de: 'Werkzeugkasten für eigene Claude-Code-Plugins mit Agenten, Befehlen und Hooks.',
    when: 'Um Agenten des Hubs als Plugin zu bündeln.',
    keywords: ['plugin', 'agent', 'agenten', 'befehl', 'hook', 'bauen'],
    ideas: ALL_DEV },
];

// ---------- Suche ----------

const fold = (s) => s.toLowerCase()
  .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
  .normalize('NFKD').replace(/[̀-ͯ]/g, '');

const STOP = new Set(['ich', 'will', 'moechte', 'mein', 'meine', 'meinen', 'meiner', 'einen', 'eine', 'ein', 'der', 'die', 'das', 'den', 'dem', 'und', 'oder', 'mit', 'fuer', 'von', 'auf', 'aus', 'zu', 'zum', 'zur', 'im', 'in', 'ist', 'wie', 'was', 'soll', 'sollen', 'kann', 'bitte', 'mal', 'auch', 'es', 'etwas', 'machen', 'dass', 'wenn', 'the', 'a', 'to', 'for', 'and']);

function tokens(text) {
  return fold(text).split(/[^a-z0-9]+/).filter((t) => t.length > 1 && !STOP.has(t));
}

// Ein Suchwort passt, wenn es ein Schlüsselwort ist oder beide denselben Wortstamm haben
// (z. B. „termine“ ↔ „termin“, „kalendereintrag“ ↔ „kalender“).
function hits(token, word) {
  if (token === word) return 3;
  const [a, b] = token.length < word.length ? [token, word] : [word, token];
  // Wortstamm nur, wenn er lang genug ist oder fast das ganze Wort abdeckt („brief“ ≠ „briefing“)
  if (b.startsWith(a) && (a.length >= 6 || (a.length >= 4 && a.length / b.length >= 0.75))) return 2;
  return 0;
}

export function searchSkills(query, limit = 8) {
  const qt = tokens(query);
  if (!qt.length) return [];
  return SKILLS.map((s) => {
    const kw = s.keywords.map(fold);
    const nameT = tokens(s.name);
    const textT = tokens(`${s.de} ${s.when}`);
    let score = 0;
    const why = new Set();
    for (const t of qt) {
      let best = 0;
      for (const k of kw) { const h = hits(t, k); if (h > best) { best = h; if (h) why.add(k); } }
      for (const n of nameT) { const h = hits(t, n) + 1; if (hits(t, n) && h > best) { best = h; why.add(n); } }
      if (!best && textT.some((w) => hits(t, w))) best = 1;
      score += best;
    }
    if (s.trust === 'offiziell' && score) score += 0.5; // bei Gleichstand: offizielle zuerst
    return { skill: s, score, why: [...why].slice(0, 4) };
  }).filter((r) => r.score >= 2)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

export const skillsForIdea = (ideaId) => SKILLS.filter((s) => s.ideas.includes(ideaId));
