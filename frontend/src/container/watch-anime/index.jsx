import React from 'react';
import VideoPlayer from './VideoPlayer';
import { useState, useEffect} from 'react';
import Comments from "../../components/comment/Comments";

import axios from "axios";

import default_logo from "../../../public/animeHub V2.png";
import premium_logo from "../../../public/animeHub_premium.png";

import fetchArrayNewAnime from '../../../api/fetch/fetchArrayNewAnime';
import fetchNextAnime from '../../../api/fetch/fetchNextAnime';
import fetchUserInfo from "../../../api/fetch/fetchUserInfo"
import fetchAanimeInfo from "../../../api/fetch/fetchAnimeInfo";
import fetchVideoStream from "../../../api/fetch/fetchVideoStream";
import fetchBasicInfo from "../../../api/fetch/fetchBasicInfo";
import fetchPremiumStatus from "../../../api/fetch/fetchPremiumStatus";
import increaseView from "../../../api/other/increaseView";
import saveHistory from "../../../api/other/saveHistory";
import logout from "../../../api/other/logout";
import timer from "../../../api/other/timer";
import add_to_watch_list from '../../../api/other/add_to_watch_list';
// import "./core-ui-css/index.css";

import DanmakuForm from "../../components/fly_comment/DanmakuForm";
import Danmaku from "../../components/fly_comment/index";
import Nav from "../../components/navbar/index";
import Notification from "../../components/popup/Notification";
import SessionNav from "../../components/navbar/SessionNav";
import Switch from 'react-switch';

import { useParams, useNavigate, Link} from 'react-router-dom';
import fetchEpisodeNumber from "../../../api/fetch/fetchEpisodeNumber";

import {RotatingLines} from "react-loader-spinner"



const textColor = 'text-white dark:text-zinc-400';
const titleColor = 'text-white dark:text-white';
const buttonBase = 'px-2 py-1 rounded text-sm ' + textColor + ' border-zinc-300 dark:border-zinc-700';
const tagClasses = 'px-2 py-1 text-sm text-black bg-amber-500 rounded-full';

const PlayerLayoutTest = ( { src } ) => {
  // Test tags, (could be fetched or passed as props)
  const tags = ['General List Top 1', 'Anime', 'Comic adaptation', 'Hot-blooded', 'Fantasy'];

  // Test series (could be fetched or passed as props)
  const series = [
    {
      name: 'One Piece',
      description: 'Comic adaptation / Hot-blooded',
      views: '2.18M Views',
      thumbnail: 'https://placehold.co/150',
    },
    // Add more series
  ];
  const [array_new_anime, setArray_new_anime] = useState({
    AnimeTitle: ["anime_title1"],
    image:["base64Image bra bra bra ant mai oak"],
    genre_2d_array:[["dasdsad"]],
    sum_view_array:[0],
    premium_status_array:[0]
});

const [recommended_anime,setRecommended_anime] = useState({
    big_image:"base64Image but bigger size",
    big_title:" ",
    big_genre_1d_array:["genreeeeee"],
    big_view:0,
    big_premium_status:0
})

//   const [videoSrc, setVideoSrc] = useState('');

//   const handleVideoSrcChange = (event) => {
//     setVideoSrc(event.target.value);
//   };

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

  const [isOpen, setIsOpen] = useState(false);

  const [isOpenWatch, setIsOpenWatch] = useState(false)
  const [isOpenWarning, setIsOpenWarning] = useState(false)
  
  const [logo, setLogo] = useState(false)

  const { anime_title, episode_number } = useParams();


  const [timeStamp, setTimeStamp] = useState('');

  
  const [f, forceUpdate] = useState();

  const [toggleDanmaku, setToggleDanmaku] = useState(true);

  const navigate = useNavigate();

  axios.defaults.withCredentials = true;

  const handleOk = () => {
    setIsOpen(false);
  };

  const handleToggleDanmaku = (checked) => {
    // alert(toggleDanmaku)
    setToggleDanmaku(checked);
  };

  const handleTimeStamp = (value) => {
    setTimeStamp(value);
  };

  const handleLogout = () => {
    logout()
    forceUpdate(Math.random());
  }

  const handleChangeEpisode = (title, ep_number) =>{
    navigate(`/watch/${title}/${ep_number}`)
    
    setVideoUrl("")
    forceUpdate(Math.random());
  }
  const handleWatchList = async (title) => {
    // alert("คลิ้กติด")
    if (user_data.username !== "Guest login") {
        const obj = {
            title:title,
            username:user_data.username
        }
        const result = await add_to_watch_list(obj)
        console.log(result)
        if (result !== "this anime already in watch list") {
            setIsOpenWatch(true)
        }
        else {
            setIsOpenWarning(true)
        }
        
    }
    else {
        navigate("/login")
    }
  }
  const handleWatchListOK = () => {
    setIsOpenWatch(false)
  }
  const handleWatchListWarning = () => {
    setIsOpenWarning(false)
  }

  const handle_navigate_and_view_count = async (title) => {


    timer()
        .then(result => {
            console.log(result)
        })
    const status_obj = await fetchPremiumStatus(title)
    console.log("daasdasadasdsa",status_obj)

    if (status_obj.user_premium_status === true) {

        await saveHistory(title)
        await increaseView(title)
        setVideoUrl("")
        setEpisode_number_array([])
        forceUpdate(Math.random());

        navigate(`/watch/${encodeURIComponent(title)}/1`)
    }

    else if (status_obj.user_premium_status === false && status_obj.anime_premium_status === false) {
        await saveHistory(title)
        await increaseView(title)
        console.log(title)
        setVideoUrl("")
        setEpisode_number_array([])
        forceUpdate(Math.random());

        navigate(`/watch/${encodeURIComponent(title)}/1`)
    }
    else if (status_obj.user_premium_status === false && status_obj.anime_premium_status === true) {

        setIsOpen(true)

    }
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

        
        fetchArrayNewAnime()
        .then(anime =>{
            console.log(anime)
            console.log("wtf")
            setArray_new_anime(anime)
        })

        fetchNextAnime()
        .then(anime =>{
            console.log(anime)
            console.log("wtf")
            setRecommended_anime(anime)
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
                <body className="bg-black">
                    <div className='-mb-3'>
                    {user_data.username != "Guest login" ? <SessionNav Logout={handleLogout} User_image={`data:image/jpeg;base64,${user_data.image}`} logo={logo ? premium_logo:default_logo}/> : <Nav/>}
                    </div>

                    {isOpen && (
                        <Notification
                          message="Please subscribe anime battle pass to view premium content"
                          onOk={handleOk}
                          color_button={'bg-blue-500'}
                          color_hover_button={'bg-blue-600'}
                        />
                    )}

                    {isOpenWatch && (
                        <Notification
                          message={`Added ${anime_title} into watch list`}
                          onOk={handleWatchListOK}
                          color_button={'bg-blue-500'}
                          color_hover_button={'bg-blue-600'}
                        />
                    )}

                    {isOpenWarning && (
                        <Notification
                          message={`can not add watch list you already add this anime into watch list`}
                          onOk={handleWatchListWarning}
                          color_button={'bg-red-500'}
                          color_hover_button={'bg-red-600'}
                        />
                    )}
                
                    <div className="flex flex-col md:flex-row">
                        <div className="w-full md:w-3/4 p-4">
                            <div className="bg-black relative overflow-hidden">
                                {/* <p className='text-xl text-green-500 z-50 top-0'>{new Date(timeStamp * 1000).toISOString().substr(11, 8)}</p> */}
                                {/* Video player here*/}
                                {/* {[(<h1 className="text-red-500">1</h1>),(<h1 className="text-red-500">2</h1>),(<h1 className="text-red-500">3</h1>)]} */}
                                
                                {toggleDanmaku && (
                                    <Danmaku anime_title={anime_title} episode_number={episode_number} timeStamp={new Date(timeStamp * 1000).toISOString().substr(11, 8)}/>
                                )}
                                {/* <Danmaku anime_title={anime_title} episode_number={episode_number} timeStamp={new Date(timeStamp * 1000).toISOString().substr(11, 8)}/> */}
                                {/* <Danmaku anime_title={anime_title} episode_number={episode_number} timeStamp={new Date(timeStamp * 1000).toISOString().substr(11, 8)}/> */}
                                {/* <Danmaku anime_title={anime_title} episode_number={episode_number} timeStamp={new Date(timeStamp * 1000).toISOString().substr(11, 8)}/> */}
                                <VideoPlayer src={videoUrl} onCurrentTimeChange={handleTimeStamp}/>
                            </div>
                            <div className="flex items-center justify-between py-2">
                                <div className="flex justify-between ml-1 w-full">
                                    {/* <span className={textColor + " text-sm"}>2.18M views</span> */}
                                    <button
                                      className={"flex items-center ml-4" + buttonBase}
                                      onClick={() => handleWatchList(anime_title)}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
                                        </svg>
                                        <p className="ml-1 my-auto text-base">Add to my watchlist</p>
                                    </button>

                                    <div className='w-2/5 flex justify-between items-center gap-5'>

                                        <div class="relative group flex justify-center items-center">
                                            <Switch
                                            onChange={handleToggleDanmaku}
                                            checked={toggleDanmaku}
                                            offColor="#888"
                                            onColor="#FFA000"
                                            />
                                            <div class="absolute -top-16 z-10 hidden bg-gray-800 text-white text-sm px-2 py-1 rounded-lg mt-2 group-hover:block">
                                                toggle danmaku
                                            </div>
                                        </div>

                                        <DanmakuForm
                                        user_data={user_data}
                                        anime_title={anime_title}
                                        episode_number={episode_number}
                                        timeStamp={new Date(timeStamp * 1000).toISOString().substr(11, 8)}
                                        />
                                    </div>
                                </div>
                                <div>
                                    {/* Additional controls or information*/}
                                </div>
                            </div>

                            <h1 className={"text-3xl font-bold " + titleColor}>{basic_data.AnimeTitle} EP: {episode_number} <span className="text-amber-500">{basic_data.ep_name}</span></h1>
                            <p className={textColor + " text-base my-2"}>{basic_data.view} Views</p>
                            <div className="flex flex-wrap gap-2 my-2">
                                {basic_data.genre_1d_array.map((element, index) => (
                                <span key={index} className={tagClasses}>{element}</span>
                                ))}
                            </div>
                            {/* เรื่อย่อ plot: */}
                            <p className={textColor + " text-sm"}>
                                {/* Video description */}
                                {basic_data.description}
                            </p>
                            <hr className="my-4 border-zinc-300 dark:border-zinc-700" />
                            <Comments
                                // commentsUrl="http://localhost:3004/comments"
                                // currentUserId="1"
                                user_data = {user_data}
                                episode_number = {episode_number}
                                anime_title = {anime_title}
                            />
                        </div>
                        <div className="w-full md:w-1/4 p-4">
                            <h2 className={"text-xl font-bold " + titleColor + " mb-4"}>Episode</h2>
                            <div className="grid grid-cols-4 gap-4 w-4/5">
                                {/* Episodes */}
                                {episode_number_array.map((element, index) => (
                                    <button
                                    className="text-center bg-amber-500 rounded-lg p-1 my-2 hover:scale-105"
                                    onClick={() => handleChangeEpisode(anime_title, element)}
                                    >
                                        <span className="text-black text-sm">EP {element}</span>
                                    </button>
                                ))}

                            </div>
                            {recommended_anime.big_title !== "can not pred anime guest login or less than 2 anime watched" &&(
                            <div>
                                <h2 className={"text-xl font-bold " + titleColor + " mt-8 mb-4"}>Recommended Anime For You</h2>
                                <div className="space-y-4">
                                    <div
                                    className="flex items-center space-x-2 cursor-pointer"
                                    onClick={() => handle_navigate_and_view_count(recommended_anime.big_title)}
                                    >
                                        <img
                                        src={`data:image/jpeg;base64,${recommended_anime.big_image}`}
                                        alt="Series Thumbnail"
                                        className="w-32 h-20 object-cover border-2 border-amber-500 rounded-2xl hover:scale-105" />
                                        <div className='w-1/3'>
                                            <h3
                                            className={"truncate text-lg font-bold " + titleColor}
                                            >
                                                {recommended_anime.big_title}
                                            </h3>
                                            <p className={textColor + " text-sm truncate"}><span className="text-amber-500">{recommended_anime.big_genre_1d_array.map((element, i) => i < recommended_anime.big_genre_1d_array.length - 1 ? element + ", " : element)}</span></p>
                                            <p className={textColor + " text-sm"}>{recommended_anime.big_view} View</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            )}

                            <h2 className={"text-xl font-bold " + titleColor + " mt-8 mb-4"}>New anime</h2>
                            <div className="space-y-4">
                                {array_new_anime.AnimeTitle.map( (title, index) =>((index < 5) && (array_new_anime.AnimeTitle[array_new_anime.AnimeTitle.length - 1 - index] !== recommended_anime.big_title) ?
                                    <div
                                      key={index}
                                      className="flex items-center space-x-2 cursor-pointer"
                                      onClick={() => handle_navigate_and_view_count(array_new_anime.AnimeTitle[array_new_anime.AnimeTitle.length - 1 - index])}>
                                        <img
                                        src={`data:image/jpeg;base64,${array_new_anime.image[array_new_anime.AnimeTitle.length - 1 - index]}`}
                                        alt="Series Thumbnail"
                                        className="w-32 h-20 object-cover border-2 border-amber-500 rounded-2xl hover:scale-105" />
                                        <div className='w-1/3'>
                                            <h3
                                              className={"text-lg font-bold " + titleColor}
                                            >
                                                {array_new_anime.AnimeTitle[array_new_anime.AnimeTitle.length - 1 - index]}
                                            </h3>
                                            <p className={textColor + " text-sm truncate"}><span className="text-amber-500">{array_new_anime.genre_2d_array[array_new_anime.AnimeTitle.length - 1 - index].map((element, i) => i < array_new_anime.genre_2d_array[array_new_anime.AnimeTitle.length - 1 - index].length - 1 ? element + ", " : element)}</span></p>
                                            <p className={textColor + " text-sm"}>{array_new_anime.sum_view_array[array_new_anime.AnimeTitle.length - 1 - index]} View</p>
                                        </div>
                                    </div>
                                    :
                                    <div key={index}></div>
                                ))}
                                
                            </div>
                        </div>
                    </div>
                </body>
            </>
        )}
    </>
  );
};

export default PlayerLayoutTest;

