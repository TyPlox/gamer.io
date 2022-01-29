import { Intents } from 'discord.js';
import CustomClient from './class/client';
import fs from 'fs';
import * as dotenv from 'dotenv';
dotenv.config();
import mongo from './utils/db/connect';

const client = new CustomClient({ intents: [Intents.FLAGS.GUILDS] });

const commandFiles = fs.readdirSync(__dirname + '/commands').filter(file => file.endsWith('.ts') || file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.data.name, command);
}

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;
    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
        await command.execute(client, interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
});

mongo().then(() => {
    console.log('Connected DB!')
    client.login(process.env.TOKEN).then(() => {
        console.log('Gamer.io is alive!')
    });
});