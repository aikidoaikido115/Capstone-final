import axios from "axios";


const delete_to_watch_list = async (title) => {

    const API_URL = import.meta.env.VITE_API_URL
    const END_POINT = `/api/user/delete_watch_list/:${title}`


    let response = await axios.delete(API_URL + END_POINT, {
      crossdomain: true,
    });
    
    console.log(response.data)
    // console.log(data.anime_file)

    return response.data
}

export default delete_to_watch_list;