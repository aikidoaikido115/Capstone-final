const pool = require('../../models/database');

module.exports = async (req, res) =>{
    try {

        let Username = req.session.user


        const title = req.query.title
        console.log(title)

        let anime_premium_status

        if (title === "just give me only user status") {
            console.log("ไม่ต้องเอา anime_status มาเพราะจะเอาแค่ user_status")

            anime_premium_status = false
        }
        else {
            let get_anime_premium_status = `SELECT DISTINCT premium_status FROM anime WHERE title = ?`
            anime_premium_status = await pool.execute(get_anime_premium_status, [title])
            // console.log(Boolean(anime_premium_status[0][0].premium_status))
            anime_premium_status = Boolean(anime_premium_status[0][0].premium_status)
            // console.log(anime_premium_status) //output true,false
        }


        if (Username === undefined) {
            
            const responseData = {
                user_premium_status: false,
                anime_premium_status: anime_premium_status
            }
            console.log("Misha คั่นหน้า premium status Guest login")
            console.log(responseData)
            res.json(responseData)
        }
        else {
            if (title === "just give me only user status") {
                let get_user_status = `SELECT subscription_status FROM user WHERE username = ?`
                let user_premium_status = await pool.execute(get_user_status, [Username])
                user_premium_status = Boolean(user_premium_status[0][0].subscription_status)
                const responseData = {
                    user_premium_status: user_premium_status,
                }
                console.log(`Misha คั่นหน้า premium status แค่เอา user status เฉยๆ`)
                console.log(responseData)
        
                res.json(responseData)
            }
            else{
                let get_user_status = `SELECT subscription_status FROM user WHERE username = ?`
                let user_premium_status = await pool.execute(get_user_status, [Username])
                user_premium_status = Boolean(user_premium_status[0][0].subscription_status)
         
                const responseData = {
                    user_premium_status: user_premium_status,
                    anime_premium_status: anime_premium_status
                }
        
                console.log(`Misha คั่นหน้า premium status login as ${Username}`)
                console.log(responseData)
        
                res.json(responseData)
            }
            
        }

        
    }
    catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}