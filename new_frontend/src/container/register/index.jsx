import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';

import bgImage from '/bg2.jpg';

const RegisterPage = () => {
  // State to store input values
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
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

    console.log('Username:', username);
    console.log('Email:', email);
    console.log('Password:', password);

    const obj_send_to_backend = {
      username: username,
      email: email,
      password: password
    }


    
    try{
      const response = await axios.post("http://localhost:8000/api/user/register", obj_send_to_backend)
      
      if (response.data === "User Already exists"){
        alert("username ซ้ำกรุณากรอกใหม่")
      }
      else{
        navigate('/')
      }
    }
    catch (err) {
      console.error("Error: ", err)
    }
    
  };

  return (
    <div className={`flex flex-col items-center justify-center min-h-screen p-8 bg-cover bg-center`} style={{ backgroundImage: `url(${bgImage})` }}>
        <div className="bg-transparent border-2 border-solid border-[rgba(255,255,255,0.2)] shadow-xl backdrop-blur-lg flex flex-col justify-center items-center py-16 px-10 rounded-2xl">
            <h1 className='text-4xl mb-5 -mt-2 text-white'>
                Register
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
                  className="px-3 py-2 placeholder-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-100 focus:border-blue-300 text-base"
                />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address"
                  className="px-3 py-2 placeholder-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-100 focus:border-blue-300 text-base"
                />
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="px-3 py-2 placeholder-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-100 focus:border-blue-300 text-base"
                />
                <button
                  type="submit"
                  className="w-full px-3 py-2 text-black bg-amber-500 rounded-md hover:bg-amber-600 focus:outline-none transition-all duration-300 hover:scale-110 hover:z-10"
                >
                    Create an account
                </button>
            </form>
            <a href="/login" className="text-center text-xs w-full px-3 py-2 text-white bg-black rounded-md hover:text-amber-400 focus:outline-none mt-5 transition-all duration-300 hover:scale-110 hover:z-10">
                Already have an account? Login 
            </a>
        </div>
    </div>
  );
};

export default RegisterPage;
