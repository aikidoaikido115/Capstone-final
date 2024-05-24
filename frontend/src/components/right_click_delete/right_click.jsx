import React, { useState } from 'react';

const RightClickDelete = ({ mouseX, mouseY, handleDelete }) => (
    <div
        className={`absolute z-50 px-4 py-8 bg-black shadow-lg border rounded ${mouseX !== null ? 'block' : 'hidden'}`}
        style={{
            top: mouseY,
            left: mouseX,
            transform: 'translate(-10%, -220%)',
        }}
    >
        <button
            className="bg-red-600 text-white py-1.5 px-4 rounded hover:bg-red-700"
            onClick={handleDelete}
        >
            Delete Watch List
        </button>
    </div>
);

export default RightClickDelete;
