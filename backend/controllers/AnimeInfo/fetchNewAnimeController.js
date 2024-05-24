const pool = require('../../models/database');
const crypto = require('crypto');
const fs = require('fs');
const axios = require('axios');




module.exports = async (req, res) =>{
    try {


        console.log("set utf8 ละ")



        let get_image_and_title = `SELECT DISTINCT title, big_image FROM anime`
        // await pool.query('SET NAMES utf8mb4');
        const image_and_title = await pool.execute(get_image_and_title)
        // console.log("Retrieved titles:", image_and_title);

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


        //img ที่เอาออกมาเป็น big
        let title_array = []
        let imageBase64_array = []
        let genre_2d_array = [] //array 2 มิติ
        let sum_view_array = []
        let premium_status_array = []
        let isEnded_array = []


        //error แถวๆนี้ใน docker
        for (let i = 0; i < image_and_title[0].length; i++){
            console.log("เข้า loop ครั้งที่", i+1)
            title_array.push(image_and_title[0][i].title)
            console.log("ชื่อเรื่อง", image_and_title[0][i].title)
            const first_anime_id = await pool.execute(get_first_anime_id, [image_and_title[0][i].title])
            // console.log(first_anime_id[0][0].anime_id)
            console.log(`anime_id ครั้งที่ ${i+1} ผ่าน`)
            const genre = await pool.execute(get_genre, [first_anime_id[0][0].anime_id])
            genre_2d_array.push(genre[0].map(element => element.genre_name))
            console.log(`genre ครั้งที่ ${i+1} ผ่าน`)

            const sum_view = await pool.execute(get_sum_view, [image_and_title[0][i].title])
            sum_view_array.push(sum_view[0][0].sum_view)
            console.log(`view ครั้งที่ ${i+1} ผ่าน`)
            //สงสัยจะเป็นที่รูป
            let imageData = image_and_title[0][i].big_image
            imageBase64_array.push(Buffer.from(imageData).toString('base64'))

            console.log(`รูป ครั้งที่ ${i+1} ผ่าน`)

            const premium_status = await pool.execute(get_premium_status, [image_and_title[0][i].title])
            premium_status_array.push(premium_status[0][0].premium_status)
            console.log(`premium ครั้งที่ ${i+1} ผ่าน`)
            const is_ended = await pool.execute(get_isEnded, [image_and_title[0][i].title])
            isEnded_array.push(is_ended[0][0].is_ended)
            console.log(`จบยัง ครั้งที่ ${i+1} ผ่าน`)

        }
        console.log("ออก loop แล้ว")
        console.log(genre_2d_array)

        const responseData = {
            AnimeTitle: title_array,
            image: imageBase64_array,
            genre_2d_array:genre_2d_array,
            sum_view_array:sum_view_array,
            premium_status_array:premium_status_array,
        }

        console.log("Misha คั่นหน้า array new anime big")
        // console.log(responseData)
        // console.log(title_array)

        res.set('Content-Type', 'application/json; charset=utf-8');
        res.json(responseData)
    }
    catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}