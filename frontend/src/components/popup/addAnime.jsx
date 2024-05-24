import React, { useEffect, useState } from "react";

const PopupAddAnime = ({ onSubmit, genre }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [animeName, setAnimeName] = useState("");


    const [checkedValue, setCheckedValue] = useState([]);


    const [selectedRadioPremium, setSelectedRadioPremium] = useState("true"); // Initial selection
    const [selectedRadioEnd, setSelectedRadioEnd] = useState("true")

    const [studioName, setStudioName] = useState("");
    const [plot, setPlot] = useState("");
    const [animeImage, setAnimeImage] = useState([]);
    const [bigImage, setBigImage] = useState([]);

    const [rating, setRating] = useState(0);

    const [animeFile, setAnimeFile] = useState([]);

    const [episodeName, setEpisodeName] = useState("");

    const [f, forceUpdate] = useState();



    const handleRadioPremiumChange = (e) => {
        setSelectedRadioPremium(e.target.value);
    };
    const handleRadioEndChange = (e) =>{
        setSelectedRadioEnd(e.target.value)
    }

    const togglePopup = () => {
        setIsOpen(!isOpen);
        setAnimeName("");
        setCheckedValue([])
        setSelectedRadioPremium("true")
        setSelectedRadioEnd("true")
        setStudioName("")
        setPlot("")
        setAnimeImage([])
        setBigImage([])
        setRating(0)
        setAnimeFile([])
        setEpisodeName("")
    };

    const handleSubmit = (e) => {
        e.preventDefault();
 
        const array_of_genre = [...checkedValue]

        const premium_boolean = selectedRadioPremium === "true" ? true : false;
        const isEnded = selectedRadioEnd === "true" ? true : false;
        const episodeNameList = episodeName.split(",")
        const episodeNumberList = episodeNameList.map((element, index) => index + 1)

        // const formData = new FormData();
        // formData.append('title',animeName)
        // formData.append('genre',array_of_genre)
        // formData.append('isPremium',premium_boolean)
        // formData.append('studio',studioName)
        // formData.append('plot',plot)
        // formData.append('animeImage',animeImage)
        // formData.append('rating',rating)
        // formData.append('episodeNameList',episodeNameList)
        // formData.append('episodeNumberList',episodeNumberList)

        const mass_of_anime_data = 
        {
            title:animeName,
            genre:array_of_genre,
            isPremium:premium_boolean,
            isEnded:isEnded,
            studio:studioName,
            plot:plot,
            animeImage:animeImage,
            bigImage:bigImage, 
            rating:rating,
            animeFile:animeFile, 
            episodeNameList:episodeNameList,
            episodeNumberList:episodeNumberList
        }


        // console.log(formData)
        onSubmit(mass_of_anime_data)
            .then(result =>{
                setAnimeName("");
                setIsOpen(false);
                setCheckedValue([]); 
                setSelectedRadioPremium("true")
                setSelectedRadioEnd("true")
                setStudioName("")
                setPlot("")
                setAnimeImage([])
                setBigImage([])
                setRating(0)
                setAnimeFile([])
                setEpisodeName("")
                forceUpdate(Math.random());
                console.log("อซิงโคนัสสำเร็จ ", result)

            })

        
    };
    const handelChange = (event) => {
        const { value, checked } = event.target;
        if (checked) {
        setCheckedValue((pre) => [...pre, value]);
        }
        if (!checked) {
        setCheckedValue((pre) => [...pre.filter((item) => item != value)]);
        }
    };
    const handleChangeImage = (event) =>{
        const files = event.target.files

        if (!files.length) return;

        setAnimeImage(files);

      }

    const handleChangeBigImage = (event) =>{
    const files = event.target.files

    if (!files.length) return;

    setBigImage(files);

    }

    const handleChangeVideo = (event) => {
        const files = event.target.files;

        // Check if any files were selected
        if (!files.length) return;


        setAnimeFile(files)
    }

      useEffect(() =>{
        console.log("re render")
    },[f])

    return (
        <div>
        <button
            onClick={togglePopup}
            className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
        >
            Add Anime
        </button>
        {isOpen && (
            <div className="fixed z-50 inset-0 flex items-center justify-center backdrop-filter backdrop-blur-lg">
            <div className="absolute inset-0 bg-black opacity-25"></div>
            <div className="z-50 relative bg-white p-8 rounded-lg shadow-lg w-1/3">
            <button
            onClick={togglePopup} // Add click handler to toggle popup
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
                <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
                >
                <path
                    fillRule="evenodd"
                    d="M13.414 10l3.293 3.293a1 1 0 01-1.414 1.414L12 11.414l-3.293 3.293a1 1 0 01-1.414-1.414L10.586 10 7.293 6.707a1 1 0 111.414-1.414L12 8.586l3.293-3.293a1 1 0 111.414 1.414L13.414 10z"
                    clipRule="evenodd"
                />
                </svg>
            </button>
                <form onSubmit={handleSubmit} encType="multipart/form-data" className="overflow-y-auto max-h-96 max-w-2xl">
                <label>
                    <span className="text-base text-blue-500">Anima title</span>
                    <input
                        className="w-full text-black border border-gray-300 rounded-md px-3 py-2 mb-4 focus:outline-none focus:border-blue-500"
                        type="text"
                        value={animeName}
                        onChange={(e) => setAnimeName(e.target.value)}
                        placeholder="Ex. Attack on titan"
                        required
                        />
                </label>
                <div>
                    <h1 className="text-base text-blue-500">Select genre</h1>
                    {genre.AnimeGenre.map((item) => (
                    <label key={item} className="flex items-center mb-1">
                        <input
                        type="checkbox"
                        value={item}
                        onChange={handelChange}
                        className="form-checkbox h-4 w-4 text-green-400"
                        />
                        <span className="ml-2 text-base text-gray-700">{item}</span>
                    </label>
                    ))}
                    {/* <h3>test {checkedValue}</h3> */}
                </div>
                <div className="flex flex-col mb-1">
                    <h1 className="text-base text-blue-500 mb-0.5">Content type</h1>
                    <label className="flex items-center mb-0.5 gap-1">
                    <input
                        type="radio"
                        value="true"
                        checked={selectedRadioPremium === "true"}
                        onChange={handleRadioPremiumChange}
                        className="form-checkbox h-4 w-4"
                        required
                    />
                    Premium
                    </label>
                    <label className="flex items-center mb-0.5 gap-1">
                    <input
                        type="radio"
                        value="false"
                        checked={selectedRadioPremium === "false"}
                        onChange={handleRadioPremiumChange}
                        className="form-checkbox h-4 w-4"
                    />
                    Free
                    </label>
                </div>
                {/* <p>Selected option: {selectedRadioPremium}</p> */}
                <label>
                    <span className="text-base text-blue-500">Studio name</span>
                    <input
                        className="w-full text-black border border-gray-300 rounded-md px-3 py-2 mb-4 focus:outline-none focus:border-blue-500"
                        type="text"
                        value={studioName}
                        onChange={(e) => setStudioName(e.target.value)}
                        placeholder="Anime studio"
                        required
                        />
                </label> 

                <label>
                    <span className="text-base text-blue-500">Plot</span>
                    <textarea
                    className="w-full text-black border border-gray-300 rounded-md px-3 py-2 mb-4 focus:outline-none focus:border-blue-500"
                    value={plot}
                    onChange={(e) => setPlot(e.target.value)}
                    required
                    placeholder="About this anime in a nutshell"
                    />
                </label>
                <label className="flex flex-col mb-5 gap-1">
                    <span className="text-base text-blue-500">Upload anime image</span>
                    <input
                    type="file"
                    accept="image/*"
                    onChange={handleChangeImage}
                    required
                    />
                </label>
                <label className="flex flex-col mb-5 gap-1">
                    <span className="text-base text-blue-500">Upload anime big image</span>
                    <input
                    type="file"
                    accept="image/*"
                    onChange={handleChangeBigImage}
                    required
                    />
                </label>
                <label>
                    <span className="text-base text-blue-500">Rating</span>
                    <input
                        className="w-full text-black border border-gray-300 rounded-md px-3 py-2 mb-4 focus:outline-none focus:border-blue-500"
                        type="number"
                        value={rating}
                        onChange={(e) => setRating(e.target.value)}
                        placeholder="input only decimal"
                        required
                        />
                </label>

                <label className="flex flex-col gap-1">
                    <div className="flex flex-col mb-5 gap-1">
                        <span className="text-base text-blue-500">Upload anime file</span>
                        <div className="flex flex-col items-start gap-4">
                            <input
                            type="file"
                            accept="video/mp4"
                            onChange={handleChangeVideo}
                            multiple
                            required
                            />
                            {/* <button
                            type="button"
                            onClick={handleAddVideoInput}
                            className="ml-0 bg-green-500 text-white font-semibold py-1 px-3 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                            >
                            เพิ่มตอนอีก
                            </button> */}
                        </div>
                    </div>
                </label>
                <div className="flex flex-col mb-1">
                    <h1 className="text-base text-blue-500 mb-0.5">Is it complete yet?</h1>
                    <label className="flex items-center mb-0.5 gap-1">
                    <input
                        type="radio"
                        value="true"
                        checked={selectedRadioEnd === "true"}
                        onChange={handleRadioEndChange}
                        className="form-checkbox h-4 w-4"
                        required
                    />
                    True
                    </label>
                    <label className="flex items-center mb-0.5 gap-1">
                    <input
                        type="radio"
                        value="false"
                        checked={selectedRadioEnd === "false"}
                        onChange={handleRadioEndChange}
                        className="form-checkbox h-4 w-4"
                    />
                    False
                    </label>
                </div>
                {/* <p>Selected option: {selectedRadioEnd}</p> */}

                <label>
                    <div className="mb-3">
                        <span className="text-base text-blue-500">Episode name <br />
                        <span className="text-base text-red-500">(Use , to separate the episode names in case of adding multiple chapter files.)</span></span>
                        <input
                            className="w-full text-black border border-gray-300 rounded-md px-3 py-2 mb-4 focus:outline-none focus:border-blue-500"
                            type="text"
                            value={episodeName}
                            onChange={(e) => setEpisodeName(e.target.value)}
                            placeholder="Ex. The end of and era part1, The end of and era part2"
                            required
                            />
                        </div>
                </label> 

                <div id="progress-bar" className="hidden">
                    <progress value="0" max="100"></progress>
                    <span id="progress-text">0%</span>
                </div>

                <div id="progressPercent" className="text-base text-green-600 mb-7"></div>
                
                <div className="flex justify-between">
                    <button
                        className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        onClick={togglePopup}
                    >
                        Cancel
                    </button>
                    <button
                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        type="submit"
                    >
                        Add
                    </button>
                    
                </div>
                </form>
            </div>
            </div>
        )}
        </div>
    );
    };

export default PopupAddAnime;
