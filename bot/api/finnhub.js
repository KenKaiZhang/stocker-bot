import "dotenv/config"
import axios from "axios"

const FINNHUB_BASE_URL = "https://www.finnhub.io/api/v1/"

export const fetchCompanyProfile = async(ticker) => {
    const url = `${FINNHUB_BASE_URL}stock/profile2?symbol=${ticker}&token=${process.env.FINNHUB_API_KEY}`
    const { data } = await axios.get(url)
    return data
}