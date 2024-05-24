import axios from "axios";



const fetchUserInfo = async (username) =>{

    const API_URL = import.meta.env.VITE_API_URL
    const END_POINT = `/api/user_specific_info/?username=${username}`

    let response = await axios.get(API_URL + END_POINT, {
      crossdomain: true,
    });

    return response
}


export default fetchUserInfo;