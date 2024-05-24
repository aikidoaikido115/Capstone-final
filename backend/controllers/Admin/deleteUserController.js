const pool = require('../../models/database');

module.exports = async (req, res) =>{
    try {

        const username = req.params.username.replace(":","")
        console.log(username)



        let delete_subscription = `
        DELETE FROM subscription
        WHERE user_id = ?
        `
        let delete_history = `
        DELETE FROM history
        WHERE user_id = ?
        `
        let delete_to_watch_list = `
        DELETE FROM to_watch_list
        WHERE user_id = ?
        `
        let delete_comment_reply = `
        DELETE FROM comment_reply
        WHERE user_id = ?
        `

        let delete_comment = `
        DELETE FROM comment
        WHERE user_id = ?
        `

        let fly_comment = `
        DELETE FROM fly_comment
        WHERE user_id = ?
        `
        let delete_user = `
        DELETE FROM user
        WHERE user_id = ?
        `


        let find_uesr_id_by_username = `SELECT user_id FROM user WHERE username = ?`
        const user_id = await pool.execute(find_uesr_id_by_username, [username])
        console.log(user_id[0][0].user_id)
        console.log(req.session)

        //delete
        let delete_array = [delete_subscription, delete_history, delete_to_watch_list, delete_comment_reply, delete_comment, fly_comment, delete_user]
        for (let i of delete_array){
            await pool.execute(i, [user_id[0][0].user_id]);
            console.log("รันคำสั่ง: ", i)
        }


        console.log("Misha คั่นหน้า ลบ User")
        res.send(`Delete ${username} successfully!!`)

    }
    catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}