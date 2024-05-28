import axios from "axios";


const saveHistory = async (title) => {

    const API_URL = import.meta.env.VITE_API_URL
    const END_POINT = `/api/user/history`

    let response = await axios.post(API_URL + END_POINT, {
        title:title
    });
    
    
    console.log(response.data)

    return response.data
}

export default saveHistory;