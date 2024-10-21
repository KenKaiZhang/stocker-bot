import { addNewGuild } from "#api/guilds.js"
import { deployCommands } from "../deployCommands.js"
import { Events } from "discord.js"

const name = Events.GuildCreate

const execute = async (guild) => {
    await addNewGuild(guild.id)
    deployCommands()
}

export { name, execute }