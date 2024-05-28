import axios from "axios";

const fetchPremiumStatus = async (title) => {

    const API_URL = import.meta.env.VITE_API_URL
    const END_POINT = `/api/premium_status/?title=${title}`


    let response = await axios.get(API_URL + END_POINT, {
      crossdomain: true,
    });
    
    console.log(response.data)
    
    return response.data
  }

export default fetchPremiumStatus;