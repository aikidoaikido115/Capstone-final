import axios from "axios";


const updateUserProfile = async (obj_send_to_backend) => {

    const API_URL = import.meta.env.VITE_API_URL
    const END_POINT = `/api/user/update_user_profile`

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
    console.log("image:", formData.get("image"));
    console.log("email:", formData.get("email"));
    console.log("password:", formData.get("password"));
    console.log("confirm_password:", formData.get("confirm_password"));


    let response = await axios.put(API_URL + END_POINT, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    
    console.log(response.data)
    // console.log(data.anime_file)

    return response.data
}

export default updateUserProfile;