const pool = require('../../models/database');
// const fs = require('fs');




module.exports = async (req, res) =>{
    
    try {
        const Username = req.query.username

        const data = await pool.query(
            `SELECT username, email FROM user
            WHERE username = ?`, [Username])

        // console.log(data)
        
        // const usernamedeData = data[0][0].username
        const email = data[0][0].email

        const responseData = {
            email:email
        }

        // console.log(data)
        // console.log(imageData)

        console.log("Misha คั่นหน้า email")
        res.send(responseData)
    }
    catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}