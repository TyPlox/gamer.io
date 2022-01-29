import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import moment from "moment";
import Birthday from "../utils/db/crud/birthday.crud";

module.exports = {
    data: new SlashCommandBuilder()
        .setName('set_birthday')
        .setDescription('Set your birthday for this server!')
        .addStringOption(option =>
            option.setName('date')
                .setDescription('Your birthday in the format "D/MM", sample: 3/11')
                .setRequired(true)
        ),
    async execute(interaction: CommandInteraction) {
        const date = interaction.options.getString('date');
        if (date) {
            const realDate = moment(`${date}/${new Date().getFullYear()}`, 'D/M/YYYY', true);
            console.log(realDate);
            if (!realDate.isValid()) {
                return interaction.reply({
                    content: `The date you entered isn't correct, please try again!`,
                    ephemeral: true
                });
            }
            let finalDate = new Date(realDate.valueOf());
            if (new Date().getTime() > realDate.valueOf()) {
                finalDate.setFullYear(finalDate.getFullYear() + 1);
            }
            const user = interaction.user.id;
            const guild = interaction.guildId;
            Birthday.post(user, guild || '', moment(finalDate).format('D MMM, YYYY')).then(async () => {
                await interaction.reply(`Your birthday date has been saved, next notify on ${moment(finalDate).format('D MMM, YYYY')}`);
            });
        } else {
            await interaction.reply({content: `You need to enter a date!`, ephemeral: true});
        }
    }
}