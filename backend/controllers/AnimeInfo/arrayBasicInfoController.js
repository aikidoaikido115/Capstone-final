const pool = require('../../models/database');
const crypto = require('crypto');
const fs = require('fs');
const axios = require('axios');




module.exports = async (req, res) =>{
    try {


        console.log("set utf8 ละ")



        let get_image_and_title = `SELECT DISTINCT title, anime_image FROM anime`

        const image_and_title = await pool.execute(get_image_and_title)
        console.log("คั่น1-------------------------------------")
        console.log("Retrieved titles:", image_and_title);
        console.log("คั่น2-------------------------------------")


        //โซนเต็มจอ
        let get_big_info = `SELECT DISTINCT big_image, title, description, average_rating, premium_status FROM anime WHERE big_image IS NOT NULL AND title = ?`

        let get_big_first_anime_id = `SELECT anime_id FROM anime WHERE big_image IS NOT NULL AND title = ? LIMIT 1`
        let get_big_genre = `SELECT genre_name FROM genre WHERE genre_id IN (
            SELECT genre_id FROM anime_genre WHERE anime_id = ?
        )`
        //สิ้นสุดโซนเต็มจอ

        let get_first_anime_id = `SELECT anime_id FROM anime WHERE title = ? LIMIT 1`
        let get_genre = `SELECT genre_name FROM genre WHERE genre_id IN (
            SELECT genre_id FROM anime_genre WHERE anime_id = ?
        )`

        let get_sum_view = `SELECT sum_view FROM anime WHERE title = ? LIMIT 1`

        let get_premium_status = `SELECT premium_status FROM anime WHERE title = ? LIMIT 1`

        let get_isEnded = `SELECT is_ended FROM anime WHERE title = ? LIMIT 1`


        


        console.log("ตรงนี้")
        console.log(image_and_title)

        

        let title_array = []
        let imageBase64_array = []
        let genre_2d_array = [] //array 2 มิติ
        let sum_view_array = []
        let premium_status_array = []
        let isEnded_array = []
        // let big_genre_1d_array = []

        const randomIndex = crypto.randomInt(0, image_and_title[0].length); // Generate a random index within the range
        const randomTitle = image_and_title[0][randomIndex]; // Get the title at the random index


        let username = req.session.user
        if (username === undefined){
            username = "Guest login"
        }

        const pred_title = await axios.get(`http://localhost:8000/api/ml/?username=${username}`)
        console.log(pred_title.data, "จากหน้า home นะ")


        let big_title
        if (pred_title.data === "Guest login"){
            big_title = randomTitle.title
        }
        else if (pred_title.data === `${username} ดูอนิเมะยังไม่ครบ 2 เรื่องจึงยังไม่แนะนำอนิเมะเรื่องถัดไปและทำการสุ่มไปก่อน`) {
            big_title = randomTitle.title
            console.log(big_title)
        }
        else {
            big_title = pred_title.data
        }

        let big_info = await pool.execute(get_big_info, [big_title])

        let bigImageBase64 = Buffer.from(big_info[0][0].big_image).toString('base64')

        const big_first_anime_id = await pool.execute(get_big_first_anime_id, [big_title])
        const big_genre = await pool.execute(get_big_genre, [big_first_anime_id[0][0].anime_id])
        let big_genre_1d_array = big_genre[0].map(element => element.genre_name)




        for (let i = 0; i < image_and_title[0].length; i++){
            title_array.push(image_and_title[0][i].title)
            const first_anime_id = await pool.execute(get_first_anime_id, [image_and_title[0][i].title])
            // console.log(first_anime_id[0][0].anime_id)
            const genre = await pool.execute(get_genre, [first_anime_id[0][0].anime_id])
            genre_2d_array.push(genre[0].map(element => element.genre_name))

            const sum_view = await pool.execute(get_sum_view, [image_and_title[0][i].title])
            sum_view_array.push(sum_view[0][0].sum_view)

            let imageData = image_and_title[0][i].anime_image
            imageBase64_array.push(Buffer.from(imageData).toString('base64'))

            const premium_status = await pool.execute(get_premium_status, [image_and_title[0][i].title])
            premium_status_array.push(premium_status[0][0].premium_status)
            const is_ended = await pool.execute(get_isEnded, [image_and_title[0][i].title])
            isEnded_array.push(is_ended[0][0].is_ended)

        }
        console.log("ออก loop แล้ว")
        console.log(genre_2d_array)

        // console.log(title_array)
        // console.log(imageBase64_array)

        const responseData = {
            AnimeTitle: title_array,
            image: imageBase64_array,
            genre_2d_array:genre_2d_array,
            sum_view_array:sum_view_array,
            premium_status_array:premium_status_array,
            isEnded_array:isEnded_array,
            big_image:bigImageBase64,
            big_title:big_info[0][0].title,
            big_genre_1d_array:big_genre_1d_array,
            big_description:big_info[0][0].description,
            big_rating:big_info[0][0].average_rating,
            big_premium_status:big_info[0][0].premium_status
        }

        console.log("Misha คั่นหน้า array basic_info")
        // console.log(responseData)
        console.log(title_array)

        res.set('Content-Type', 'application/json; charset=utf-8');
        res.json(responseData)
    }
    catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}