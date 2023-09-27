import { Client, GatewayIntentBits } from 'discord.js';
const client = new Client({
    intents: [GatewayIntentBits.Flags.Guilds, GatewayIntentBits.Flags.GuildMessages, GatewayIntentBits.Flags.MessageContent]
});

const token = 'DEIN_DISCORD_BOT_TOKEN';

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
        const number = Math.floor(Math.random() * 100) + 1;
        if (number === 66) {
            interaction.reply('Glückwunsch! Du hast eine 66 gewürfelt und gewinnst einen Amazon Key!');
        } else {
            interaction.reply(`Du hast eine ${number} gewürfelt. Leider kein Gewinn, versuche es erneut!`);
        }
    }
});

client.login(token);