import { SlashCommandSubcommandBuilder } from "discord.js";
import { saveTickers } from "#api/tickers.js";

const data = new SlashCommandSubcommandBuilder()
    .setName("save-tickers")
        .setDescription("Save tickers to favorites.")
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
    
    const savedTickers = await saveTickers(guild, { tickers: tickersList })

    if (savedTickers.length === 0)
        await interaction.reply("No new tickers saved to favorites.")
    else
        await interaction.reply(`${savedTickers.join(", ")} have been saved to favorites.`)
}

export { data, execute }