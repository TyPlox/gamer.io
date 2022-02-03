import { SlashCommandBuilder } from "@discordjs/builders";
import {CommandInteraction} from "discord.js";
import Poll from "../utils/db/crud/poll.crud";
import CustomClient from "../class/client";
import {IRespondent} from "../utils/db/schemas/poll.schema";

const build = new SlashCommandBuilder()
    .setName('poll_view')
    .setDescription('View current poll');

module.exports = {
    data: build,
    async execute(client: CustomClient, interaction: CommandInteraction) {
        const guild = interaction.guildId || '';
        const poll = await Poll.getById(guild);
        if (poll) {
            const options = poll.options.toObject() as string[];
            const votes = poll.respondent.toObject() as IRespondent[];
            let result = `La encuesta ${poll.name} tiene las siguientes opciones:\n`;
            options.forEach(e => {
                result += `${e}\n`;
            });
            result += `\nLas siguientes personas han votado:\n`;
            for (const e of votes) {
                const user = await client.users.fetch(e.userId);
                result += `**${user.tag}**${poll.hide ? '' : ` *(Votó por ${e.vote})*`}\n`;
            }
            await interaction.reply({ content: result});
        } else {
            await interaction.reply({ content: `No hay ninguna encuesta en curso`, ephemeral: true });
        }

    }
}