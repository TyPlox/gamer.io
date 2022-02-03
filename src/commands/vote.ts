import { SlashCommandBuilder } from "@discordjs/builders";
import {CommandInteraction, TextChannel} from "discord.js";
import Poll from "../utils/db/crud/poll.crud";
import CustomClient from "../class/client";

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
    async execute(client: CustomClient, interaction: CommandInteraction) {
        const guild = interaction.guildId || '';
        const user = interaction.user.id;
        const option = interaction.options.getString('option') || '';
        const poll = await Poll.getById(guild);
        if (poll) {
            const vote = await Poll.addVote(guild, user, option);
            if (vote.ok && poll.hide) {
                const cn = (client.channels.cache.find(c => c.id === interaction.channelId) as TextChannel);
                cn.send(`<@${user}> ha votado sastifactoriamente`).then(async () => {
                    await interaction.reply({ content: vote.msg, ephemeral: true });
                }).catch(async () => {
                    await interaction.reply({ content: 'Uh, ocurrió un error', ephemeral: true });
                });
            } else if (vote.ok && !poll.hide) {
                await interaction.reply({ content: vote.msg });
            } else {
                await interaction.reply({ content: vote.msg, ephemeral: true });
            }
        } else {
            await interaction.reply({ content: `No hay ninguna encuesta en curso`, ephemeral: true });
        }

    }
}