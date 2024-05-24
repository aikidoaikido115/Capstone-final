import React, { useState, useRef, useEffect } from "react";
import {
  FaPlayCircle,
  FaPauseCircle,
  FaExpand,
  FaTachometerAlt,
  FaVolumeMute,
  FaVolumeUp,
} from "react-icons/fa";
import { GrChapterPrevious, GrChapterNext } from "react-icons/gr";

import Danmaku from "../../components/fly_comment/index";
import video from "./Test.mp4";
import spyroom from "./spy classroom ss1 ep1.mp4";

function VideoPlayer({src, onCurrentTimeChange}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);  
  const [showSpeedOptions, setShowSpeedOptions] = useState(false);
  const [showVolume, setShowVolume] = useState(false);
  const videoRef = useRef(null);
  const progressBarRef = useRef(null);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (videoElement) {
      videoElement.volume = volume;
      videoElement.playbackRate = playbackRate;
      setDuration(videoElement.duration);
      videoElement.onloadedmetadata = () => {
        setDuration(videoElement.duration);
      };
    }
  }, [volume, playbackRate]);

  useEffect(() => {
    onCurrentTimeChange(currentTime); // Send current time to parent
  }, [currentTime, onCurrentTimeChange]);

  const togglePlay = () => {
    const videoElement = videoRef.current;
    if (videoElement) {
      if (isPlaying) {
        videoElement.pause();
      } else {
        videoElement.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVolumeChange = (e) => {
    setVolume(e.target.value);
  };

  const toggleVolume = () => {
    setShowVolume(!showVolume);
  };

  const handleProgressChange = (e) => {
    const videoElement = videoRef.current;
    if (videoElement) {
      videoElement.currentTime = e.target.value;
      setCurrentTime(e.target.value);
    }
  };

  const updateCurrentTime = () => {
    const videoElement = videoRef.current;
    if (videoElement) {
      setCurrentTime(videoElement.currentTime);
    }
  };

  const skipTime = (time) => {
    const videoElement = videoRef.current;
    if (videoElement) {
      videoElement.currentTime += time;
      setCurrentTime(videoElement.currentTime);
    }
  };

  const toggleFullScreen = () => {
    const container = videoRef.current.closest(".video-container");
    if (container) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        container.requestFullscreen().catch((err) => {
          console.error(
            `Error attempting to enable full-screen mode: ${err.message} (${err.name})`
          );
        });
      }
    }
  };

  const handleSpeedChange = (newSpeed) => {
    setPlaybackRate(newSpeed);
    setShowSpeedOptions(false);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };


  return (
    <div className="video-container bg-black relative">
        {/* <p className="abosute top-10 text-red-500 text-xl z-50">{new Date(currentTime * 1000).toISOString().substr(11, 8)}</p> */}
        <div className="relative">
        
        <video
            ref={videoRef}
            className="w-full h-full bg-black"
            onClick={togglePlay}
            onTimeUpdate={updateCurrentTime}
            onLoadStart={() => setCurrentTime(0)}
        >
            <source src={src} type="video/mp4" />
            Your browser does not support the video tag.
        </video>

        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-opacity-50 bg-black flex items-center justify-between p-2">
        
        {/* Not finish = Full Progress Bar
        <div className="absolute top-0 left-0 right-0 h-1 bg-gray-200">
            <div
            ref={progressBarRef}
            className="h-1 bg-red-500"
            style={{ width: `${(currentTime / duration) * 100}%` }}
            />
        </div>
        */}

        <button onClick={() => skipTime(-15)} className="text-white ml-2 mr-2">
            <GrChapterPrevious size="20" />
        </button>
        <button onClick={togglePlay} className="text-white">
            {isPlaying ? <FaPauseCircle size="20" /> : <FaPlayCircle size="20" />}
        </button>
        <button onClick={() => skipTime(15)} className="text-white ml-2 mr-2">
            <GrChapterNext size="20" />
        </button>
        <button onClick={toggleVolume} className="text-white ml-4 mr-4 relative">
    {volume > 0 ? <FaVolumeUp size="20" /> : <FaVolumeMute size="20" />}
    {showVolume && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2" style={{ marginBottom: '8px' }}>
        <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            className="w-24"
            style={{ transform: 'rotate(-90deg) translateX(34%)'}}
        />
        </div>
    )}
    </button>
        <div className="text-xs">
            <span className="text-white">{formatTime(currentTime)}</span> /{" "}
            <span className="text-gray-400">{formatTime(duration)}</span>
        </div>
        <input
            type="range"
            min="0"
            max={videoRef.current?.duration || 100}
            value={currentTime}
            onChange={handleProgressChange}
            className="range range-xs flex-grow mx-2"
        />
        <button
            onClick={() => setShowSpeedOptions(!showSpeedOptions)}
            className="text-white mr-3"
        >
            <FaTachometerAlt size="20" />
        </button>
        {showSpeedOptions && (
            <div className="absolute right-7 bottom-0 mb-9 bg-black p-1">
            {[0.5, 1, 1.5, 2].map((speed) => (
                <button
                key={speed}
                onClick={() => handleSpeedChange(speed)}
                className="block text-white p-1 hover:bg-gray-700"
                >
                {speed}x
                </button>
            ))}
            </div>
        )}
        <button onClick={toggleFullScreen} className="text-white">
            <FaExpand size="20" />
        </button>
        </div>
        {/* <p>Current Time: {currentTime}</p>
        <p>Current Time H:M:S {new Date(currentTime * 1000).toISOString().substr(11, 8)}</p> */}
    </div>
  );
}

export default VideoPlayer;
