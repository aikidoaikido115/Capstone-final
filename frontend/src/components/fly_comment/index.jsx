import React, { useState, useEffect } from "react";
import fetchDanmaku from '../../../api/fetch/fetchDanmaku';

// Component for Danmaku
const Danmaku = ({ anime_title, episode_number, timeStamp }) => {
    const topPositions = ["1", "20", "28", "36"];
    // let topClasses = ["top-3", "top-20", "top-28", "top-36"];
    const [topClasses, setTopClasses] = useState(["top-1", "top-20", "top-28", "top-36"])
    // let temp = ["top-3", "top-20", "top-28", "top-36"];
    const [randomTop, setRandomTop] = useState('');
    const [count, setCount] = useState(0);

    const [danmaku_data, setDanmaku_data] = useState({
        text_array: ["bra bra bra"],
        episode_time_stamp_array: ["25:25:25"]
    });

    //เปลี่ยนเป็น array แทน
    const [oneDanmaku, setOneDanmaku] = useState("");
    const [arrayDanmaku, setArrayDanmaku] = useState([])
    const [isDanmaku, setIsDanmaku] = useState(false);


    //ตัว spawn danmaku
    const generateDanmaku = (count,text) => {
        const randomIndex = Math.floor(Math.random() * topPositions.length);
        const randomClass = topClasses[randomIndex];
        if (topClasses.length > 0) {
            setTopClasses(prevArr => [
                ...prevArr.filter(element => element !== randomClass)
            ]);
        }
        else {
            setTopClasses(["top-3", "top-20", "top-28", "top-36"])
        }
        setRandomTop(topPositions[randomIndex]);
        console.log("สุ่ม", topPositions[randomIndex]);
        return (
            <div key={count} className={`danmakuWrapper z-50 w-fit whitespace-nowrap clear-both animate-danmaku truncate absolute right-0 ${randomClass}`}>
                <div className="danmakuItemWrapper inline-block p-2.5 rounded-[23px] mr-10">
                <div className="innerWrapper flex justify-center items-center">
                    <div className="content ml-2 text-center text-2xl font-bold text-amber-500 max-w-full overflow-hidden text-ellipsis">
                    {text}
                    </div>
                </div>
                </div>
            </div>
        );
    }

    //เอาค่ามาเปรียบเทียบเพื่อหยุดการ spawn ซ้ำ
    const extractDanmakuValues = (arrayDanmaku) => {
        return arrayDanmaku.map(element => {
          // Locate the child element containing the text
          const innerWrapper = element.props.children.props.children;
          const contentDiv = innerWrapper.props.children;
          const danmakuText = contentDiv.props.children;
          return danmakuText;
        });
      };

    // Set random top position on mount
    useEffect(() => {
        // Fetch danmaku data
        fetchDanmaku(anime_title, episode_number)
            .then(data => {
                console.log("danmaku มาแล้วแต่ยังไม่เข้า ตัวแปร", data);
                setDanmaku_data(data);
                console.log("danmaku", data); // log the fetched data directly
            })
            .catch(error => {
                console.error("Error fetching danmaku:", error);
            });
    }, [anime_title, episode_number]);

    // Interval to check timeStamps
    useEffect(() => {
        const intervalId = setInterval(() => {
            const currentSecond = parseInt(timeStamp.split(":")[2], 10);

            for (let i = 0; i < danmaku_data.episode_time_stamp_array.length; i++) {
                const episodeTime = danmaku_data.episode_time_stamp_array[i];
                const episodeSecond = parseInt(episodeTime.split(":")[2], 10);

                // Create an array of seconds to compare
                const flexibleSeconds = [
                    episodeSecond,
                    episodeSecond + 1,
                    episodeSecond + 2,
                    episodeSecond - 1,
                    episodeSecond - 2
                ].map(sec => sec.toString().padStart(2, '0'));

                const episodeBaseTime = episodeTime.split(":").slice(0, 2).join(":");
                const fullTimeStamps = flexibleSeconds.map(sec => `${episodeBaseTime}:${sec}`);

                // console.log(fullTimeStamps, timeStamp);

                // console.log("ดูตรงนี้ว่าเป็นค่าไร",arrayDanmaku)
                if (fullTimeStamps.includes(timeStamp)) {
                    // console.log("ข้อความลอยจะมา");
                    setIsDanmaku(true);
                    setOneDanmaku(danmaku_data.text_array[i]);
                    
                    //ข้อความซ้ำที่เกิดจาก array และที่พิมพ์ซ้ำกันจะไม่ถูกแสดง
                    const danmakuValues = extractDanmakuValues(arrayDanmaku);//ตัวนี้เป็น array

                    if (!danmakuValues.includes(danmaku_data.text_array[i])) {
                        setArrayDanmaku((prevDanmakus) => [
                            ...prevDanmakus,
                            generateDanmaku(count, danmaku_data.text_array[i])
                        ]);
                        setCount((prevCount) => prevCount + 1);
    
                        break; // Exit loop if match found
                    }
                    
                } else {
                    setIsDanmaku(false);
                    // setOneDanmaku("");
                    // setArrayDanmaku([])
                }
            }
        }, 1000);

        return () => clearInterval(intervalId);
    }, [danmaku_data, timeStamp]);

    return (
        <>
            {/* {isDanmaku && (
                <div className={`danmakuWrapper z-50 w-fit whitespace-nowrap clear-both animate-danmaku truncate absolute right-0 top-${randomTop}`}>
                    <div className="danmakuItemWrapper inline-block p-2.5 rounded-[23px] mr-10">
                        <div className="innerWrapper flex justify-center items-center">
                            <div className="content ml-2 text-center text-2xl font-bold text-amber-500 max-w-full overflow-hidden text-ellipsis">
                                {oneDanmaku}
                            </div>
                        </div>
                    </div>
                </div>
            )} */}
            {arrayDanmaku}
        </>
    );
};

export default Danmaku;
