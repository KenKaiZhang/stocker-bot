import { SlashCommandSubcommandBuilder, EmbedBuilder } from "discord.js";
import { getGuildData } from "#utils/guildData.js";

const data = new SlashCommandSubcommandBuilder()
    .setName("get-report-config")
    .setDescription("Show current report configuration.")

const execute = async(interaction) => {
    try {
        const client = interaction.client
        const guild = interaction.guild.id
        const { reportConfig } = getGuildData(client, guild)

        if(!reportConfig) {
            return interaction.reply({ content: "Report has not yet been configured."})
        }

        const { channelID, interval } = reportConfig

        const embed = new EmbedBuilder()
            .setColor(0x025E61)
            .setTitle("Report Configuration")
            .addFields(
                { name: "Channel", value: `#${interaction.client.channels.cache.get(channelID)?.name || ""}` },
                { name: "Interval", value: `${interval}` }
            )
        await interaction.reply({ embeds: [embed] })

    } catch (error) {
        await interaction.reply({ content: `There was an error getting report. ${error}` })
    }
}

export { data, execute }

