import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import Poll from "../utils/db/crud/poll.crud";

const build = new SlashCommandBuilder()
    .setName('vote')
    .setDescription('Vote in the current poll!');

build.addStringOption(
    option =>
        option.setName('option')
            .setDescription('Option you want to vote for')
            .setRequired(true)
);

module.exports = {
    data: build,
    async execute(interaction: CommandInteraction) {
        const guild = interaction.guildId || '';
        const user = interaction.user.id;
        const option = interaction.options.getString('option') || '';
        const poll = await Poll.getById(guild);
        if (poll) {
            const vote = await Poll.addVote(guild, user, option);
            await interaction.reply({ content: vote.msg, ephemeral: vote.ok ? poll.hide : false });
        } else {
            await interaction.reply({ content: `No hay ninguna encuesta en curso`, ephemeral: true });
        }

    }
}