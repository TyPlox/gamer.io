import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import moment from "moment";
import Birthday from "../utils/db/crud/birthday.crud";

module.exports = {
    data: new SlashCommandBuilder()
        .setName('get_birthday')
        .setDescription('Get your birthday or list all for this server!')
        .addStringOption(option =>
            option.setName('category')
                .setDescription('Get my birthday or list all')
                .setRequired(true)
                .addChoice('All', 'all')
                .addChoice('Me', 'me')
        ),
    async execute(interaction: CommandInteraction) {
        await interaction.reply({ content: `Test (?)`, ephemeral: true });
    }
}