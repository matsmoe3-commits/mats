// Tool-Registry des Hubs.
// Ein neues Tool hinzufügen:
//   1. Datei js/tools/<name>.js anlegen, die ein Objekt exportiert:
//        { id, name, short?, icon, description, render(viewEl, routeParts), stats?(), nav? }
//   2. Hier importieren und in die Liste eintragen. Fertig – es erscheint auf der Startseite und in der Navigation.
//   Daten speichert ein Tool über store.all('<id>') / store.upsert('<id>', item) aus ../store.js.

import ideas from './ideas.js';
import roadmap from './roadmap.js';
import projects from './projects.js';
import settings from './settings.js';

export const tools = [ideas, roadmap, projects, settings];
