import { useEffect, useState } from "react";
import axios, { spread } from "axios";

import Circle from "../../components/profile_fit_circle/index";

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

const PremiumPage = () => {
    
    const [selectedPackage, setSelectedPackage] = useState(null);

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

    const handleCancelClick = () => {
        setSelectedPackage(null);
    };

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
            <div className="relative h-screen">
                {user_data.username !== "Guest login" ? <SessionNav Logout={handleLogout} User_image={`data:image/jpeg;base64,${user_data.image}`} logo={logo ? premium_logo:default_logo}/> : <Nav/>}
                {isOpen && (!isOveride_premium ?
                        <Notification
                          message="Congratulation! now you can watch all anime"
                          onOk={handleOk}
   
                          color_button={'bg-blue-500'}
                          color_hover_button={'bg-blue-600'}
                        />
                        :
                        <Notification
                        message="you already have battle pass please subscribe next time"
                        onOk={handleOk}
                        color_button={'bg-red-500'}
                        color_hover_button={'bg-red-600'}
                      />
                    )}
                <div className="bg-black absolute inset-0 object-cover w-full">
                    <div className="bg-black h-screen flex justify-center items-center"> 
                        <div className="bg-gray-100 mx-auto w-1/3 p-4 rounded-lg">
                            <h1 className='text-2xl text-white bg-amber-500 py-2 px-4 mb-4 font-bold rounded-md'> Premium package </h1>
                                <div className="mb-4">
                                    <h2>Welcome, {user_data.username}!<br/>Select your plan!</h2>
                                </div>
                            <div>
                                {premium_data.package_name_array.map((element, index) => (
                                    <div key={index} className="bg-gray-700 hover:bg-gray-600 mt-1 px-4 py-2 rounded-md cursor-pointer flex justify-between" onClick={() => handlePackageRegister(element)}>
                                        <h2 className="text-white">{element}</h2>
                                        <h2 className="text-white">{premium_data.price_array[index]} ฿</h2>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PremiumPage;
