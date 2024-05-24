import axios from "axios";


const add_to_watch_list = async (obj) => {

    const API_URL = import.meta.env.VITE_API_URL
    const END_POINT = `/api/user/to_watch_list`


    console.log("รันตรง axios นะ")
    let response = await axios.post(API_URL + END_POINT,obj);
    
    console.log(response.data)


    return response.data
}

export default add_to_watch_list;