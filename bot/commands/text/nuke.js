import { SlashCommandBuilder } from 'discord.js'

const data = new SlashCommandBuilder()
    .setName('nuke')
    .setDescription('Nuke the current text channel.')

const execute = async(interaction) => {
    if (!interaction.member.permissions.has("ADMINISTRATOR"))
        return interaction.reply('You do not have permission to execute this command.')

    const today = new Date()
    const month = String(today.getMonth() + 1).padStart(2, '0')
    const day = String(today.getDate()).padStart(2, '0')
    const year = today.getFullYear()
    const date = `${month}/${day}/${year}`

    const channel = interaction.channel
    const newChannel = await channel.clone()
    await channel.delete()
    newChannel.send(`This channel was nuked by ${interaction.user.globalName} @ ${date}.`)
}

export { data, execute }