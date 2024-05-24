import axios from "axios";


const timer = async () => {

    const API_URL = import.meta.env.VITE_API_URL
    const END_POINT = `/api/timer`

    let response = await axios.get(API_URL + END_POINT, {
        crossdomain: true,
    });
    
    
    console.log(response.data)

    return response.data
}

export default timer;