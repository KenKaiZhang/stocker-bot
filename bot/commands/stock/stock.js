import { SlashCommandBuilder } from "discord.js";
import fs from 'fs'
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const stockSubcommandFolderPath = path.join(__dirname, "sub")
const stockSubcommandFiles = fs.readdirSync(path.join(stockSubcommandFolderPath))
const subcommandFiles = stockSubcommandFiles.filter((file) => file.endsWith('.js'));

const subcommands = Object.fromEntries(
    await Promise.all(
        subcommandFiles.map(async (file) => {
            const subcommandFilePath = "file://" + path.join(stockSubcommandFolderPath, file).replace(/\\/g, '/')
            const subcommand = await import(subcommandFilePath)
            return [subcommand.data.name, subcommand]
        })
    )
)

const data = new SlashCommandBuilder()
    .setName("stock")
    .setDescription("Stock related commands.")

Object.values(subcommands).forEach((subcommand) => {
    data.addSubcommand(subcommand.data);
});

const execute = async(interaction) => {
    const subcommandName = interaction.options.getSubcommand()
    const subcommand = subcommands[subcommandName]
    
    if (!subcommand) {
        return interaction.reply({ content: "Subcommand not found." })
    }

    try {
        await subcommand.execute(interaction)
    } catch (error) {
        console.error(error)
        await interaction.reply({ content: "Error occured when executing command.", ephemeral: true})
    }
}

export { data, execute }