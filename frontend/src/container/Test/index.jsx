import { useEffect, useState } from "react";
import axios, { spread } from "axios";
// import "./core-ui-css/index.css";
// import { useNavigate } from "react-router-dom";


import fetchBasicInfo from "../../../api/fetch/fetchBasicInfo";
import logout from "../../../api/other/logout";

import Nav from "../../components/navbar/index";
import SessionNav from "../../components/navbar/SessionNav";
import Circle from "../../components/profile_fit_circle";
import { Link } from "react-router-dom";





import Spyfamwallpaper from "../../../public/spy.jpg"
import rezero from "../../../public/rezero.jpg"
import yaiba from "../../../public/yaiba.webp"
import release from "../../../public/release_the_spyce.jpg"

import userAvatar from "../../../public/user-avatar.png";


function Test() {
  const [basic_data, setBasic_data] = useState({});

  //user data
  const [user_data, setUser_data] = useState({});



  const [f, forceUpdate] = useState();



  axios.defaults.withCredentials = true;

  const handleLogout = () => {

    logout()
    forceUpdate(Math.random());


    
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
            })
          
        } else {
          setUser_data({ username: "Guest login" });
        }
      });

      fetchBasicInfo()
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
      <div className="fixed inset-0 bg-black text-white text-xl font-serif overflow-y-auto">
      {user_data.username != "Guest login" ? <SessionNav Logout={handleLogout} User_image={`data:image/jpeg;base64,${user_data.image}`}/> : <Nav/>}
        <div className="flex justify-center items-center">
          <div className="flex-grow">
            <h1 className="text-6xl my-10 text-center mx-2">
              ยินดีต้อนรับคุณ <span className="text-amber-500">{user_data.username}</span>
            </h1>
            <h2 className="text-4xl my-10 text-center mx-2">
              รูปโปรไฟล์ของคุณจะแสดงตรงนี้หากคุณ Login แล้ว
            </h2>
            
            {user_data.username != "Guest login" ? <Circle src={`data:image/jpeg;base64,${user_data.image}`}/>:console.log("ไม่ได้ login เพราะงั้นจึงไม่มีรูปโปรไฟล")}
            <h1 className="my-5 mx-2 text-5xl text-center">
              {basic_data.AnimeTitle}
            </h1>
            <Link to="/watch">
              <img
                className="mx-auto"
                src={`data:image/jpeg;base64,${basic_data.image}`}
                width={"300px"}
              />
            </Link>
            <h3 className="w-1/2 text-center mx-auto">
              เรื่อยย่อ: <span>{basic_data.description}</span>
            </h3>
            <br />
            <h3 className="w-1/2 text-center mx-auto">
              แนวเรื่อง: <span className="text-amber-500">{basic_data.genre}</span>
            </h3>
          </div>
        </div>
      </div>
    </>
  );
}

export default Test;
