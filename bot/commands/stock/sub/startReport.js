import { SlashCommandSubcommandBuilder } from "discord.js";
import { sendReport } from "../util/sendReport.js";
import { getGuildData, setGuildData } from "#utils/guildData.js";

const data = new SlashCommandSubcommandBuilder()
    .setName("start-report")
    .setDescription("Start or configure the periodic stock reports.")

const execute = async(interaction) => {
    try {
        const client = interaction.client
        const guild = interaction.guild.id
        const { reportConfig, reportInterval } = getGuildData(client, guild)

        if (!reportConfig) {
            return interaction.reply({ content: "Report configuration has not been set. Please run `/config-report` to configure before running.", ephemeral: true})
        }
        if (!client.channels.cache.get(reportConfig?.channelID || "")) {
            return interaction.reply({ content: "The configured text channel does not exist.", ephemeral: true })
        }
        if (reportInterval) {
            return interaction.reply({ content: "Report has already been started.", ephemeral: true })
        }

        const { interval } = reportConfig
        setGuildData(client, guild, {
            reportInterval: setInterval(sendReport, interval * 60000, interaction)
        })
        await interaction.reply({ content: "Report started!" })

    } catch (error) {
        await interaction.reply({ content: "There was an error starting the report." })
    }
}

export { data, execute }