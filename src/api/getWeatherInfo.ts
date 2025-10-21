import axios from 'axios';

const API_KEY = import.meta.env.VITE_APP_API_KEY;
const BASE_URL = 'https://restapi.amap.com/v3/weather/weatherInfo';

export async function fetchWeatherInfo(cityCode: string='310114'): Promise<any> {
    try {
        const url = `${BASE_URL}?key=${API_KEY}&city=${cityCode}&extensions=all&output=JSON`;

        const response = await axios.get(url);
        const data = response.data;

        if (data.status !== '1' || data.infocode !== '10000') {
            throw new Error(`API error: ${data.info} (Code: ${data.infocode})`);
        }

        return data;
    }
    catch (error) {
        throw new Error();
    }
}
