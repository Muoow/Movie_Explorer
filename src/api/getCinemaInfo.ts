import axios from 'axios';

const API_KEY = import.meta.env.VITE_APP_API_KEY;
const BASE_URL = 'https://restapi.amap.com/v5/place/around';
const CINEMA_TYPE_CODE = '080601';
const SEARCH_RADIUS = 10000;
const SHOW_FIELDS = 'business';

export async function fetchCinemaInfo(x: string='121.214160', y: string='31.286012'): Promise<any> {
    try {
        const location = `${x},${y}`;
        const response = await axios.get(BASE_URL, {
            params: {
                key: API_KEY,
                location: location,
                types: CINEMA_TYPE_CODE,
                radius: SEARCH_RADIUS,
                show_fields: SHOW_FIELDS,
            }
        });

        const data = response.data;

        if (data.status !== '1' || data.infocode !== '10000') {
            throw new Error(`POI Search Failed: ${data.info}`);
        }

        return data;
    }
    catch(error) {
        throw new Error();
    }
}