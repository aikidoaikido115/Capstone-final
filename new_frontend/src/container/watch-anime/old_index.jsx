import { useEffect, useState } from "react";
import axios from "axios";

import default_logo from "../../../public/animeHub V2.png";
import premium_logo from "../../../public/animeHub_premium.png";

import fetchUserInfo from "../../../api/fetch/fetchUserInfo"
import fetchAanimeInfo from "../../../api/fetch/fetchAnimeInfo";
import fetchVideoStream from "../../../api/fetch/fetchVideoStream";
import fetchBasicInfo from "../../../api/fetch/fetchBasicInfo";
import fetchPremiumStatus from "../../../api/fetch/fetchPremiumStatus";
import logout from "../../../api/other/logout";
import timer from "../../../api/other/timer";
// import "./core-ui-css/index.css";
import Nav from "../../components/navbar/index";
import SessionNav from "../../components/navbar/SessionNav";

import { useParams, useNavigate, Link} from 'react-router-dom';
import fetchEpisodeNumber from "../../../api/fetch/fetchEpisodeNumber";

import {RotatingLines} from "react-loader-spinner"

function WatchAnime() {
  const [videoUrl, setVideoUrl] = useState("");
  const [basic_data, setBasic_data] = useState({
    AnimeTitle: "anime_title",
    ep_name:"asdsadsasaa",
    genre_1d_array:["adasdsadsa"],
    description:"asdsadsa",
    view:0
  });
  const [user_data, setUser_data] = useState({})

  const [episode_number_array, setEpisode_number_array] = useState([])

  
  const [logo, setLogo] = useState(false)

  const { anime_title, episode_number } = useParams();

  
  const [f, forceUpdate] = useState();

  const navigate = useNavigate();

  axios.defaults.withCredentials = true;

  const handleLogout = () => {
    logout()
    forceUpdate(Math.random());
  }

  const handleChangeEpisode = (title, ep_number) =>{
    navigate(`/watch/${title}/${ep_number}`)
    
    setVideoUrl("")
    forceUpdate(Math.random());
  }

  

  useEffect(() => {
    let isMount = true;
    if (isMount) {

        
        axios.get(`http://localhost:8000/`).then((response) => {
        console.log(response.data);
        if (response.data.username) {

            
            fetchUserInfo(response.data.username)
            .then(user_specific_info =>{
                console.log(user_specific_info)
                setUser_data(user_specific_info.data);
            })

            fetchPremiumStatus("just give me only user status")
                .then(status_obj => {
                    if (status_obj.user_premium_status === true) {
                        setLogo(true)
                        console.log(logo,"เป็นค่าไร")
                    }
                })
            
            
        } else {
            setUser_data({ username: "Guest login" });
            setLogo(false)
        }
        });

        timer()
        .then(result => {
            console.log(result)

         
            fetchPremiumStatus(anime_title)
            .then(status_obj => {
       
                if (status_obj.user_premium_status === true) {
                    console.log("OK มีสิทธิ์ดูปกติ คุณเป็นพรีเมี่ยมดูได้ทุกเรื่อง")
                }
      
                else if (status_obj.user_premium_status === false && status_obj.anime_premium_status === false) {
                    console.log("OK มีสิทธิ์ดูปกติ คุณไม่เป็นพรีเมี่ยมดูเรื่องฟรีได้")
                }
                else if (status_obj.user_premium_status === false && status_obj.anime_premium_status === true) {
         
                    console.log("ไม่ใช่ premium redirect ออก")
                    navigate("/")
                }
            })
        })
        
        

        fetchVideoStream(anime_title, episode_number)
        .then(url =>{
        setVideoUrl(url)
        console.log(anime_title, episode_number)
        })


        fetchEpisodeNumber(anime_title)
        .then(result => {
            console.log("test api",result.episode_number_array)
            setEpisode_number_array(result.episode_number_array)
        })

        


        fetchAanimeInfo(anime_title, episode_number)
            .then(data =>{
            setBasic_data(data)
        })
        
      
    }
    return () => {
      isMount = false;
    };
  }, [f]);

  return (
    <>
        {(videoUrl === "") && (
            <div className="flex justify-center items-center h-screen bg-black">
                <RotatingLines
                  visible={true}
                  height="96"
                  width="96"
                  color="grey"
                  strokeWidth="5"
                  animationDuration="0.75"
                  ariaLabel="rotating-lines-loading"
                  wrapperStyle={{}}
                  wrapperClass=""
                />
            </div>
        )}
        {(videoUrl !== "") && (
            <>
                <div className="bg-black text-white text-xl font-serif">

                {user_data.username != "Guest login" ? <SessionNav Logout={handleLogout} User_image={`data:image/jpeg;base64,${user_data.image}`} logo={logo ? premium_logo:default_logo}/> : <Nav/>}

                <h3 className="font-sans text-2xl">
                    {basic_data.AnimeTitle}<br />EP: {episode_number} <span className="text-red-500">{basic_data.ep_name}</span>
                </h3>
                {videoUrl && (
                    <video className="w-[720px]" controls>
                    <source src={videoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                    </video>
                )}

                <p><span className="text-amber-500 font-sans">{basic_data.view}</span> view</p>
                <p className="text-amber-500 font-sans">
                    {basic_data.genre_1d_array.map((element, index) => index < basic_data.genre_1d_array.length - 1 ? `${element}, ` : element)}
                </p>
                <p className="font-sans">plot:<br/>{basic_data.description}</p>

                {episode_number_array.map((element, index) => (
                    <div key={index}>
                        <p className="text-white">
                            <button
                                className="bg-amber-500 rounded-lg p-1 my-2"
                                onClick={() => handleChangeEpisode(anime_title, element)}
                            >
                                Episode: {element}
                            </button>
                            <br />
                    </p>
                    </div>
                    
                ))}

                <h1>คอมเมนต์จากทางบ้าน</h1>
                <img width={"100px"} src={`data:image/jpeg;base64,${user_data.image}`}/>
                <h1 className="my-2">คุณ {user_data.username}: <span className="text-blue-500">บอกว่า: {user_data.text}</span></h1>
                {/* <div class="video-container">
                    <div class="video-overlay"></div>
                </div> */}
                </div>
            </>
        )}
        
    </>
  );
}

export default WatchAnime;
