// Alle Tools des Hubs. Ein neues Tool ist eine Datei in diesem Ordner, die ein Objekt
// { id, name, icon, description, render(view, routeParts), count?() } exportiert – hier eintragen, fertig.
import ideas from './ideas.js';
import roadmap from './roadmap.js';
import projects from './projects.js';
import contacts from './contacts.js';
import settings from './settings.js';
import city from './city.js';

export const tools = [city, ideas, roadmap, projects, contacts, settings];
