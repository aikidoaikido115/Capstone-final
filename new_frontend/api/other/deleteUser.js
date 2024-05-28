import axios from "axios";


const deleteUser = async (username, force_re_render) => {

    const API_URL = import.meta.env.VITE_API_URL
    const END_POINT = `/api/admin/deleteUser/:${username}`


    let response = await axios.delete(API_URL + END_POINT, {
      crossdomain: true,
    });
    
    console.log(response.data)
    // console.log(data.anime_file)

    return response.data
}

export default deleteUser;