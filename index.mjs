import { Client, GatewayIntentBits } from 'discord.js'
const client = new Client({ intents: [GatewayIntentBits.Flags.Guilds] });

// Hier kommt dein Token rein
const token = process.env.DISCORD_BOT_TOKEN;

// Registriere den Slash Command beim Start des Bots
client.once('ready', async () => {
    console.log(`Logged in as ${client.user.tag}!`);

    // Registriere den Slash Command für jede Guild, in der der Bot Mitglied ist
    client.guilds.cache.each(async (guild) => {
        await guild.commands.create({
            name: 'role',
            description: 'Wirf einen Würfel und gewinne vielleicht einen Amazon Key!',
        });
    });
});

// Wenn der Slash Command aufgerufen wird
client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;
    if (interaction.commandName === 'role') {
        const number = Math.floor(Math.random() * 100) + 1;
        if (number === 66) {
            // Hier würdest du den Code hinzufügen, um einen Amazon Key aus deiner Liste zu senden.
            interaction.reply('Glückwunsch! Du hast eine 66 gewürfelt und gewinnst einen Amazon Key!');
        } else {
            interaction.reply(`Du hast eine ${number} gewürfelt. Leider kein Gewinn, versuche es erneut!`);
        }
    }
});

// Bot einloggen
client.login(token);
