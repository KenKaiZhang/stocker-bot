import { SlashCommandSubcommandBuilder } from "discord.js";
import { getGuildData, setGuildData } from "#utils/guildData.js";

const data = new SlashCommandSubcommandBuilder()
    .setName("stop-report")
    .setDescription("Stop the periodic stock reports.")

const execute = async(interaction) => {
    try {
        const client = interaction.client
        const guild = interaction.guild.id
        const { reportInterval } = getGuildData(client, guild)

        if(!reportInterval) {
            return interaction.reply({ content: "Report has not been started."})
        }
    
        clearInterval(reportInterval)
        setGuildData(client, guild, {
            reportInterval: null
        })
        await interaction.reply({ content: "Report stopped." })
    } catch (error) {
        await interaction.reply({ content: "There was an error stopping the report." })
    }
}

export { data, execute }

