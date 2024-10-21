import { SlashCommandSubcommandBuilder } from "discord.js";
import { removeFavoriteTickers } from "#api/tickers.js";

const data = new SlashCommandSubcommandBuilder()
    .setName("remove-favorites")
    .setDescription("Remove ticker from favorites.")
    .addStringOption(option => 
        option
            .setName("tickers")
            .setDescription("List of tickers seperated by commas.")
            .setRequired(true)
    ) 

const execute = async(interaction) => {
    const guild = interaction.guild.id 
    const tickers = interaction.options.getString("tickers").toUpperCase()
    const tickersList = tickers.split(",").map(ticker => ticker.trim())
    const removedTickers = await removeFavoriteTickers(guild, { tickers: tickersList })

    await interaction.reply(`${removedTickers.join(", ")} have been removed from favorites.`)
}

export { data, execute }