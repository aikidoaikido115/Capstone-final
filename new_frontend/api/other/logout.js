import axios from "axios";





const logout = async () =>{
    const API_URL = import.meta.env.VITE_API_URL
    const END_POINT = `/api/logout`
    // const navigate = useNavigate();
    let response = await axios.get(API_URL + END_POINT, {
      crossdomain: true,
    });

    console.log(response.data)
    // navigate("/")
    return response.data
}


export default logout;