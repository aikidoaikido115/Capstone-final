import axios from "axios";


const createAnime = async (obj_send_to_backend) => {

    const API_URL = import.meta.env.VITE_API_URL
    const END_POINT = `/api/admin/createAnime`

    const formData = new FormData();
    for (const [key, value] of Object.entries(obj_send_to_backend)) {
        // console.log(`${key}: ${value}`)
        if (value instanceof FileList) {
            // Handle FileList object
            for (let i = 0; i < value.length; i++) {
                console.log(`${key} - File ${i + 1}: ${value[i].name}`);
                formData.append(key, value[i]);
            }
        } else {
            formData.append(key, value);
        }
    }

    console.log(formData)
    console.log("animeName:", formData.get("title"));
    console.log("animeImage:", formData.get("animeImage"));
    console.log("bigImage:", formData.get("bigImage"));
    console.log("animeFile:", formData.get("animeFile"));

    const option = {
        onUploadProgress: (ProgressEvent) => {
            const {loaded, total} = ProgressEvent
            let percent = (Math.floor(loaded * 100) / total)
            console.log(`loaded ${loaded}kb of ${total}kb | ${percent}%`)


            const progressBar = document.getElementById("progress-bar");
            const progressValue = progressBar.querySelector("progress");
            const progressText = progressBar.querySelector("#progress-text");

            progressBar.classList.remove("hidden")
            progressValue.value = percent;
            progressText.textContent = ` ${percent.toFixed(2)} %`;

            if (percent == 100){
                //ทศนิยม 2 ตำแหน่ง
                const progress = document.getElementById("progressPercent")
                progress.innerHTML = `Saving to database please wait a moment...`
            }
            
        }
    }


    console.log("รันตรง axios นะ")
    let response = await axios.post(API_URL + END_POINT, formData, {

        ...option,
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    
    console.log(response.data)
    // console.log(data.anime_file)

    return response.data
}

export default createAnime;