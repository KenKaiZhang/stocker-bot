import { SlashCommandSubcommandBuilder, EmbedBuilder } from "discord.js";
import { fetchCompanyProfile } from "#api/finnhub.js";
import { fetchTickerPrice } from "#api/tickers.js";

const data = new SlashCommandSubcommandBuilder()
    .setName("get-price")
    .setDescription("Gets the price of the provided ticker.")
    .addStringOption(option => 
        option
            .setName("ticker")
            .setDescription("Enter the company's ticker.")
            .setAutocomplete(true)
            .setRequired(true)
    )



const execute = async(interaction) => {
    await interaction.deferReply()
    const ticker = interaction.options.getString("ticker").toUpperCase()

    const { logo } = await fetchCompanyProfile(ticker)
    const price = await fetchTickerPrice(ticker)

    const embed = new EmbedBuilder()

    embed
        .setColor(price.positive ? 0x1bdb44 : 0xe31b1b)
        .setTitle(`${price.name} (${ticker})`)
        .addFields(
            { name: "Current Price", value: `**${price.price}**`, inline: true},
            { name: "Price Change", value: `${price.change}`, inline: true},
            { name: "Price Change %", value: `${price.change_percent}`, inline: true}
        )
        .setThumbnail(logo)
        .setTimestamp()
    await interaction.editReply({ embeds: [embed], fetchReply: true })
}

export { data, execute }