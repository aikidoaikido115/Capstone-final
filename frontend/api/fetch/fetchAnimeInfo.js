import axios from "axios";

const fetchAanimeInfo = async (title, ep_number) => {

    const API_URL = import.meta.env.VITE_API_URL
    const END_POINT = `/api/anime_info/?title=${title}&ep_number=${ep_number}`


    let response = await axios.get(API_URL + END_POINT, {
      crossdomain: true,
    });
    
    console.log(response.data)
    // console.log(data.anime_file)

    return response.data
  }

export default fetchAanimeInfo;