# Discord Bot: Role & Win

## Requirements
- Mac, Windows oder Linux System
- Discord Server
- Node.js installiert (https://nodejs.org/en/)
- (Optional: Node.js Server)

## Getting started
1. Erstelle eine neue App auf https://discord.com/developers/applications
2. Klickt auf Bot und dann auf "Add Bot" und kopiert euch den Client Secret
3. Zudem aktiviere den SChalter für MESSAGE CONTENT INTENT auf der Bot Seite
4. Klick auf 0Auth2 und wähle bei OAuth2 URL Generator "bot" und bei Permissions "Administrator" aus
5. Öffne jetzt den Link der zwischen den Checkboxen steht
6. Folgend wirst du aufgefordert den Bot zum deinem Discord Server hinzuzufügen
7. Kopiere dir diesen Ordner
8. Gehe zurück und kopiere dir den Client Secret von der Bot Seite
9. Erstelle eine .env mit DISCORD_BOT_TOKEN=%DEIN_CLIENT_SECRET% von der Seite
10. Führe `npm install` aus
11. Starte den Bot mit `npm run start`


Wichtig: Wenn du dies lokal auf deinem Rechner ausführst, funktioniert der Bot nur solange dein Rechner läuft. Alternativ musst du diesen Bot auf einem externen Server ausführen.

## Links
- https://discord.js.org/#/docs/main/stable/general/welcome
- https://github.com/discordjs/discord.js
- https://discordjs.guide/#before-you-begin
