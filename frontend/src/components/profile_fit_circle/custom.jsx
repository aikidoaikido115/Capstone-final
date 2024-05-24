import React from "react";

const Circle = ({src,w="w-8",h="h-8"}) => {
  return (
    <>
      <div className={`border-2 border-white mx-auto ${w} ${h} overflow-hidden shadow-sm rounded-full`}>
        <img src={src} className="w-full h-full object-cover"/>
      </div>
    </>
  );
};

export default Circle;