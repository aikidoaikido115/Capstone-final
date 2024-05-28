import axios from "axios";


const increaseView = async (title) => {

    const API_URL = import.meta.env.VITE_API_URL
    const END_POINT = `/api/user/sum_view`

    let response = await axios.put(API_URL + END_POINT, {
        title:title
    });
    
    
    console.log(response.data)

    return response.data
}

export default increaseView;