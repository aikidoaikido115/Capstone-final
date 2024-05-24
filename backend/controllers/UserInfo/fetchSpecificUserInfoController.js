const pool = require('../../models/database');
// const fs = require('fs');




module.exports = async (req, res) =>{
    
    try {
        const Username = req.query.username


        // console.log(Username)

        const data = await pool.query(
            `SELECT username, image FROM user
            WHERE username = ?`, [Username])

        // console.log(data)

        const imageData = data[0][0].image
        const imageBase64 = Buffer.from(imageData).toString('base64');
        const usernamedeData = data[0][0].username

        const responseData = {
            image:imageBase64,
            username:usernamedeData
        }

        // console.log(data)
        // console.log(imageData)

        console.log("Misha คั่นหน้า user เฉพาะเจาะจง")
        res.send(responseData)
    }
    catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}