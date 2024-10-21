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

    const { name, logo } = await fetchCompanyProfile(ticker)
    const price = await fetchTickerPrice(ticker)

    const embed = new EmbedBuilder()

    embed
        .setColor(price.positive ? 0x1bdb44 : 0xe31b1b)
        .setTitle(`${name} (${ticker})`)
        .setDescription(`**${price.price}** ${price.change} ${price.change_percent}`)
        .setThumbnail(logo)
        .setTimestamp()
    await interaction.editReply({ embeds: [embed], fetchReply: true })
}

export { data, execute }