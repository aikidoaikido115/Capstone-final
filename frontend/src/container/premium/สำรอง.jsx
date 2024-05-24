import { useEffect, useState } from "react";
import axios, { spread } from "axios";

import logout from "../../../api/other/logout";

import default_logo from "../../../public/animeHub V2.png";
import premium_logo from "../../../public/animeHub_premium.png";

import Nav from "../../components/navbar/index";
import SessionNav from "../../components/navbar/SessionNav";
import Notification from "../../components/popup/Notification";
import fetchPremiumInfo from "../../../api/fetch/fetchPremiumInfo";
import fetchPremiumStatus from "../../../api/fetch/fetchPremiumStatus";
import getPremium from "../../../api/other/getPremium";


import { Link, useNavigate } from "react-router-dom";


function PremiumPage() {
  
    //user data
    const [user_data, setUser_data] = useState({});
    const [isOveride_premium, setIsOveride_premium] = useState(false)
    const [premium_data, setPremium_data] = useState({
        package_name_array:[],
        price_array:[]
    })

    const [isOpen, setIsOpen] = useState(false);


    const [logo, setLogo] = useState(false)

   
    const [f, forceUpdate] = useState();

    const navigate = useNavigate();

    axios.defaults.withCredentials = true;

    const handleOk = () => {
        setIsOpen(false);
        setIsOveride_premium(false)

        
      };

    const handleLogout = () => {
        
        logout()
        forceUpdate(Math.random());
    
    
    }
    const handlePackageRegister = async (package_name) => {
         const result = await getPremium(package_name)
 
         if (result === "im premium i can not register again until timeout") {
            setIsOpen(true)
            setIsOveride_premium(true)
         }
         else {
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
              navigate("/")
            }
          });
        }
        fetchPremiumInfo()
            .then(obj_res => {
                console.log(obj_res)
                setPremium_data(obj_res)
            })

        return () => {
          isMount = false;
        };
      }, [f]);
    
    return (
        <>
            <div className="fixed inset-0 bg-black text-white text-xl font-serif overflow-y-auto">
                {user_data.username !== "Guest login" ? (
                    <SessionNav Logout={handleLogout} User_image={`data:image/jpeg;base64,${user_data.image}`} logo={logo ? premium_logo:default_logo}/>
                ) : (
                    <Nav />
                )}
                {isOpen && (!isOveride_premium ?
                        <Notification
                          message="ยินดีด้วยคุณสมัครพรีเมี่ยมสำเร็จแล้ว คุณสามารถรับชมอนิเมะได้ทุกเรื่อง"
                          onOk={handleOk}

                          color_button={'bg-blue-500'}
                          color_hover_button={'bg-blue-600'}
                        />
                        :
                        <Notification
                        message="คุณเคยสมัครพรีเมี่ยมไปแล้ว กรุณาสมัครใหม่อีกครั้งเมื่อเวลาหมด"
                        onOk={handleOk}
 
                        color_button={'bg-red-500'}
                        color_hover_button={'bg-red-600'}
                      />
                    )}
                <div className="flex flex-col items-center justify-center h-full">
                    <h1 className="text-white text-4xl my-10 text-center">Premium Package</h1>
                    <div className="my-5 flex flex-row gap-10">
                        {premium_data.package_name_array.map((element, index) => (
                            <div key={index} className="bg-amber-500 p-8 rounded-lg shadow-lg text-center">
                                <h2 className="text-2xl text-white mb-4">{element}</h2>
                                <p className="text-white mb-4">ราคา: {premium_data.price_array[index]} บาท</p>
                                <button
                                onClick={() => handlePackageRegister(element)}
                                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
                                >
                                    สมัครเลย!
                                </button>
                            </div>
                        ))}

                    </div>
                    
    
                </div>
            </div>
        </>
    );
}

export default PremiumPage;
