import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import CommentForm from "./CommentForm";
import MediumCircle from '../profile_fit_circle/medium';

// import { format, parse } from 'date-fns';

const Comment = ({
    image,
    text,
    username,
    date,
    user_data,
    handleDelete
}) => {

    const [f, forceUpdate] = useState();

    function formatDate(dateString) {
        const [datePart, timePart] = dateString.split('T');
        const [year, month, day] = datePart.split('-');
        console.log(year, month, day)
        // const [hours, minutes, seconds] = timePart.split(/:|\./);
        let [hours, minutes, seconds] = timePart.split(':')
        seconds = seconds.split('.')[0]

        // return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
        return `${datePart} ${hours}:${minutes}:${seconds}`
    }


    // const handleDelete = () => {
    //     deleteComment()
    //         .then(result => {
    //             forceUpdate(Math.random());
    //         })
    // }


    // useEffect(() => {
    //     //
    // }, [f]);



    return (
    <div className="flex mb-7">
        <div className="mr-3"> 
        {/* <img src={`data:image/jpeg;base64,${image}`} alt="User Icon" className="rounded-full " /> */}
        <MediumCircle src={`data:image/jpeg;base64,${image}`}/>
        </div>
        <div className="w-full"> 
            <div className="flex items-center"> 
                <div className="mr-2 text-xl text-amber-500">{username}</div> 
                <div className='text-white'>{formatDate(date)}</div>
            </div>
            <div className="text-lg text-white">{text}</div>
            {username === user_data.username ? 
                <div
                  className="inline-block text-sm text-slate-400 cursor-pointer mt-2 underline"
                  onClick={handleDelete}
                >
                    Delete
                </div>
                :
                <div
                  className="inline-block text-sm text-slate-400 mt-2"
                >
                    {" "}
                </div>
            }
        </div>
    </div>
    );
    };

export default Comment;