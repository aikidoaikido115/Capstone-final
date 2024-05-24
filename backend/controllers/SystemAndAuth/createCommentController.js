const pool = require('../../models/database');

module.exports = async (req, res) =>{


    const Comment = req.body
    console.log(Comment)

    try {

        let user_id = await pool.execute('SELECT user_id FROM user WHERE username = ?', [Comment.username])
        user_id = user_id[0][0].user_id
        console.log("username ผ่าน")

        let anime_id = await pool.execute('SELECT anime_id FROM anime WHERE title = ? LIMIT 1', [Comment.anime_title])
        anime_id = anime_id[0][0].anime_id

        console.log("anime_id ผ่าน")

        let get_episode_id = 'SELECT episode_id FROM episode WHERE anime_id = ? AND episode_number = ?'

        let episode_id = await pool.execute(get_episode_id, [anime_id, Comment.episode_number])
        episode_id = episode_id[0][0].episode_id

        console.log("episode_id ผ่าน")


        //ปล่อย reply_count like_ เป็น null ไปเลยไม่น่าได้ทำ
        let insert_comment =
        `INSERT INTO comment (user_id, episode_id, text, comment_date)
        VALUES (?, ?, ?, ?)`

        let data = [user_id, episode_id, Comment.text, Comment.date]
        console.log("นี่ data",data)
        let result = await pool.execute(insert_comment, data)
        console.log(result)

    }
    catch (error) {
        console.log("Error: ",error)
    }

    console.log("Misha คั่นหน้า comment")
    res.send("comment เรียบร้อย")

}