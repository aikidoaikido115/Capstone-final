import { useEffect, useState, useRef } from "react";
import axios, { spread } from "axios";
// import "./core-ui-css/index.css";
import { useNavigate } from "react-router-dom";

import default_logo from "../../../public/animeHub V2.png";
import premium_logo from "../../../public/animeHub_premium.png";

import fetchBasicInfo from "../../../api/fetch/fetchBasicInfo";
import fetchArrayBasicInfo from "../../../api/fetch/fetchArrayBasicInfo";
import fetchArrayBasicInfo_watch_list from "../../../api/fetch/fetchArrayBasicInfo_watch_list";
import fetchPremiumStatus from "../../../api/fetch/fetchPremiumStatus";
import increaseView from "../../../api/other/increaseView";
import saveHistory from "../../../api/other/saveHistory";
import logout from "../../../api/other/logout";
import timer from "../../../api/other/timer";


import delete_to_watch_list from "../../../api/other/delete_to_watch_list";
import RightClickDelete from "../../components/right_click_delete/right_click";
import Nav from "../../components/navbar/index";
import SessionNav from "../../components/navbar/SessionNav";
import Circle from "../../components/profile_fit_circle";
import Notification from "../../components/popup/Notification";
import { Link } from "react-router-dom";
import {RotatingLines} from "react-loader-spinner"

import { debounce } from 'lodash';




import not_found from "../../../public/not found.webp"
import Spyfamwallpaper from "../../../public/spy.jpg"
import rezero from "../../../public/rezero.jpg"
import yaiba from "../../../public/yaiba.webp"
import release from "../../../public/release_the_spyce.jpg"

import userAvatar from "../../../public/user-avatar.png";

function ToWatchList() {

    const [array_basic_data, setArray_basic_data] = useState({
        AnimeTitle: ["anime_title1"],
        image:["base64Image bra bra bra ant mai oak"],
        genre_2d_array:[["dasdsad"]],
        sum_view_array:[0],
        premium_status_array:[0],
        isEnded_array:[0],
    });

    const [contextMenu, setContextMenu] = useState({ mouseX: null, mouseY: null, index: null });

    const [isOpen, setIsOpen] = useState(false);


    const [user_data, setUser_data] = useState({});

    const [toggleMoreInfo, setToggleMoreInfo] = useState(false)


    const [logo, setLogo] = useState(false)




    const [f, forceUpdate] = useState();

    const gridRef = useRef(null);

    const navigate = useNavigate();

    

    axios.defaults.withCredentials = true;

    const handleContextMenu = (event, index) => {
        event.preventDefault();
        setContextMenu({
            mouseX: event.clientX,
            mouseY: event.clientY,
            index: index,
        });
    };

    const handleDelete = () => {
        
        // console.log(`delete ${contextMenu.index} from watch list`);
        // console.log(`delete ${array_basic_data.AnimeTitle[contextMenu.index]} from watch list`);
        // alert("ลบแล้ว")
        delete_to_watch_list(array_basic_data.AnimeTitle[contextMenu.index])
            .then(res => {
                setContextMenu({ mouseX: null, mouseY: null, index: null }); // Close the context menu
                forceUpdate(Math.random());
            })
    };

    const handleClickAway = () => {
        setContextMenu({ mouseX: null, mouseY: null, index: null }); // Close the context menu
    };

    const handleOk = () => {
        setIsOpen(false);
      };

    const handleLogout = () => {
        
        logout()
        forceUpdate(Math.random());
    }

    const handleMoreInfo = () => {
        setToggleMoreInfo(!toggleMoreInfo)
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
            navigate(`/watch/${encodeURIComponent(title)}/1`)
        }

        else if (status_obj.user_premium_status === false && status_obj.anime_premium_status === false) {
            await saveHistory(title)
            await increaseView(title)
            console.log(title)
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


            axios.get(`http://localhost:8000/api/user_specific_info/?username=${response.data.username}`)
            .then(user_specific_info =>{
                console.log(user_specific_info)
                setUser_data(user_specific_info.data);

                fetchPremiumStatus("just give me only user status")
                .then(status_obj => {
                    if (status_obj.user_premium_status === true) {
                        setLogo(true)
                        console.log(logo,"เป็นค่าไร")
                    }
                })
            })
            
        } else {
            setUser_data({ username: "Guest login" });
            setLogo(false)
            console.log(logo,"เป็นค่าไร")
            navigate("/login")
        }
        });



    fetchArrayBasicInfo_watch_list()
    .then(anime =>{
        console.log(anime)
        console.log("wtf")
        setArray_basic_data(anime)
    })
    
    timer()
        .then(result => {
            console.log(result)
        })

    }

    const handleScroll = () => {
        const gridItems = gridRef.current?.querySelectorAll('.grid-item');
        const windowHeight = window.innerHeight;
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        console.log("ถึง other")
        if (gridItems) {
            gridItems.forEach(item => {
              const rect = item.getBoundingClientRect();
              const isVisible = (rect.top + scrollTop) < (windowHeight + scrollTop);
              if (isVisible) {
                item.classList.add('opacity-100');
                item.classList.remove('opacity-0');
              }
            });
          }
        };


    window.addEventListener('scroll', handleScroll );

    handleScroll()

    return () => {
        window.removeEventListener('scroll', handleScroll);
        isMount = false;
    };
    }, [f]);
  
    return (
        <>
            {(array_basic_data.AnimeTitle[0] === "anime_title1") && (
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
            {(array_basic_data.AnimeTitle[0] !== "anime_title1") && (
                <>
                    {isOpen && (
                        <Notification
                          message="Please subscribe anime battle pass to view premium content"
                          onOk={handleOk}
                          color_button={'bg-blue-500'}
                          color_hover_button={'bg-blue-600'}
                        />
                    )}
                    <div className="relative h-screen">
                        {user_data.username !== "Guest login" ? <SessionNav Logout={handleLogout} User_image={`data:image/jpeg;base64,${user_data.image}`} logo={logo ? premium_logo:default_logo}/> : <Nav/>}
                        {/* <img src={Spyfamwallpaper} alt="Background" className="absolute inset-0 object-cover w-full h-full" /> */}
                        <div className="bg-black absolute inset-0 object-cover w-full">
                            <div className="bg-black min-h-screen flex flex-col">
                                
                                <div className="flex-1 bg-black-900 text-white p-8">
                                    <h2 className="text-2xl font-bold mt-28 mb-4">Your Watch List</h2>
                                    <div className="relative h-screen w-screen" onClick={handleClickAway}>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
                                            {array_basic_data.AnimeTitle.length > 0 ?
                                            array_basic_data.AnimeTitle.map( (title, index) =>(
                                                <div
                                                  className="rounded-lg shadow-lg p-8 hover:scale-110"
                                                  key={index}
                                                  onContextMenu={(event) => handleContextMenu(event, array_basic_data.AnimeTitle.length - 1 - index)}
                                                  >
                                                    {/* <div className="text-lg font-semibold">{Boolean(array_basic_data.premium_status_array[array_basic_data.AnimeTitle.length - 1 - index]) === true ? <h3 className="text-pink-400">PREMIUM</h3> : <h3 className="text-lime-400">FREE</h3>}</div> */}
                                                    <div onClick={() => handle_navigate_and_view_count(array_basic_data.AnimeTitle[array_basic_data.AnimeTitle.length - 1 - index])} className="cursor-pointer">
                                                        <div className="w-full h-80 object-cover mb-2 relative">
                                                            <div className="absolute inset-x-0 -top-3">
                                                                <div className="flex justify-center items-center">
                                                                    {Boolean(array_basic_data.premium_status_array[array_basic_data.AnimeTitle.length - 1 - index]) === true
                                                                        ?
                                                                        <p
                                                                        className="text-black text-center text-xs font-bold bg-pink-500 p-1 rounded-2xl w-24"
                                                                        >PREMIUM
                                                                        </p>
                                                                        :
                                                                        <p
                                                                        className="text-black text-center text-xs font-bold bg-lime-500 p-1 rounded-2xl w-24"
                                                                        >FREE
                                                                        </p>
                                                                    }
                                                                </div>
                                                            </div>
                                                            <img
                                                            src={`data:image/jpeg;base64,${array_basic_data.image[array_basic_data.AnimeTitle.length - 1 - index]}`}
                                                            alt="Movie"
                                                            className="w-full h-full object-cover border-2 border-amber-500 rounded-3xl"
                                                            />
                                                        </div>
                                                        <h3 className="text-lg font-semibold">{array_basic_data.AnimeTitle[array_basic_data.AnimeTitle.length - 1 - index]}<span> {`[${Boolean(array_basic_data.isEnded_array[array_basic_data.AnimeTitle.length - 1 - index]) ? `Finished` : `On air`}]`}</span></h3>
                                                    </div>
                                                    <p className="text-sm">{array_basic_data.sum_view_array[array_basic_data.AnimeTitle.length - 1 - index]} View</p>
                                                    <p className="text-sm truncate">Genre: <span className="text-amber-500">{array_basic_data.genre_2d_array[array_basic_data.AnimeTitle.length - 1 - index].map((element, i) => i < array_basic_data.genre_2d_array[array_basic_data.AnimeTitle.length - 1 - index].length - 1 ? element + ", " : element)}</span></p>
                                                </div>
                                            ))
                                            :
                                            <div className="min-h-px flex items-center justify-center">
                                                <div className="absolute inset-0 -top-72 flex items-center justify-center">
                                                    <div className="text-center">
                                                        <img src={not_found} className="mx-auto mb-4 w-96 h-96 object-cover"/>
                                                        <p className="text-lg text-white">Watch list empty</p>
                                                    </div>
                                                </div>
                                            </div>
                                            }
                                        </div>
                                        {contextMenu.mouseX !== null && (
                                            <RightClickDelete
                                                mouseX={contextMenu.mouseX}
                                                mouseY={contextMenu.mouseY}
                                                handleDelete={handleDelete}
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    );
}

export default ToWatchList;
