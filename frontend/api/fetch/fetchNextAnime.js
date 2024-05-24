import axios from "axios";


//Recommender system จุดที่ 2
const fetchNextAnime = async () => {

    const API_URL = import.meta.env.VITE_API_URL
    const END_POINT = `/api/next_anime`


    let response = await axios.get(API_URL + END_POINT, {
      crossdomain: true,
    });
    
    console.log(response.data)
    // console.log(data.anime_file)

    return response.data
  }

export default fetchNextAnime;