import { useEffect, useState } from "react";


import WatchAnime from './container/watch-anime/index.jsx'
// import NewWatchAnime from './container/watch-anime/new_index.jsx'
import Home from './container/home/index.jsx'
import Category from "./container/category/index.jsx";
import Login from './container/login/index.jsx'
import TestLogin from "./container/login/สำรอง.jsx";
import Register from './container/register/index.jsx'
import PremiumPage from "./container/premium/index.jsx";
import PremiumPageTest from "./container/premium/สำรอง.jsx";
import Admin from './container/admin/index.jsx'
import Test from "./container/Test/index.jsx";
import SearchResult from "./container/search-result/index.jsx";
import UserProfile from "./container/user-profile/index.jsx";
import ToWatchList from "./container/to_watch_list/index.jsx";


import {createBrowserRouter,
  RouterProvider,
  Route,
  Navigate
} from 'react-router-dom'


const router = createBrowserRouter([
  {
    path: '/',
    element: <Home/>
  },
  {
    path: '/category',
    element: <Category/>
  },
  {
    path: '/search_result',
    element: <SearchResult/>
  },
  {
    path: '/user_profile',
    element: <UserProfile/>
  },
  {
    path: '/watch/:anime_title/:episode_number',
    element: <WatchAnime/>
  },
  {
    path: '/watch_list',
    element: <ToWatchList/>
  },
//   {
//     path: '/new_watch/:anime_title/:episode_number',
//     element: <NewWatchAnime/>
//   },
  {
    path: '/login',
    element: <Login/>
  },
  {
    path: '/register',
    element: <Register/>
  },
  {
    path:'/admin',
    element:<Admin/>
  },
  {
    path:'/premium',
    element:<PremiumPage/>
  }
//   {
//     path:'/premium_test',
//     element:<PremiumPageTest/>
//   },
//  {
//    path:'/test',
//    element:<Test/>
//  }
//
])

function App() {


  return (
    <RouterProvider router={router} />
  );
}

export default App;
