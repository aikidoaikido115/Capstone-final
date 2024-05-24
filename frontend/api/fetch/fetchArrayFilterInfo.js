import axios from "axios";

const fetchArrayFilterInfo = async (sort, category, status) => {

    const API_URL = import.meta.env.VITE_API_URL
    const END_POINT = `/api/array_filter_info/?sort=${sort}&category=${category}&status=${status}`


    let response = await axios.get(API_URL + END_POINT, {
      crossdomain: true,
    });
    
    console.log(response.data)
    // console.log(data.anime_file)

    return response.data
  }

export default fetchArrayFilterInfo;