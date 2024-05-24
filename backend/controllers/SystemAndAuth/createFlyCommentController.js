const pool = require('../../models/database');

module.exports = async (req, res) =>{


    const FlyComment = req.body
    console.log(FlyComment)

    try {

        let user_id = await pool.execute('SELECT user_id FROM user WHERE username = ?', [FlyComment.username])
        user_id = user_id[0][0].user_id
        console.log("username ผ่าน")

        let anime_id = await pool.execute('SELECT anime_id FROM anime WHERE title = ? LIMIT 1', [FlyComment.anime_title])
        anime_id = anime_id[0][0].anime_id

        console.log("anime_id ผ่าน")

        let get_episode_id = 'SELECT episode_id FROM episode WHERE anime_id = ? AND episode_number = ?'

        let episode_id = await pool.execute(get_episode_id, [anime_id, FlyComment.episode_number])
        episode_id = episode_id[0][0].episode_id
        console.log("ตอนนี้ id คือ", episode_id)

        console.log("episode_id ผ่าน")


        //ทำให้ timstamp ไม่มั่วก่อน
        let insert_fly_comment =
        `INSERT INTO fly_comment (user_id, episode_id, text, episode_time_stamp)
        VALUES (?, ?, ?, ?)`

        let data = [user_id, episode_id, FlyComment.text, FlyComment.time_stamp]
        console.log("นี่ data",data)
        let result = await pool.execute(insert_fly_comment, data)
        console.log(result)


    }
    catch (error) {
        console.log("Error: ",error)
    }

    console.log("Misha คั่นหน้า fly comment")
    res.send("fly comment เรียบร้อย")

}