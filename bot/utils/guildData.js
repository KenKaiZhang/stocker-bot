export const getGuildData = (client, guild) => {
    const guildData = client.guildData.get(guild)
    if (guildData) {
        return guildData
    } else {
        return {}
    }
}

export const setGuildData = (client, guild, data) => {
    const oldData = client.guildData.get(guild) || {}
    const updatedData = {
        ...oldData,
        ...data
    };
    client.guildData.set(guild, updatedData)
    console.log(client.guildData)
}
