import React, { useState } from 'react';
import PropTypes from 'prop-types';

const CommentForm = ( {handleSubmit, submitLabel} ) => {
    
    const [text, setText] = useState("");
    const isTextareaDisabled = text.length === 0;

    const onSubmit = (event) => {
    event.preventDefault();
    if (text.trim()) { 
        handleSubmit(text.trim());
        setText("");
    }
    };

    return (
    <form onSubmit={onSubmit} aria-label="Comment form">
        <textarea
        className="w-full h-20 mb-2 mt-2 border-2 border-black-500 text-black" 
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Write a comment..."
        aria-required="true"
        aria-label="Comment text"
        />
        <button
        className="text-base px-4 py-2 bg-amber-500 rounded-lg text-black hover:bg-amber-600 mb-2 hover:scale-105 cursor-pointer" 
        disabled={isTextareaDisabled}
        type='submit'
        >
        {submitLabel}
        </button>
    </form>
    );
    };

export default CommentForm;
