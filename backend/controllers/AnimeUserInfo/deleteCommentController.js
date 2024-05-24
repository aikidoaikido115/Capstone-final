const pool = require('../../models/database');

const delete_comment = async (comment_id) => {


    let delete_reply =
    `DELETE FROM comment_reply
    WHERE comment_id = ?
    `
    let delete_comment =
    `
    DELETE FROM comment
    WHERE comment_id = ?
    `

    let result1 = await pool.execute(delete_reply, [comment_id])
    let result2 = await pool.execute(delete_comment, [comment_id])

    return result2
}

module.exports = async (req, res) =>{
    try {

        const comment_id = req.params.comment_id.replace(":","")

        const result = await delete_comment(comment_id)
        console.log(result)
        console.log("Misha คั่นหน้า Delete comment")
        res.send(`delete comment successfully`)
    }
    catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}