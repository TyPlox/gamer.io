import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import fs from "fs";
require('dotenv').config();

const { TOKEN, CLIENT_ID } = process.env;

const commands = [];
const commandFiles = fs.readdirSync(__dirname + '/commands').filter(file => file.endsWith('.ts'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    commands.push(command.data.toJSON());
}

const rest = new REST({ version: '9' }).setToken(TOKEN || '');

rest.put(Routes.applicationCommands(CLIENT_ID || ''), { body: commands })
    .then(() => console.log('Successfully registered application commands.'))
    .catch(console.error);