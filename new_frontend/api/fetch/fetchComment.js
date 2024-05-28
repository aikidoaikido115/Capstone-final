import axios from "axios";

const fetchComment = async (title, ep_number) => {

    const API_URL = import.meta.env.VITE_API_URL
    const END_POINT = `/api/comment/?title=${title}&ep_number=${ep_number}`


    let response = await axios.get(API_URL + END_POINT, {
      crossdomain: true,
    });
    
    console.log(response.data)
    // console.log(data.anime_file)

    return response.data
  }

export default fetchComment;