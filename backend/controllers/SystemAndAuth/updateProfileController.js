const pool = require('../../models/database');
const fs = require('fs');
const bcrypt = require('bcrypt')

//set ไว้ 1GB
pool.execute('SET global max_allowed_packet = 1073741824')
  .then(() => {
    console.log('max_allowed_packet set successfully now you can upload file 1GB per row');
  })
  .catch(err => {
    console.error('Error setting max_allowed_packet: ' + err.stack);
  });

module.exports = async (req, res) =>{
    try {
        const NewProfile = req.body
        const username = req.session.user
        // console.log(username)
        // const userImage = req.files['image'][0];
        let userImage = "api not change image"

        try {
            userImage = req.files['image'][0]
        }
        catch (error) {
            console.log("ไม่ใส่รูปโปรไฟล์มา")
        }




        console.log(userImage)
        if (username === undefined) {
            res.send("ไม่ได้ login เปลี่ยนโปรไฟล์ไม่ได้")
        }
        else {
            let update_profile
            if (userImage === "api not change image" && NewProfile.email === "" && NewProfile.password === "") {
                console.log("ตกเงื่อนไขไม่เปลี่ยนอะไรเลย")
                //ข้ามไม่ทำอะไร
                console.log("Misha คั่นหน้า update profile")
                res.send(`ไม่มีการเปลี่ยนแปลง`)
            }
            else if (userImage !== "api not change image" && NewProfile.email === "" && NewProfile.password === ""){
                console.log("ตกเงื่อนไขเปลี่ยนรูป")
                update_profile =
                `
                UPDATE user SET
                image = ?
                WHERE username = ?
                `
                await pool.execute(update_profile, [userImage.buffer, username])
                console.log("Misha คั่นหน้า update profile")
                res.send(`update profile successfully!!`)
            }
            else if (userImage !== "api not change image" && NewProfile.email !== "" && NewProfile.password === ""){
                console.log("ตกเงื่อนไขเปลี่ยนรูป และเมล")
                update_profile =
                `
                UPDATE user SET
                email = ?,
                image = ?
                WHERE username = ?
                `
                await pool.execute(update_profile, [NewProfile.email, userImage.buffer, username])
                console.log("Misha คั่นหน้า update profile")
                res.send(`update profile successfully!!`)
            }
            else if (userImage !== "api not change image" && NewProfile.email !== "" && NewProfile.password !== ""){
                console.log("ตกเงื่อนไขเปลี่ยนทุกอย่างทั้ง รูป เมล และรหัส")
                update_profile =
                `
                UPDATE user SET
                email = ?,
                password = ?,
                image = ?
                WHERE username = ?
                `
                const salt = 10

                //hash password
                NewProfile.password = await new Promise((resolve, reject) =>{
                    bcrypt.hash(NewProfile.password, salt, (err, hash) =>{
                        if(err) {
                            reject(err)
                        }
                        else {
                            resolve(hash)
                        }
                    })
                })
                console.log("hash")
                console.log(NewProfile.password)

                await pool.execute(update_profile, [NewProfile.email, NewProfile.password, userImage.buffer, username])
                console.log("Misha คั่นหน้า update profile")
                res.send(`update profile successfully!!`)
            }
            else if (userImage !== "api not change image" && NewProfile.email === "" && NewProfile.password !== ""){
                console.log("ตกเงื่อนไขเปลี่ยน รูป และรหัส")
                update_profile =
                `
                UPDATE user SET
                password = ?,
                image = ?
                WHERE username = ?
                `
                const salt = 10

                //hash password
                NewProfile.password = await new Promise((resolve, reject) =>{
                    bcrypt.hash(NewProfile.password, salt, (err, hash) =>{
                        if(err) {
                            reject(err)
                        }
                        else {
                            resolve(hash)
                        }
                    })
                })
                console.log("hash")
                console.log(NewProfile.password)

                await pool.execute(update_profile, [NewProfile.password, userImage.buffer, username])
                console.log("Misha คั่นหน้า update profile")
                res.send(`update profile successfully!!`)
            }
            else if (userImage === "api not change image" && NewProfile.email !== "" && NewProfile.password === ""){
                console.log("ตกเงื่อนไขเปลี่ยน เมลอย่างเดียว")
                update_profile =
                `
                UPDATE user SET
                email = ?
                WHERE username = ?
                `

                await pool.execute(update_profile, [NewProfile.email, username])
                console.log("Misha คั่นหน้า update profile")
                res.send(`update profile successfully!!`)
            }
            else if (userImage === "api not change image" && NewProfile.email !== "" && NewProfile.password !== ""){
                console.log("ตกเงื่อนไขเปลี่ยน เมล และรหัส")
                update_profile =
                `
                UPDATE user SET
                email = ?,
                password = ?
                WHERE username = ?
                `
                const salt = 10

                //hash password
                NewProfile.password = await new Promise((resolve, reject) =>{
                    bcrypt.hash(NewProfile.password, salt, (err, hash) =>{
                        if(err) {
                            reject(err)
                        }
                        else {
                            resolve(hash)
                        }
                    })
                })
                console.log("hash")
                console.log(NewProfile.password)

                await pool.execute(update_profile, [NewProfile.email, NewProfile.password, username])
                console.log("Misha คั่นหน้า update profile")
                res.send(`update profile successfully!!`)
            }
            else if (userImage === "api not change image" && NewProfile.email === "" && NewProfile.password !== ""){
                console.log("ตกเงื่อนไขเปลี่ยน รหัส อย่างเดียว")
                update_profile =
                `
                UPDATE user SET
                password = ?
                WHERE username = ?
                `
                const salt = 10

                //hash password
                NewProfile.password = await new Promise((resolve, reject) =>{
                    bcrypt.hash(NewProfile.password, salt, (err, hash) =>{
                        if(err) {
                            reject(err)
                        }
                        else {
                            resolve(hash)
                        }
                    })
                })
                console.log("hash")
                console.log(NewProfile.password)

                await pool.execute(update_profile, [NewProfile.password, username])
                console.log("Misha คั่นหน้า update profile")
                res.send(`update profile successfully!!`)
            }
        }
    }
    catch (error) {
        console.error("update profile ไม่สำเร็จ Error:", error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}