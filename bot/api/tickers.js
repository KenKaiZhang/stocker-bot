import axios from "axios"

const BASE_URL = "http://botapi:8000/api/v1/stocks/"

export const fetchTickerPrice = async(ticker) => {
    const url = `${BASE_URL}${ticker}`
    const { data } = await axios.get(url)
    return data
}

export const fetchFavoriteTickersPrices = async(guild) => {
    const url = `${BASE_URL}tickers/favorites/${guild}`
    const { data } = await axios.get(url)
    return data
}   

export const saveTickers = async(guild, tickers) => {
    const url = `${BASE_URL}tickers/favorites/${guild}`
    const { data } = await axios.post(url, tickers)
    return data
}

export const removeFavoriteTickers = async(guild, tickers) => {
    const url = `${BASE_URL}tickers/favorites/${guild}`
    const { data } = await axios.put(url, tickers)
    return data
}