const pool = require('../../models/database');
const crypto = require('crypto');
const fs = require('fs');
const axios = require('axios');




module.exports = async (req, res) =>{
    try {
        let get_big_info = `SELECT DISTINCT big_image, title, sum_view, premium_status FROM anime WHERE big_image IS NOT NULL AND title = ?`

        let get_big_first_anime_id = `SELECT anime_id FROM anime WHERE big_image IS NOT NULL AND title = ? LIMIT 1`
        let get_big_genre = `SELECT genre_name FROM genre WHERE genre_id IN (
            SELECT genre_id FROM anime_genre WHERE anime_id = ?
        )`

  
        let username = req.session.user
        if (username === undefined){
            username = "Guest login"
        }

        const pred_title = await axios.get(`http://localhost:8000/api/ml/?username=${username}`)
        console.log(pred_title.data, "จากหน้า home นะ")


        let big_title
        if (pred_title.data === "Guest login"){
            big_title = "can not pred anime guest login or less than 3 anime watched"
        }
        else if (pred_title.data === `${username} ดูอนิเมะยังไม่ครบ 3 เรื่องจึงยังไม่แนะนำอนิเมะเรื่องถัดไปและทำการสุ่มไปก่อน`) {
            big_title = "can not pred anime guest login or less than 3 anime watched"
            console.log(big_title)
        }
        else {
            big_title = pred_title.data
        }

        if (big_title === "can not pred anime guest login or less than 3 anime watched") {
            const responseData = {
                big_image:"bra bra bra",
                big_title:big_title,
                big_genre_1d_array:["genreeeee"],
                big_view:0,
                big_premium_status:0
            }

            console.log("Misha คั่นหน้า AI จุดที่ 2 ผลลัพธ์ไม่ pred")
            res.set('Content-Type', 'application/json; charset=utf-8');
            res.json(responseData)
        }
        else {
            let big_info = await pool.execute(get_big_info, [big_title])
            // let big_info = await pool.execute(get_big_info, ["Date A Live ss1"])
            let bigImageBase64 = Buffer.from(big_info[0][0].big_image).toString('base64')
    
            const big_first_anime_id = await pool.execute(get_big_first_anime_id, [big_title])
            const big_genre = await pool.execute(get_big_genre, [big_first_anime_id[0][0].anime_id])
            let big_genre_1d_array = big_genre[0].map(element => element.genre_name)
            // big_genre_1d_array.push(big_genre[0].map(element => element.genre_name))
    
    
            const responseData = {
                big_image:bigImageBase64,
                big_title:big_info[0][0].title,
                big_genre_1d_array:big_genre_1d_array,
                big_view:big_info[0][0].sum_view,
                big_premium_status:big_info[0][0].premium_status
            }
    
            console.log("Misha คั่นหน้า AI จุดที่ 2")
            // console.log(responseData)
    
            res.set('Content-Type', 'application/json; charset=utf-8');
            res.json(responseData)
        }
    }
    catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}