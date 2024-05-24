import React, { useState, useEffect} from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Login = () => {

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
    // Handle login logic here
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Log in to your account เอาหน้า login ใหม่ test ใส่ไฟล์ test.jsx ที่ dir นี้</h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="username" className="sr-only">Username</label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="username"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
              />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                จำฉัน
              </label>
            </div>
            <div className="text-sm">
              <a href="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
                Don't have account? register now!
              </a>
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Log in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;