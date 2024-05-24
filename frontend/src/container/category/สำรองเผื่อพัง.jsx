import { useEffect, useState } from "react";
import axios, { spread } from "axios";
// import "./core-ui-css/index.css";
import { useNavigate } from "react-router-dom";

import default_logo from "../../../public/animeHub V2.png";
import premium_logo from "../../../public/animeHub_premium.png";

import fetchBasicInfo from "../../../api/fetch/fetchBasicInfo";
import fetchArrayBasicInfo from "../../../api/fetch/fetchArrayBasicInfo";
import fetchPremiumStatus from "../../../api/fetch/fetchPremiumStatus";
import increaseView from "../../../api/other/increaseView";
import saveHistory from "../../../api/other/saveHistory";
import logout from "../../../api/other/logout";
import timer from "../../../api/other/timer";

import Nav from "../../components/navbar/index";
import SessionNav from "../../components/navbar/SessionNav";
import Circle from "../../components/profile_fit_circle";
import Notification from "../../components/popup/Notification";
import { Link } from "react-router-dom";


import Spyfamwallpaper from "../../../public/spy.jpg"
import rezero from "../../../public/rezero.jpg"
import yaiba from "../../../public/yaiba.webp"
import release from "../../../public/release_the_spyce.jpg"

import userAvatar from "../../../public/user-avatar.png";

import quick_sort from 'lodash';


function Category() {
    // const [basic_data, setBasic_data] = useState({});
    const [array_basic_data, setArray_basic_data] = useState({
        AnimeTitle: ["anime_title1"],
        image:["base64Image bra bra bra ant mai oak"],
        genre_2d_array:[["dasdsad"]],
        sum_view_array:[0],
        premium_status_array:[0],
        isEnded_array:[0]
    });

    //สวิทเปิดปิด popup คุณไม่ใช่ Premium
    const [isOpen, setIsOpen] = useState(false);

    //user data
    const [user_data, setUser_data] = useState({});

    const [toggleMoreInfo, setToggleMoreInfo] = useState(false)

    const [selectedValue_Sort, setSelectedValue_Sort] = useState("newest");
    const [selectedValue_Status, setSelectedValue_Status] = useState("all");


    const [logo, setLogo] = useState(false)

    const [temp_array_basic_data, setTemp_array_basic_data] = useState({
        AnimeTitle: ["anime_title1"],
        image:["base64Image bra bra bra ant mai oak"],
        genre_2d_array:[["dasdsad"]],
        sum_view_array:[0],
        premium_status_array:[0],
        isEnded_array:[0]
    })



    const [f, forceUpdate] = useState();

    //   console.log(process.env.URL_API); 

    const navigate = useNavigate();

    axios.defaults.withCredentials = true;

    const swap_array_basic_data = () => {
        setArray_basic_data({
            ...array_basic_data,
            AnimeTitle: [...array_basic_data.AnimeTitle].reverse(),
            image: [...array_basic_data.image].reverse(),
            genre_2d_array: [...array_basic_data.genre_2d_array].reverse(),
            sum_view_array: [...array_basic_data.sum_view_array].reverse(),
            premium_status_array: [...array_basic_data.premium_status_array].reverse(),
            isEnded_array: [...array_basic_data.isEnded_array].reverse()
        })
        console.log("สลับสำเร็จ")
    }

    // Event handler function to update the selected value
    const handleSelectChange_Sort = (event) => {
        setSelectedValue_Sort(event.target.value);
        console.log("sort value:", event.target.value);

        setTemp_array_basic_data(array_basic_data)
        if (event.target.value === "newest"){
            swap_array_basic_data()
        }
        else if (event.target.value === "oldest"){
            
            swap_array_basic_data()
        }
    };


    const handleSelectChange_Status = (event) => {
        setSelectedValue_Status(event.target.value);
        console.log("status value:", event.target.value);



        if (event.target.value === "all") {
            // setArray_basic_data(temp_array_basic_data) //why can not set previos basic_data
            fetchArrayBasicInfo()
                .then(anime =>{
                    setArray_basic_data(anime)
                    if (selectedValue_Sort === "newest") {
                        console.log("all ตกเงื่อนไข newest")

      
                        forceUpdate(Math.random());
    
                    }
                    else {
                        console.log("all ตกเงื่อนไข oldest")
                        swap_array_basic_data()
                        forceUpdate(Math.random());
                    }
                })
        }


        else if (event.target.value === "free")  {

            const filteredData = {
                AnimeTitle: [],
                image: [],
                genre_2d_array: [],
                sum_view_array: [],
                premium_status_array: [],
                isEnded_array: []
            };
    
            array_basic_data.premium_status_array.forEach((status, index) => {
                if (status !== 1) {
                    filteredData.AnimeTitle.push(array_basic_data.AnimeTitle[index]);
                    filteredData.image.push(array_basic_data.image[index]);
                    filteredData.genre_2d_array.push(array_basic_data.genre_2d_array[index]);
                    filteredData.sum_view_array.push(array_basic_data.sum_view_array[index]);
                    filteredData.premium_status_array.push(array_basic_data.premium_status_array[index]);
                    filteredData.isEnded_array.push(array_basic_data.isEnded_array[index]);
                }
            });
    
            setArray_basic_data(filteredData);

        }


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
            console.log(title, "ก่อนจะย้ายหน้าไม่ undefined")
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
            }
          });
    

        fetchArrayBasicInfo()
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

        return () => {
          isMount = false;
        };
      }, [f]);
    return (
        <>
             {(array_basic_data.AnimeTitle[0] !== "anime_title1") && (
                <>
                    {isOpen && (
                        <Notification
                          message="กรุณาสมัครแพ็กเกจเพื่อรับชมเนื้อหาสุดพรีเมี่ยม"
                          onOk={handleOk}
                          color_button={'bg-blue-500'}
                          color_hover_button={'bg-blue-600'}
                        />
                    )}
                    <div className="relative h-screen">
                        <div className="h-fit bg-black">
                            {user_data.username !== "Guest login" ? <SessionNav Logout={handleLogout} User_image={`data:image/jpeg;base64,${user_data.image}`} logo={logo ? premium_logo:default_logo}/> : <Nav/>}
                            {/* <img src={Spyfamwallpaper} alt="Background" className="absolute inset-0 object-cover w-full h-full" /> */}
                            
                            <div className="bg-black min-h-screen flex flex-col">
                                {/* Anime Billboard */}
                                

                                {/* Grid Layout */}
                                <div className="flex-1 bg-black-900 text-white p-8">
                                    <div className="bg-gray-900 text-white mt-1 p-4 rounded-lg mb-6">
                                        <div className="flex items-center justify-center">
                                            <h2 className="text-lg font-semibold">
                                                <label htmlFor="category" className="mr-2">Sort By: </label>
                                                <select
                                                  name="feature"
                                                  id="feature"
                                                  className="px-2 py-1 bg-orange-800 text-white rounded mr-6"
                                                  onChange={handleSelectChange_Sort}
                                                >
                                                    <option value="newest">Newest</option>
                                                    <option value="oldest">Oldest</option>
                                                </select>
                                            </h2>
                                            <h2 className="text-lg font-semibold">
                                                <label htmlFor="category" className="mr-2">Categories: </label>
                                                <select name="category" id="category" className="px-2 py-1 bg-orange-800 text-white rounded mr-6">
                                                    <option value="all">All</option>
                                                    <option value="action">Action</option>
                                                    <option value="romantic">Romantic</option>
                                                    <option value="ecchi">Ecchi</option>
                                                </select>
                                            </h2>
                                            <h2 className="text-lg font-semibold">
                                                <label htmlFor="status" className="mr-2">Status: </label>
                                                <select
                                                  name="status"
                                                  id="status"
                                                  className="px-2 py-1 bg-orange-800 text-white rounded mr-6"
                                                  onChange={handleSelectChange_Status}
                                                  >
                                                    <option value="all">All</option>
                                                    <option value="free">Free</option>
                                                    <option value="premium">Premium</option>
                                                    <option value="end">End</option>
                                                    <option value="not_end">Not end</option>
                                                </select>
                                            </h2>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
                                    {array_basic_data.AnimeTitle.map( (title, index) =>(index >= 0 ?
                                            <div className="bg-gray-800 rounded-lg shadow-lg p-4" key={index}>
                                                <div className="text-lg font-semibold">{Boolean(array_basic_data.premium_status_array[array_basic_data.AnimeTitle.length - 1 - index]) === true ? <h3 className="text-pink-400">PREMIUM</h3> : <h3 className="text-lime-400">FREE</h3>}</div>
                                                    <div onClick={() => handle_navigate_and_view_count(array_basic_data.AnimeTitle[array_basic_data.AnimeTitle.length - 1 - index])} className="cursor-pointer">
                                                        <img src={`data:image/jpeg;base64,${array_basic_data.image[array_basic_data.AnimeTitle.length - 1 - index]}`} alt="Movie" className="w-full h-48 object-cover mb-2" />
                                                        <h3 className="text-lg font-semibold">{array_basic_data.AnimeTitle[array_basic_data.AnimeTitle.length - 1 - index]}<span> {`[${Boolean(array_basic_data.isEnded_array[array_basic_data.AnimeTitle.length - 1 - index]) ? `จบแล้ว` : `ยังไม่จบ` }]`}</span></h3>
                                                    </div>
                                                <p className="text-sm">{array_basic_data.sum_view_array[array_basic_data.AnimeTitle.length - 1 - index]} View</p>
                                                <p className="text-sm truncate">Genre: <span className="text-amber-500">{array_basic_data.genre_2d_array[array_basic_data.AnimeTitle.length - 1 - index].map((element, i) => i < array_basic_data.genre_2d_array[array_basic_data.AnimeTitle.length - 1 - index].length - 1 ? element + ", " : element)}</span></p>
                                            </div>
                                            :
                                            <div key={index}></div>
                                        ))}
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

export default Category;