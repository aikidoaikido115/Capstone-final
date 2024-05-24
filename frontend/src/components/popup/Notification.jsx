import React from 'react';

const Notification = ({ message, onOk, color_button, color_hover_button}) => {
    return (
      <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center z-50">
        <div className="absolute inset-0 backdrop-filter backdrop-blur-lg bg-black bg-opacity-25"></div>
            <div className="bg-white p-6 rounded shadow-md relative z-10 flex flex-col items-center w-1/3">
            <p className="text-lg text-black">{message}</p>
            <button
                onClick={onOk}
                className={`mt-4 px-4 py-2 ${color_button} text-white rounded hover:${color_hover_button} focus:outline-none focus:${color_hover_button}`}
            >
                OK
            </button>
            </div>
      </div>
    );
  };

export default Notification;