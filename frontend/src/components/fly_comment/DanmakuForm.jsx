import React, { useState } from 'react';

import fetchUserInfo from "../../../api/fetch/fetchUserInfo"
import { useParams, useNavigate, Link} from 'react-router-dom';
import fetchEpisodeNumber from "../../../api/fetch/fetchEpisodeNumber";
import createFlyComment from '../../../api/other/createFlyComment';

const DanmakuForm = ( {user_data, anime_title, episode_number, timeStamp} ) => {

    const [text, setText] = useState("");

    const [f, forceUpdate] = useState();

    const navigate = useNavigate();


    const onSubmit = (event) => {
        event.preventDefault();

        if (user_data.username === "Guest login"){
            navigate("/login")
        }
        else{
            const obj_send_to_backend = {
                text:text.trim(),
                username:user_data.username,
                time_stamp:timeStamp,
                episode_number:episode_number,
                anime_title:anime_title
            }
            // console.log(obj_send_to_backend)
            createFlyComment(obj_send_to_backend)
            setText("");
        }
    };



    return (
        <form onSubmit={onSubmit} aria-label="Comment form" className='flex flex-row gap-4 w-full'>
        <input
            className="w-full px-3 h-10 border-2 border-black-500 text-black rounded-full" 
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Let your text floating"
            aria-required="true"
            aria-label="Comment text"
        />
        <button
            className="text-base px-4 1py-1 bg-amber-500 rounded-full text-black hover:bg-amber-600 hover:scale-105"
            type='submit'
        >
            Send
        </button>
        </form>
    );
};

export default DanmakuForm;
