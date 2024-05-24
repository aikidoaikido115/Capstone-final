const pool = require('../../models/database');

module.exports = async (req, res) =>{
    try {

        let username = req.session.user
        let package_name = req.query.package_name
        // console.log(package_name)
        // console.log(username)

        if (username === undefined) {
            console.log(`Misha คั่นหน้า premium get`)
            //ป้องกันการใส่ SQL ผิด
            res.send("ออกไปที่อื่นดีกว่า")
        }
        else {

            let get_user_id = `SELECT user_id FROM user WHERE username = ?`
            let user_id = await pool.execute(get_user_id, [username])
            user_id = user_id[0][0].user_id
            // console.log(user_id)

            let isAlreadyPremium = `SELECT user_id FROM subscription WHERE user_id = ?`
            let isAlreadyPremium_result = await pool.execute(isAlreadyPremium, [user_id])
            isAlreadyPremium_result = isAlreadyPremium_result[0]


            if(isAlreadyPremium_result.length > 0) {
                console.log(`Misha คั่นหน้า premium get`)
                res.send("im premium i can not register again until timeout")
            }
            else {
                let get_package_length = `SELECT package_length FROM subscription_package WHERE package_name = ?`
                let package_length = await pool.execute(get_package_length, [package_name])
                package_length = package_length[0][0].package_length
                console.log(package_length)

                //บันทึกประวัติเพื่อจับเวลา premium
                let saveSubscription = `INSERT INTO subscription(user_id, package_id, start_date, end_date)
                VALUES(?, (SELECT package_id FROM subscription_package WHERE package_name = ? LIMIT 1), NOW(), DATE_ADD(NOW(), INTERVAL ? SECOND))`
                
                let data = [user_id, package_name, package_length]
                let saveSubscription_result = await pool.execute(saveSubscription, data)
                console.log(saveSubscription_result)

                let setPremium_status = `UPDATE user SET subscription_status = 1 WHERE username = ?`
                await pool.execute(setPremium_status, [username])
                
                console.log(`Misha คั่นหน้า premium get`)
                res.send(`${username} เป็นสมาชิก premium แล้วขณะนี้`)
            }

            
        }

        
        
    }
    catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}