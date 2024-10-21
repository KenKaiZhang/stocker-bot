import { fetchReportConfig } from "#api/config.js";
import { setGuildData } from "#utils/guildData.js"

const name = "ready"
const once = true

const execute = async (client) => {

    // Bot make space to store server configurations
    client.guildData = new Map()

    // Storing report configurations
    client.guilds.cache.forEach(async({ id: guild }) => {
        const reportConfig = await fetchReportConfig(guild)
        setGuildData(client, guild, {reportConfig: reportConfig})
    })
};

export { name, once, execute }