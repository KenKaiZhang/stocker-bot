import axios from "axios"

const BASE_URL = "http://botapi:8000/api/v1/config/"

export const fetchReportConfig = async(guild) => {
    const url = `${BASE_URL}report/${guild}`
    const { data } = await axios.get(url)
    return data
}

export const setReportConfig = async(guild, reportConfig) => {
    const url = `${BASE_URL}report/${guild}`
    const { data } = await axios.post(url, reportConfig)
    return data
}