import axios from "axios";


const deleteComment = async (comment_id) => {

    const API_URL = import.meta.env.VITE_API_URL
    const END_POINT = `/api/user/comment/:${comment_id}`


    let response = await axios.delete(API_URL + END_POINT, {
      crossdomain: true,
    });
    
    console.log(response.data)
    // console.log(data.anime_file)

    return response.data
}

export default deleteComment;