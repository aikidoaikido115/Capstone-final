import axios from "axios";


const createComment = async (obj_send_to_backend) => {

    const API_URL = import.meta.env.VITE_API_URL
    const END_POINT = `/api/user/createComment`


    console.log("รันตรง axios นะ")
    let response = await axios.post(API_URL + END_POINT, obj_send_to_backend);
    
    console.log(response.data)
    // console.log(data.anime_file)

    return response.data
}

export default createComment;