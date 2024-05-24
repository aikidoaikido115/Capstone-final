import { useEffect, useState } from "react";
import axios from "axios";
// import "./core-ui-css/index.css";
import { useNavigate } from "react-router-dom";

import default_logo from "../../../public/animeHub V2.png";
import premium_logo from "../../../public/animeHub_premium.png";
import fetchPremiumStatus from "../../../api/fetch/fetchPremiumStatus";

import deleteAnime from "../../../api/other/deleteAnime";
import deleteUser from "../../../api/other/deleteUser";
import fetchTable from "../../../api/fetch/fetchTable";
import fetchBasicInfo from "../../../api/fetch/fetchBasicInfo";

import fetchArrayBasicInfo from "../../../api/fetch/fetchArrayBasicInfo";
import fetchArrayGenre from "../../../api/fetch/fetchArrayGenre";
import logout from "../../../api/other/logout";
import createAnime from "../../../api/other/createAnime";
import updateAnime from "../../../api/other/updateAnime";


import SessionNav from "../../components/navbar/SessionNav";
import { Link } from "react-router-dom";
import PopupAddAnime from "../../components/popup/addAnime";
import PopupUpdateAnime from "../../components/popup/updateAnime";





function Admin() {

    const navigate = useNavigate();

    const [admin_data, setAdmin_data] = useState({});


    const [table, setTable] = useState({array_of_table:[{username:"brabrabra"}], count_user:1})


    const [logo, setLogo] = useState(false)
    
    // const mockAnime, setMockAnime] = useState([
    //   {title: 'Anime 1', imageUrl: 'https://m.media-amazon.com/images/M/MV5BZGIxYzFlZGYtNTk5Yi00NmNlLTg4NzktMGJhNmFmMmNmM2M2XkEyXkFqcGdeQXVyMjQ0OTA1Nzc@._V1_.jpg' },
    //   {title: 'Anime 2', imageUrl: 'https://www.hobbyfanclub.com/web/board/2017/teeT3MVOHWE1M31201747.jpg' },
    //   {title: 'Anime 3', imageUrl: 'https://f.ptcdn.info/313/074/000/qx0ama2h3p4b60jqUoJq-o.jpg' },
    // ]);

    const [array_basic_data, setArray_basic_data] = useState({
        AnimeTitle: ["anime_title1"],
        image:["base64Image bra bra bra ant mai oak"],
        genre_2d_array:[["genre_specific"]],
        sum_view_array:[0],
        premium_status_array:[0],
        isEnded_array:[0],
        big_image: "base64Image but size bigger", 
        big_title: "anime big title",
        big_genre_1d_array:["big genre"],
        big_description:" ",
        big_rating: 0,
        big_premium_status: " "
    });

    
    const [array_genre, setArray_genre] = useState({
        AnimeGenre: ["genre_name bra bra bra"]
    });

    


    const [f, forceUpdate] = useState();

    axios.defaults.withCredentials = true


    const handleLogout = () => {
        logout()
        forceUpdate(Math.random());
        
    }

    const handleDeleteAnime = async (title) => {
        await deleteAnime(title)

        forceUpdate(Math.random());
    }



    const handleSubmit_create = async (mass_of_anime_data) =>{
        console.log("ดูตรงนี้หน่อย")
        console.log(mass_of_anime_data)
        await createAnime(mass_of_anime_data)
        forceUpdate(Math.random())
        return "str เพื่อให้ then ได้"
    }


    const handleSubmit_update = async (mass_of_anime_data, title) =>{
        console.log(mass_of_anime_data)
        await updateAnime(mass_of_anime_data)
        forceUpdate(Math.random())
        return "str เพื่อให้ then ได้"
    }

    const handleDeleteUser = async (username) =>{

        await deleteUser(username)
        forceUpdate(Math.random())
        console.log("Delete user successfully")
    }
    

    useEffect(() => {
        let isMount = true;
        if (isMount) {


        axios.get('http://localhost:8000/')
        .then(response => {
            console.log(response)

            if(!response.data.username){
            navigate('/')
            }
            else{
            axios.get(`http://localhost:8000/api/admin/?username=${response.data.username}`)
            .then(response => {
                const adminName = response.data.adminName
                if(adminName === "you are not admin"){
                navigate('/')
                }
                else{
                axios.get(`http://localhost:8000/`)
                    .then(response => {
                    axios.get(`http://localhost:8000/api/user_specific_info/?username=${response.data.username}`)
                        .then(user_specific_info =>{
                        console.log(user_specific_info)
                        setAdmin_data(user_specific_info.data);

                        fetchPremiumStatus("just give me only user status")
                            .then(status_obj => {
                                if (status_obj.user_premium_status === true) {
                                    setLogo(true)
                                    console.log(logo,"เป็นค่าไร")
                                }
                            })
                    })
                    })

                    fetchTable()
                        .then(table =>{
                            setTable(table)
                        
                            console.log(table)
                        })

                    fetchArrayBasicInfo()
                        .then(anime =>{
                            setArray_basic_data(anime)
                            console.log(array_basic_data)

                        })

                    fetchArrayGenre()
                        .then(genre => {
                            setArray_genre(genre)
                        })
                }
            })
            }
            
        })
        }
        return () => {
        isMount = false;
        };
    }, [f]);
  
    return (
        <>
        <div className="bg-black">
            
            <SessionNav Logout={handleLogout} User_image={`data:image/jpeg;base64,${admin_data.image}`} logo={logo ? premium_logo:default_logo}/>

            <div className="container mx-auto mt-8">
            <h1 className="text-5xl text-white mb-20 text-center">Welcome <span className="text-amber-500">{admin_data.username}</span> this page is for Admin</h1>
            <h1 className="text-2xl font-bold mb-4 text-white">number of user <span className="text-amber-500">{table.count_user}</span> include admin</h1>
            <table className="min-w-full divide-y divide-gray-700 text-white">
                <thead className="bg-gray-900">
                <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Username
                    </th>
                </tr>
                </thead>
                <tbody className="bg-gray-800 divide-y divide-gray-700">
                {table.array_of_table.map(user => (
                    <tr key={user.username}>
                    <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center justify-between">
                        <div className="ml-4">
                            <div className="text-sm font-medium">
                                {admin_data.username == user.username ? <span className="text-amber-500">{admin_data.username}<span className="text-blue-300"> [Admin]</span></span> : user.username}
                            </div>
                        </div>
                        
                        {admin_data.username != user.username ?
                        <button
                            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                            onClick={() => handleDeleteUser(user.username)}
                            >
                                Delete
                        </button>
                            :
                        <div></div>
                        }
                        </div>
                    </td>
                    </tr>
                ))}
                </tbody>
            </table>
            </div>

            <div className="container mx-auto mt-8">
            <h1 className="text-2xl font-bold mb-4 text-white">Anime List <span className="text-amber-500"></span></h1>

            <div className="grid grid-cols-6 gap-4">
                {array_basic_data.AnimeTitle.map( (title, index) => (
                <div key={title} className="bg-gray-800 rounded-md p-4 flex flex-col justify-between">
                    <img src={`data:image/jpeg;base64,${array_basic_data.image[array_basic_data.AnimeTitle.length - 1 - index]}`} className="w-full h-full object-cover mb-2" />
                    <div className="text-white text-sm font-semibold py-1 mb-2 truncate">{array_basic_data.AnimeTitle[array_basic_data.AnimeTitle.length - 1 - index]}</div>
                    <div className="flex justify-between">
                    <button className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-red-500" onClick={() => handleDeleteAnime(array_basic_data.AnimeTitle[array_basic_data.AnimeTitle.length - 1 - index])}>Delete</button>
                    {/* <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" onClick={() => handleEdit(array_basic_data.AnimeTitle[array_basic_data.AnimeTitle.length - 1 - index])}>ปลอม</button> */}
                    <PopupUpdateAnime
                        onSubmit={handleSubmit_update}
                        genre={array_genre}
                        title={array_basic_data.AnimeTitle[array_basic_data.AnimeTitle.length -1 - index]} />
                    </div>
                </div>
                ))}
                {/* Add button */}
                <div className="bg-gray-800 rounded-md p-4 flex flex-col justify-center items-center">
                <PopupAddAnime onSubmit={handleSubmit_create} genre={array_genre}/>
                {/* <button className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-green-500">Add Anime</button> */}
                </div>
            </div>
            </div>
        </div>

        </>
    );
}

export default Admin;
