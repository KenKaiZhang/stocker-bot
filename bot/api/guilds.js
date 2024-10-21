import axios from "axios";

const BASE_URL = "http://botapi:8000/api/v1/guilds/"

export const fetchGuilds = async() => {
    const { data } = await axios.get(BASE_URL)
    return data
}

export const addNewGuild = async(guild) => {
    const url = `${BASE_URL}${guild}`
    const { data } = await axios.post(url)
    return data
}
