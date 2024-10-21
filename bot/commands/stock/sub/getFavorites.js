import { SlashCommandSubcommandBuilder, EmbedBuilder } from "discord.js";
import { fetchFavoriteTickersPrices } from "#api/tickers.js";

const data = new SlashCommandSubcommandBuilder()
    .setName("get-favorites")
    .setDescription("Gets the prices of favorited tickers.")

const execute = async(interaction) => {
    try {
        const guild = interaction.guild.id 
        await interaction.deferReply()
        const prices = await fetchFavoriteTickersPrices(guild);

        const embed = new EmbedBuilder()
            .setColor(0x025E61)
            .setTitle("Favorite Stocks Report")
            .setTimestamp()

        prices.forEach((price) => {
            embed.addFields({
                name: `${price.name}`,
                value: `**${price.price}** ${price.change} ${price.change_percent}`
            });
        });
        await interaction.editReply({ embeds: [embed], fetchReply: true });
    } catch (error) {
        console.error("Error fetching prices:", error);
        await interaction.reply({ content: "There was an error fetching the prices.", ephemeral: true });
    }
}

export { data, execute }