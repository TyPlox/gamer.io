import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import Poll from "../utils/db/crud/poll.crud";
import CustomClient from "../class/client";

const build = new SlashCommandBuilder()
    .setName('poll_new')
    .setDescription('Create a poll!');

build.addStringOption(
    option =>
        option.setName('name')
            .setDescription('Name for the poll')
            .setRequired(true)
);

build.addStringOption(
    option =>
        option.setName('options')
            .setDescription('All options, separated by commas')
            .setRequired(true)
);

build.addBooleanOption(
    option =>
        option.setName('hide')
            .setDescription('Hide the votes')
);



module.exports = {
    data: build,
    async execute(client: CustomClient, interaction: CommandInteraction) {
        const guild = interaction.guildId || '';
        const name = interaction.options.getString('name') || '';
        const stringOptions = interaction.options.getString('options') || '';
        const plainOptions = stringOptions.split(",");
        const options: string[] = [];
        plainOptions.forEach(e => {
            options.push(e.replace(/ /g, ""));
        });
        const hide = interaction.options.getBoolean("hide") || false;
        if (await Poll.getById(guild)) {
            await interaction.reply({ content: `No puedes crear una encuesta con otra actualmente en curso`, ephemeral: true });
        } else {
            if (await Poll.post(guild, name, options, hide)) {
                await interaction.reply({ content: `Encuesta creada con las siguientes opciones: ${stringOptions}` });
            } else {
                await interaction.reply({content: `Chale ocurrió un error xdxd`});
            }
        }

    }
}