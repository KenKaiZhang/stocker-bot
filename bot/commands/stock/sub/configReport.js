import { SlashCommandSubcommandBuilder, ActionRowBuilder, ButtonBuilder } from "discord.js";
import { sendReport } from "../util/sendReport.js";
import { getGuildData, setGuildData } from "#utils/guildData.js";
import { setReportConfig } from "#api/config.js";

const data = new SlashCommandSubcommandBuilder()
    .setName("config-report")
    .setDescription("Set the channel as bot's home.")
    .addChannelOption(option =>
        option 
            .setName("channel")
            .setDescription("The channel to set as home.")
            .setRequired(true))
    .addIntegerOption(option => 
        option
            .setName("interval")
            .setDescription("How often the bot will report (in minutes).")
            .setRequired(true))

const execute = async(interaction) => {
    const client = interaction.client
    const guild = interaction.guild.id
    let { reportConfig, reportInterval } = getGuildData(client, guild)

    console.log(reportConfig, reportInterval)

    const channel = interaction.options.getChannel("channel")
    const interval = interaction.options.getInteger("interval") 

    const oldChannel = interaction.client.channels.cache.get(reportConfig?.channelID || "")
    const oldInterval = reportConfig?.interval || 0

    const channelID = channel.id
    
    if (!reportConfig || !oldChannel) {
        const newReportConfig = { 
            channelID: channelID,  
            interval: interval
        };
        await setReportConfig(guild, newReportConfig)
        reportConfig = newReportConfig

        setGuildData(client, guild, {reportConfig: reportConfig})

        return interaction.reply(`Stocker configured to report favorite stocks to **${channel.name}** every **${interval} minutes**.`);
    }

    if (reportConfig && reportConfig.channelID === channelID && reportConfig.interval === interval) {
        return interaction.reply({ content: `No update has been made.`})
    }

    const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId("confirm")
                .setLabel("Confirm")
                .setStyle("Danger"),
            new ButtonBuilder()
                .setCustomId("cancel")
                .setLabel("Cancel")
                .setStyle("Secondary")
        )

    await interaction.reply({
        content: `Stocker is currently reporting to **${oldChannel.name}** every **${oldInterval} min**. Do you want to change this?`,
        components: [row],
        ephemeral: true
    })

    const filter = i => i.customId === "confirm" || i.customId === "cancel"
    const collector = interaction.channel.createMessageComponentCollector({ filter, time: 10000 })

    collector.on('collect', async i => {
        if (i.customId === 'confirm') {
            const newReportConfig = { 
                channelID: channelID, 
                interval: interval
            };

            if (reportInterval) {
                clearInterval(reportInterval)
                reportInterval = setInterval(sendReport, interval * 60000, interaction)
            }

            await setReportConfig(guild, newReportConfig)
            setGuildData(client, guild, { 
                reportConfig: newReportConfig,
                reportInterval: reportInterval 
            })

            await i.update({ content: `Stocker will report to **${channel.name}** every **${interval} min**.`, components: [] });
        } else {
            await i.update({ content: 'Action canceled.', components: [] });
        }
    });

    collector.on('end', collected => {
        if (!collected.size) {
            interaction.editReply({ content: 'No response, action canceled.', components: [] });
        }
    });
}

export { data, execute }