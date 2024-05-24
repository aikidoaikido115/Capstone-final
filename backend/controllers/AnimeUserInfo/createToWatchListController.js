const pool = require('../../models/database');
const fs = require('fs');



const get_user_id_by_username = async (username) => {
    let get_user_id = `SELECT user_id FROM user WHERE username = ?`
    let user_id = await pool.execute(get_user_id, [username])
    user_id = user_id[0][0].user_id
    return user_id
}

const get_anime_id_by_title = async (title) => {
    let get_anime_id = `SELECT anime_id FROM anime WHERE title = ? LIMIT 1`
    let anime_id = await pool.execute(get_anime_id, [title])
    anime_id = anime_id[0][0].anime_id
    return anime_id
}

module.exports = async (req, res) =>{
    try {
        const to_watch_list = req.body
        

        const user_id = await get_user_id_by_username(to_watch_list.username)
        console.log(to_watch_list.username, user_id)


        //คือ first_anime_id
        const anime_id = await get_anime_id_by_title(to_watch_list.title)
        console.log(anime_id)

        let insert_to_watch_list = `INSERT INTO to_watch_list(user_id, anime_id) VALUES (?, ?)`
        
        try{
            const result = await pool.execute(insert_to_watch_list, [user_id, anime_id])
            console.log("บันทึก watch list สำเร็จ")
            console.log("Misha คั่นหน้า Create to watch list")
            res.send(`${to_watch_list.username} ยังไม่ว่างดู ${to_watch_list.title} ดังนั้นจึงบันทึกเข้าไปใน watch list`)
        }
        catch (error) {
            console.log(`เรื่องนี้มีอยู่ใน watch list ของบัญชี ${to_watch_list.username} อยู่แล้ว`)
            console.log("ไม่ทำอะไรข้ามการทำงานไปเลย")
            console.log("Misha คั่นหน้า Create to watch list")
            res.send(`this anime already in watch list`)
        }
    }
    catch (error) {
        console.error("เพิ่มอนิเมะไม่สำเร็จ Error:", error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}