import { Intents, Client, Collection, CommandInteraction } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import fs from 'fs';
import * as dotenv from 'dotenv';
dotenv.config();
import mongo from './utils/db/connect';

interface ICommands {
    data: Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">;
    execute(interaction: CommandInteraction): Promise<void>
}

class CustomClient extends Client {
    public commands = new Collection<string, ICommands>();
}

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
        await command.execute(interaction);
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