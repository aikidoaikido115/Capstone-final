const bcrypt = require('bcrypt')
const pool = require('../../models/database')

module.exports = async (req, res) =>{

    const { username, password } = req.body
    // console.log('loginUserController ทำงานได้เมื่อกด login')
    let sql = `SELECT * FROM user where username = ?`

    const response = await pool.execute(sql, [username])

    if(response[0].length > 0){
        // console.log(response[0][0].password)

        
        const hashedPassword = response[0][0].password;
        let cmp = bcrypt.compare(password, hashedPassword)
            .then((match) =>{
                if(match){

                    console.log('Login สำเร็จ')


                    req.session.user = username;


                
                    const SESSION = req.session.user
                    console.log(SESSION)


                    res.json({ message: 'you are in', session:SESSION})
                }
                else{
                    console.log("รหัสผิด")
                    res.json({message:"dead wrong"})

                }
            })
            
    }
    else{
        console.log("ไม่มี username นี้")
        // res.send("do not have this username")
        res.json({message:"do not have this username"})
    }
}