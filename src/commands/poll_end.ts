import { SlashCommandBuilder } from "@discordjs/builders";
import {CommandInteraction, GuildMember} from "discord.js";
import Poll from "../utils/db/crud/poll.crud";
import CustomClient from "../class/client";

const build = new SlashCommandBuilder()
    .setName('poll_end')
    .setDescription('End a poll');

module.exports = {
    data: build,
    async execute(client: CustomClient, interaction: CommandInteraction) {
        const member = interaction.member as GuildMember;
        if (member?.permissions.has("ADMINISTRATOR")) {
            const guild = interaction.guildId || '';
            const poll = await Poll.getById(guild);
            if (poll) {
                const options: string[] = poll.options.toObject();
                const votes: {userId: string, vote: string}[] = poll.respondent.toObject();
                const total: {name: string, count: number}[] = [];
                options.forEach(e => {
                    total.push({
                        name: e,
                        count: 0
                    });
                });
                votes.forEach(e => {
                    const i = total.findIndex(x => x.name === e.vote);
                    if (i) {
                        total[i].count++;
                    }
                });
                total.sort((a, b) => {
                    const keyA = a.count;
                    const keyB = b.count;
                    if (keyA > keyB) return -1;
                    if (keyA < keyB) return 1;
                    return 0;
                });
                let results = `Estos son los resultados de la encuesta "${poll.name}" :\n`;
                total.forEach((e, i) => {
                    results += `${i + 1}. - ${e.name} | Votos: ${e.count}\n`;
                });
                results += '¡Gracias a todos por participar!';
                Poll.delete(guild).then(async _ => {
                    await interaction.reply({ content: results});
                }).catch(async _ => {
                    await interaction.reply({ content: 'Ha ocurrido un error', ephemeral: true});
                });
            } else {
                await interaction.reply({ content: `No existe una encuesta en curso`, ephemeral: true});
            }
        } else {
            await interaction.reply({ content: `No tienes permisos para ejecutar este comando`, ephemeral: true});
        }
    }
}