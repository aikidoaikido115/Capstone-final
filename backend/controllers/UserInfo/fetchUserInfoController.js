const pool = require('../../models/database');
const fs = require('fs');




module.exports = async (req, res) =>{
    try {
        const data = await pool.query(
            `SELECT image, username, text FROM user
            JOIN comment
            USING(user_id)`)

        const imageData = data[0][0].image
        const imageBase64 = Buffer.from(imageData).toString('base64');
        const usernamedeData = data[0][0].username
        const textData = data[0][0].text



        const responseData = {
            image:imageBase64,
            username:usernamedeData,
            text: textData
        }



        // console.log(data)
        // console.log(imageData)

        console.log("Misha คั่นหน้า user")
        res.send(responseData)
    }
    catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}