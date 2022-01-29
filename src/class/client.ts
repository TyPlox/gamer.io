import {SlashCommandBuilder} from "@discordjs/builders";
import {Client, Collection, CommandInteraction} from "discord.js";

interface ICommands {
    data: Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">;

    execute(client: CustomClient, interaction: CommandInteraction): Promise<void>
}

export default class CustomClient extends Client {
    public commands = new Collection<string, ICommands>();
}