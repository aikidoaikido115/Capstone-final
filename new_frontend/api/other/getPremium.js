import axios from "axios";


const getPremium = async (package_name) => {

    const API_URL = import.meta.env.VITE_API_URL
    const END_POINT = `/api/premium_get/?package_name=${package_name}`

    let response = await axios.get(API_URL + END_POINT, {
        crossdomain: true,
    });
    
    
    console.log(response.data)

    return response.data
}

export default getPremium;