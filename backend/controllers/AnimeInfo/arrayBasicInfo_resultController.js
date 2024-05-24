

const pool = require('../../models/database');
// const crypto = require('crypto');
const fs = require('fs');
// const axios = require('axios');

module.exports = async (req, res) =>{
    try {

        let title = req.query.q


        title = `%${title}%`



        let get_image_and_title = `SELECT DISTINCT title, anime_image FROM anime WHERE title LIKE ?`
        const image_and_title = await pool.execute(get_image_and_title, [title])



        let get_first_anime_id = `SELECT anime_id FROM anime WHERE title = ? LIMIT 1`
        let get_genre = `SELECT genre_name FROM genre WHERE genre_id IN (
            SELECT genre_id FROM anime_genre WHERE anime_id = ?
        )`

        let get_sum_view = `SELECT sum_view FROM anime WHERE title = ? LIMIT 1`

        let get_premium_status = `SELECT premium_status FROM anime WHERE title = ? LIMIT 1`

        let get_isEnded = `SELECT is_ended FROM anime WHERE title = ? LIMIT 1`


        


        console.log("ตรงนี้")
        console.log(image_and_title)

        // const imageData = data[0][0].anime_image
        // const imageBase64 = Buffer.from(imageData).toString('base64');

        let title_array = []
        let imageBase64_array = []
        let genre_2d_array = [] //array 2 มิติ
        let sum_view_array = []
        let premium_status_array = []
        let isEnded_array = []
       
        for (let i = 0; i < image_and_title[0].length; i++){
            title_array.push(image_and_title[0][i].title)
            // console.log("ผิดปกติไหม",title_array)
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



        const responseData = {
            AnimeTitle: title_array,
            image: imageBase64_array,
            genre_2d_array:genre_2d_array,
            sum_view_array:sum_view_array,
            premium_status_array:premium_status_array,
            isEnded_array:isEnded_array,

        }

        console.log("Misha คั่นหน้า search_result")
        // console.log(responseData)

        res.json(responseData)
    }
    catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}