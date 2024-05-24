const pool = require('../../models/database');

module.exports = async (req, res) =>{
    try {

        const Username = req.query.username

        const user_table = `SELECT username FROM user`
        const count_user = `SELECT count(*) AS cnt FROM user`


        try{
            const[row, fields] = await pool.execute(user_table)
            const [count] = await pool.execute(count_user)

            console.log(count)
            res.json({
                array_of_table:row,
                count_user:count[0].cnt
            })


        } catch(error) {
            console.error('Error query user table from admin page:', error);
        }

        console.log("Misha คั่นหน้า Admin")
    }
    catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}