import 'dotenv/config'
import "module-alias/register.js"
import fs from 'node:fs'
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'
import { Client, Collection, GatewayIntentBits } from 'discord.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages
    ]
})
global.client = client
const commandFolderPath = path.join(__dirname, 'commands')
const commandFolders = fs.readdirSync(commandFolderPath)

client.commands = new Collection()

commandFolders.forEach(folder => {
    const commandPath = path.join(commandFolderPath, folder)
    const commandFiles = fs.readdirSync(commandPath).filter(file => file.endsWith('.js'))

    commandFiles.forEach(async file => {
        const commandFilePath = 'file://' + path.join(commandPath, file).replace(/\\/g, '/')
        const command = await import(commandFilePath)
        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command)
        } else {
            console.log(`[WARNING] Command at ${commandFilePath} is missing a required "data" or "execute" property.`)
        }
    })
})

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'))

eventFiles.forEach(async file => {
    const eventFilePath = 'file://' + path.join(eventsPath, file).replace(/\\/g, '/')
    const event = await import(eventFilePath)

    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args))
    } else {
        client.on(event.name, (...args) => event.execute(...args))
    }
})

client.login(process.env.TOKEN)