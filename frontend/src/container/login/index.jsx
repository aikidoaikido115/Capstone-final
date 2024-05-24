import React, { useState, useEffect} from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

import bgImage from '/bg2.jpg';

const Login = () => {
  // State to store input values
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  

  
  axios.defaults.withCredentials = true
  useEffect(() => {
    let isMount = true;
    if (isMount) {


      axios.get('http://localhost:8000/')
      .then(response => {
        console.log(response)
        if(response.data.username){
          navigate('/')
        }
        
      })
    }
    return () => {
      isMount = false;
    };
  }, []);


  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log('Email:', username);
    console.log('Password:', password);

    const obj_send_to_backend = {
      username: username,
      password: password
    }


    const response = await axios.post("http://localhost:8000/api/user/login", obj_send_to_backend)
    

    console.log(response.data.message)

    if(response.data.message === "you are in"){

      console.log("ได้ session แล้ววววว แต่เป็น session ที่มาจาก method POST นะ "+ response.data.session)

      navigate('/')
    }
    else if (response.data.message === "dead wrong"){
      alert("รหัสผิด")
    }
    else if (response.data.message === "do not have this username") {
      alert("ไม่มี username นี้")
    }
    
  };

  return (
    <div className={`flex flex-col items-center justify-center min-h-screen p-8 bg-cover bg-center`} style={{ backgroundImage: `url(${bgImage})` }}>
        <div className="bg-white flex flex-col justify-center items-center py-16 px-10 rounded-2xl">
            <h1 className='text-4xl mb-5 -mt-9 font-serif'>
                Login
            </h1>
            <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Username"
                  className="px-3 py-2 placeholder-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-100 focus:border-blue-300 text-base" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="px-3 py-2 placeholder-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-100 focus:border-blue-300 text-base" />
                <button
                  type="submit"
                  className="w-full px-3 py-2 text-white bg-amber-500 rounded-md hover:bg-amber-600 focus:outline-none"
                >
                    Login
                </button>
            </form>
            <a href="/register" className="text-center w-full px-3 py-2 text-white bg-black rounded-md hover:text-lime-400 focus:outline-none mt-5">
                or create new account
            </a>
        </div>
    </div>
  );
};

export default Login;