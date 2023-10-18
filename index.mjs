import { Client, GatewayIntentBits } from 'discord.js';

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.DirectMessages]
});

const token = process.env.DISCORD_BOT_TOKEN;

// Map to store user IDs and the date on which they last rolled the dice
const userDates = new Map();

// Map of available Keys
const keys = new Map([
    ['KEY', '123'],
]);

client.once('ready', async () => {
    console.log(`Logged in as ${client.user.tag}!`);

    const guilds = client.guilds.cache;
    for (const guild of guilds.values()) {
        const commands = guild.commands;
        await commands.create({
            name: 'roll',
            description: 'Roll a dice and you might win!',
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
            await interaction.reply({ content: 'You can only roll once per day! Try again tomorrow.' });
            return;
        }

        // Store the current date for this user
        userDates.set(userId, currentDate);

        // Determine the winning number for today
        const daySeed = new Date().getDate();
        const winningNumber = Math.floor(Math.random() * daySeed * 30) % 30 + 1;

        // Roll the dice
        const number = Math.floor(Math.random() * 30) + 1;
		
		console.log('=======');
		console.log('WINNING NUMBER: '+winningNumber);
		console.log('USER NUMBER: '+number);
		console.log('USER ID: '+userId);
		console.log('=======');
		
        if (number === winningNumber) {
            if (keys.size === 0) {
                await interaction.reply({ content: 'Unfortunately, all prices have already been claimed. Write an Admin to get your price!' });
                return;
            }

            const keyIndex = Math.floor(Math.random() * keys.size);
            const key = Array.from(keys.values())[keyIndex];
            const keyId = Array.from(keys.keys())[keyIndex];
            keys.delete(keyId);
			
			console.log('$$ WINWINWINWIN $$');
			console.log('WINNING KEY: '+key);
			console.log('LAST KEYS COUNT: '+keys.size);
			console.log('LAST KEYS: '+[...keys.entries()]);
			console.log('$$ WINWINWINWIN $$');

            try {
                await user.send(`Congratulations! You rolled the winning number ${winningNumber} and won. Enter the key: ${key} on https://codesphere.com/redeem to claim your price!`);
                await interaction.reply({ content: 'You won! Check your Direct Messages for your price.' });
            } catch (e) {
                await interaction.reply({ content: 'I couldn\'t send you a Direct Message. Make sure you allow Direct Messages on this server.' });
            }
        } else {
            await interaction.reply({ content: `You rolled a ${number}. Better luck next time!` });
        }
    }
});

client.login(token);
