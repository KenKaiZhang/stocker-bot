import { EmbedBuilder } from "discord.js";
import { fetchFavoriteTickersPrices } from "../../../api/tickers.js";
import { getGuildData } from "../../../utils/guildData.js";

export const sendReport = async(interaction) => {
    const guild = interaction.guild.id
    const { reportConfig } = getGuildData(interaction.client, interaction.guild.id);
    const channel = interaction.client.channels.cache.get(reportConfig.channelID);

    if (channel) {
        const prices = await fetchFavoriteTickersPrices(guild)
        const embed = new EmbedBuilder()
            .setColor(0x025E61)
            .setTitle("Favorite Stocks Report")
            .setTimestamp()
        
        prices.forEach(price => {
            embed.addFields({
                name: `${price.name}`,
                value: `**${price.price}** ${price.change} ${price.change_percent}`
            })
        })
        await channel.send({ embeds: [embed] })
        return
    }
}
