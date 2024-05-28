import React from "react";

const MediumCircle = ({src}) => {
  return (
    <>
      <div className="mx-auto w-14 h-14 mr-2 overflow-hidden shadow-sm rounded-full">
        <img src={src} className="w-full h-full object-cover"/>
      </div>
    </>
  );
};

export default MediumCircle;