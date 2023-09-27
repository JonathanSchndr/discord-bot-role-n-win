import { Client, GatewayIntentBits } from 'discord.js';

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

const token = process.env.DISCORD_BOT_TOKEN;

// Map zum Speichern der Benutzer-IDs und der Zeit, zu der sie zuletzt gewürfelt haben
const userTimestamps = new Map();

// Map von verfügbaren Amazon Keys
const amazonKeys = new Map([
    ['key1', 'AMAZON_KEY_1'],
    ['key2', 'AMAZON_KEY_2'],
    // ... Weitere Keys
]);

client.once('ready', async () => {
    console.log(`Logged in as ${client.user.tag}!`);

    const guilds = client.guilds.cache;
    for (const guild of guilds.values()) {
        const commands = guild.commands;
        await commands.create({
            name: 'role',
            description: 'Wirf einen Würfel und gewinne vielleicht einen Amazon Key!',
        });
    }
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    const { commandName } = interaction;
    if (commandName === 'role') {
        const userId = interaction.user.id;

        // Überprüfe, ob der Benutzer heute bereits gewürfelt hat
        const lastTimestamp = userTimestamps.get(userId);
        const now = Date.now();
        const oneDay = 24 * 60 * 60 * 1000;

        if (lastTimestamp && now - lastTimestamp < oneDay) {
            interaction.reply('Du darfst nur einmal am Tag würfeln! Versuche es morgen erneut.');
            return;
        }

        // Speichere den aktuellen Zeitstempel für diesen Benutzer
        userTimestamps.set(userId, now);

        // Führe den Würfelwurf durch
        const number = Math.floor(Math.random() * 100) + 1;
        if (number === 66) {
            if (amazonKeys.size === 0) {
                interaction.reply('Leider sind alle Amazon Keys bereits vergeben.');
                return;
            }

            // Wähle einen zufälligen Amazon Key aus der Map und entferne ihn
            const keyIndex = Math.floor(Math.random() * amazonKeys.size);
            const key = Array.from(amazonKeys.values())[keyIndex];
            const keyId = Array.from(amazonKeys.keys())[keyIndex];
            amazonKeys.delete(keyId);

            interaction.reply(`Glückwunsch! Du hast eine 66 gewürfelt und gewinnst den Amazon Key: ${key}`);
        } else {
            interaction.reply(`Du hast eine ${number} gewürfelt. Leider kein Gewinn, versuche es erneut!`);
        }
    }
});

client.login(token);