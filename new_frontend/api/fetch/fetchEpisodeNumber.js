import axios from "axios";


//ข้อมูลไฟล์ mp4 อย่างเดียว
const fetchEpisodeNumber = async (title) => {

    const API_URL = import.meta.env.VITE_API_URL
    const END_POINT = `/api/episode_number/${title}`
    
    try {
        let response = await axios.get(API_URL + END_POINT, {
            crossdomain: true,
        })
        console.log(response.data)
        // console.log(data.anime_file)
        return response.data

    }
    catch (error) {
      console.error("Error fetching episode_number: ", error);
      return "Error fetching episode_number: " + error
    }
  };


  export default fetchEpisodeNumber;