import { Client, GatewayIntentBits } from 'discord.js';

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.DirectMessages]
});

const token = process.env.DISCORD_BOT_TOKEN;

// Map to store user IDs and the date on which they last rolled the dice
const userDates = new Map();

// Map of available Amazon Keys
const amazonKeys = new Map([
    ['key1', 'AMAZON_KEY_1'],
    ['key2', 'AMAZON_KEY_2'],
    // ... More keys
]);

client.once('ready', async () => {
    console.log(`Logged in as ${client.user.tag}!`);

    const guilds = client.guilds.cache;
    for (const guild of guilds.values()) {
        const commands = guild.commands;
        await commands.create({
            name: 'roll',
            description: 'Roll a dice and you might win an Amazon Key!',
        });
    }
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    const { commandName, user } = interaction;
    if (commandName === 'roll') {
        const userId = user.id;

        // Check if the user has already rolled the dice today
        const currentDate = (new Date()).toDateString();
        const lastDate = userDates.get(userId);

        if (lastDate && lastDate === currentDate) {
            interaction.reply('You can only roll once per day! Try again tomorrow.');
            return;
        }

        // Store the current date for this user
        userDates.set(userId, currentDate);

        // Determine the winning number for today
        const daySeed = new Date().getDate();
        const winningNumber = Math.floor(Math.random() * daySeed * 100) % 100 + 1;

        // Roll the dice
        const number = Math.floor(Math.random() * 100) + 1;
        if (number === winningNumber) {
            if (amazonKeys.size === 0) {
                interaction.reply('Unfortunately, all Amazon Keys have already been claimed.');
                return;
            }

            // Select a random Amazon Key from the Map and remove it
            const keyIndex = Math.floor(Math.random() * amazonKeys.size);
            const key = Array.from(amazonKeys.values())[keyIndex];
            const keyId = Array.from(amazonKeys.keys())[keyIndex];
            amazonKeys.delete(keyId);

            // Send the Amazon Key via Direct Message
            try {
                await user.send(`Congratulations! You rolled the winning number ${winningNumber} and won the Amazon Key: ${key}`);
                interaction.reply('You won! Check your Direct Messages for your Amazon Key.');
            } catch (e) {
                interaction.reply('I couldn\'t send you a Direct Message. Make sure you allow Direct Messages on this server.');
            }
        } else {
            interaction.reply(`You rolled a ${number}. Better luck next time!`);
        }
    }
});

client.login(token);