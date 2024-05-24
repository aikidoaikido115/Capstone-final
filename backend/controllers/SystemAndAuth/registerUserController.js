const pool = require('../../models/database');
const bcrypt = require('bcrypt')

const fs = require('fs');



const salt = 10

module.exports = async (req, res) =>{


    const UserInfo = req.body
    // console.log(UserInfo.password)

    try {

        let isUserExistSQL = 'SELECT * FROM user WHERE username = ?'
        const check_user = await pool.execute(isUserExistSQL, [UserInfo.username])

        if (Boolean(check_user[0][0])) {
            console.log("user ซ้ำ")
            res.send("User Already exists")
            return
        }

        //hash password
        UserInfo.password = await new Promise((resolve, reject) =>{
            bcrypt.hash(UserInfo.password, salt, (err, hash) =>{
                if(err) {
                    reject(err)
                }
                else {
                    resolve(hash)
                }
            })
        })
    } catch (error) {
        console.error(error);
        // Handle the error and send an appropriate response
        res.status(500).send('Internal Server Error');
    }
    // console.log(UserInfo)


    const userImage = fs.readFileSync('./DefaultProfile/ธรรมะ.jpg')


    UserInfo_array = []
    for (const [key, value] of Object.entries(UserInfo)) {
        UserInfo_array.push(value)
      }

    console.log(UserInfo_array)

    UserInfo_array.push(userImage)
    console.log(UserInfo_array)



    let sql =`INSERT INTO user (username, email, password, image, create_date, subscription_status)
    VALUES (?, ?, ?, ?, NOW(), 0)`

    try {

        const result = await pool.execute(sql, UserInfo_array)

        console.log(result)
        
        console.log("Register Success in console")
 
        res.send("Register Success in api ใส่ไว้เพื่อให้ไม่ค้างตอนยิง req")
    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }

}