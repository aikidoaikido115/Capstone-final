const pool = require('../../models/database');

const delete_watch_list = async (username,title) => {
    let sql =
    `
    DELETE FROM to_watch_list
    WHERE user_id = (
        SELECT user_id FROM user WHERE username = ?
    )
    AND
    anime_id = (
        SELECT anime_id FROM anime WHERE title = ? LIMIT 1
    )
    `
    let result = await pool.execute(sql, [username, title])

    return result
}

module.exports = async (req, res) =>{
    try {


        const title = req.params.title.replace(":","")
        const username = req.session.user

        if (username === undefined) {
            console.log("Misha คั่นหน้า Delete Watch list")
            res.send("ไม่ต้องทำอะไร")
        }
        else {
            const result = await delete_watch_list(username, title)
            console.log(result)
            console.log("Misha คั่นหน้า Delete Watch list")
            res.send(`delete ${title} from watch list successfully`)
        }
    }
    catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}