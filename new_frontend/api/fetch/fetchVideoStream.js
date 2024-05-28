import axios from "axios";



const fetchVideoStream = async (title, episode_number) => {

    console.log("ก่อนยิง api", title, episode_number)
    const API_URL = import.meta.env.VITE_API_URL
    const END_POINT = `/api/video/${title}/${episode_number}`

    try {
      // Make a GET request to your backend to get the video stream
      const response = await axios.get(API_URL + END_POINT, {
        responseType: "blob",
      }); // Replace with your backend endpoint
      const url = URL.createObjectURL(response.data);
      return url

    } catch (error) {
      console.error("Error fetching video stream:", error);
      return "Error fetching video stream: " + error
    }
  };


  export default fetchVideoStream;