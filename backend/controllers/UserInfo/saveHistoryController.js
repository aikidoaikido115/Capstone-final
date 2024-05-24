const pool = require('../../models/database')

module.exports = async (req, res) => {
    try {
        const title = req.body.title
        let username = req.session.user
        // console.log(title)

        if (username === undefined) {
            console.log("เป็น Guest login ดังนั้นไม่ต้องบันทึกประวัติรับชม")
            console.log("Misha คั่นหน้า history")
            res.send("ยังไม่ได้ login เลยไม่ save ประวัติหรอกเก็บแค่ยอดวิวอย่างเดียวสำหรับ Guest login")
        }
        else {
            // console.log(username)
            let get_user_id = `SELECT user_id FROM user WHERE username = ?`
            const user_id = await pool.execute(get_user_id, [username])
            // console.log(user_id[0][0].user_id)

            let get_first_anime_id = `SELECT anime_id FROM anime WHERE title = ? LIMIT 1`
            const first_anime_id = await pool.execute(get_first_anime_id, [title])
            // console.log(first_anime_id[0][0].anime_id)

            let insert_history = `INSERT INTO history(user_id, anime_id, history_date) VALUES (?, ?, NOW())`
            try{
                const result = await pool.execute(insert_history, [user_id[0][0].user_id, first_anime_id[0][0].anime_id])
                res.send(`${username} ได้ดู ${title} ดังนั้นจึงบันทึกประวัติการรับชม`)
            }
            catch (error) {

         
                let delete_old_row = `
                DELETE FROM history
                WHERE user_id = ? AND anime_id = ?`
                const delete_result = await pool.execute(delete_old_row, [user_id[0][0].user_id, first_anime_id[0][0].anime_id])

        
                let insert_new_row = `
                INSERT INTO history(user_id, anime_id, history_date) VALUES
                (?, ?, NOW())
                `
                const insert_result = await pool.execute(insert_history, [user_id[0][0].user_id, first_anime_id[0][0].anime_id])

                console.log(`${username} ได้ดู ${title} ซ้ำอีกครั้งดังนั้นจึงดันเรื่องนี้ไปอยู่ด้านบนสุดแทนและลบอันล่างทิ้งไป`)
                res.send(`${username} ได้ดู ${title} ซ้ำอีกครั้งดังนั้นจึงดันเรื่องนี้ไปอยู่ด้านบนสุดแทนและลบอันล่างทิ้งไป`)
            }
            console.log("Misha คั่นหน้า history")
            
        }
        

        
    }
    catch (error) {
        console.error("บันทึกประวัติการรับชมไม่สำเร็จ Error:", error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}