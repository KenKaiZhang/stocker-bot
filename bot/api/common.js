import axios from "axios";

const BASE_URL = "http://botapi:8000/api/v1/"

export const fetchCommonKeyValue = async(key) => {
    const url = `${BASE_URL}common/${key}`
    const { data } = await axios.get(url)
    return data
}

export const createCommonKeyValue = async(payload) => {
    const url = `${BASE_URL}common`
    const { data } = await axios.post(url, payload)
    return data
}

export const updateCommonKeyValue = async(payload) => {
    const url = `${BASE_URL}common`
    const { data } = await axios.put(url, payload)
    return data
}