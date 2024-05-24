import React from "react";

const SmallCircle = ({src}) => {
  return (
    <>
      <div className="mx-auto w-8 h-8 mr-2 overflow-hidden shadow-sm rounded-full">
        <img src={src} className="w-full h-full object-cover"/>
      </div>
    </>
  );
};

export default SmallCircle;