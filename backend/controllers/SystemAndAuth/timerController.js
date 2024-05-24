const e = require('express');
const pool = require('../../models/database');

module.exports = async (req, res) =>{
    try {
        let username = req.session.user
        if (username === undefined) {
            console.log("Misha คั่นหน้าจับเวลา")
            res.send("ไม่ได้ลอคอินไม่ต้องทำอะไร")
        }
        else {
            let current_date = new Date()

            let get_user_id = `SELECT user_id FROM user WHERE username = ?`
            let user_id = await pool.execute(get_user_id, [username])
            user_id = user_id[0][0].user_id
            console.log(user_id)

            try {


                let get_expire_day = `SELECT end_date FROM subscription WHERE user_id = ?`
                let expire_day = await pool.execute(get_expire_day, [user_id])
                expire_day = new Date(expire_day[0][0].end_date)

                console.log("Misha คั่นหน้าจับเวลา")
                if (current_date >= expire_day) {
                    let clear_subscription = `DELETE FROM subscription WHERE user_id = ?`
                    let result_clear = await pool.execute(clear_subscription, [user_id])
                    console.log(result_clear)

                    let set_current_status = `UPDATE user SET subscription_status = 0 WHERE username = ?`
                    let result_set = await pool.execute(set_current_status, [username])
                    res.send('หมดอายุ');
                } else {
                    res.send('ยังเป็นพรีเมียมอยู่');
                }
            }
            catch (error) {
                console.log("Error ที่ end_date เป็นเรื่องปกติตาม logic ไม่ใช่ error ร้ายแรงอะไร")
                res.send(`user ไม่ได้เป็นพรีเมียมเลย query ใน sql ไม่เจอ`);
            }
            

        }
    }
    catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}