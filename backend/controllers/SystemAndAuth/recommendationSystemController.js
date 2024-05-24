const NaiveBayes = require('bayes');
const crypto = require('crypto');
// const arrayUnion = require('array-union')

const pool = require('../../models/database');



module.exports = async (req, res) => {
    try {



        let username = req.query.username

        if (username === "Guest login" || username === undefined){
            console.log("Misha คั่นหน้า Naive Bayes และตกเงื่อนไข username เป็น Guest login ไม่ก็ undefined username ->",username)

            res.send("Guest login")
        }
        else {

            let get_user_id = `SELECT user_id FROM user WHERE username = ?`
            const user_id = await pool.execute(get_user_id, [username])
            
            let get_all_user_history_by_id = 
            `
            SELECT anime_id, history_date FROM history
            WHERE user_id = ?
            `


            let get_user_history_by_id = 
            `
            SELECT anime_id, history_date FROM history
            WHERE user_id = ?
            ORDER BY history_date DESC
            LIMIT 3
            `
            console.log("เปลี่ยนจำนวนเรื่องได้")
            const all_user_history = await pool.execute(get_all_user_history_by_id, [user_id[0][0].user_id])


            const user_history = await pool.execute(get_user_history_by_id, [user_id[0][0].user_id])



   
            if (all_user_history[0].length <= 3){
                console.log(`${username} ดูอนิเมะยังไม่ครบ 3 เรื่องจึงยังไม่แนะนำอนิเมะเรื่องถัดไปและทำการสุ่มไปก่อน`)
                res.send(`${username} ดูอนิเมะยังไม่ครบ 3 เรื่องจึงยังไม่แนะนำอนิเมะเรื่องถัดไปและทำการสุ่มไปก่อน`)
            }
            else{
   
                const classifier = new NaiveBayes();

                console.log(user_history)


                let GET_ANIME_TITLE = `SELECT DISTINCT title FROM anime`

                let GET_ALL_FIRST_ANIME_ID = `SELECT anime_id FROM anime WHERE title = ? LIMIT 1`

                let GET_GENRE = `SELECT genre_name FROM genre WHERE genre_id IN (
                    SELECT genre_id FROM anime_genre WHERE anime_id = ?
                )`
                

                let get_anime_title = `SELECT title FROM anime WHERE anime_id = ?`
                let get_genre = `SELECT genre_name FROM genre WHERE genre_id IN (
                    SELECT genre_id FROM anime_genre WHERE anime_id = ?
                )`

   
                let ALL_FIRST_ANIME_ID = []
                const ANIME_TITLE = await pool.execute(GET_ANIME_TITLE)
                // console.log("asdsadsadsada",ANIME_TITLE[0][0].title,"adsadsadsadas")
                for (let i = 0; i < ANIME_TITLE[0].length; i++) {
                    const FIRST_ANIME_ID = await pool.execute(GET_ALL_FIRST_ANIME_ID, [ANIME_TITLE[0][i].title])
                    ALL_FIRST_ANIME_ID.push(FIRST_ANIME_ID[0][0].anime_id)
                }
                // console.log(ALL_FIRST_ANIME_ID)

                let genre_2d_array_for_training = []
                for (let i = 0; i < ALL_FIRST_ANIME_ID.length; i++){
                    const genre = await pool.execute(GET_GENRE, [ALL_FIRST_ANIME_ID[i]])
                    let genre_array = genre[0].map(element => element.genre_name)
                    genre_2d_array_for_training.push(genre_array)
                }

                console.log(genre_2d_array_for_training)

                let trainingData = []
                for (let i = 0; i < ANIME_TITLE[0].length; i++) {
                    const title = ANIME_TITLE[0][i].title
                    const genre = genre_2d_array_for_training[i]

                    trainingData.push({title: title, genre: genre})

                }
                // console.log(trainingData)




                let genre_2d_array_for_predict = []
                for (let i = 0; i < user_history[0].length; i++) {
                    const genre = await pool.execute(get_genre, [user_history[0][i].anime_id])
                    let genre_array = genre[0].map(element => element.genre_name)
                    genre_2d_array_for_predict.push(genre_array)

 
                    const title = await pool.execute(get_anime_title, [user_history[0][i].anime_id])
                    trainingData = trainingData.filter(element => element.title !== title[0][0].title)

                }
                console.log(genre_2d_array_for_predict)

                console.log('trainingData',trainingData)



                trainingData.forEach(data => {
                    // Combine genres into a single string for Naive Bayes
                    const combinedGenres = data.genre.join(',');
                    classifier.learn(combinedGenres, data.title);
                });




                let array_concat = genre_2d_array_for_predict[0]

                for (let i = 0; i < genre_2d_array_for_predict.length; i++) {

                    import('array-union').then(arrayUnion => {
                        array_concat = arrayUnion.default(array_concat, genre_2d_array_for_predict[i]);
                        console.log("รวมได้ไม่ซ้ำแล้ว",array_concat)

                        const string_genre = array_concat.join(',')
                        
                        if (i === genre_2d_array_for_predict.length - 1){
                            console.log("หลายเรื่องรวมกันแล้ว",string_genre)
                            const y_pred = classifier.categorize(string_genre)
                            .then(answer => {
                                console.log("Recommended Anime:", answer)
                                console.log(`Misha คั่นหน้า Naive Bayes และตกเงื่อนไข username เป็น ${username}`)
                                //send คำตอบที่ predict ออกไป
                                res.send(`${answer}`)
                            })
                        }
                        

                      }).catch(error => {
                        console.error('Failed to import array-union:', error);
                      })
                }
                

                // for (let i = 0; i < genre_2d_array_for_predict.length; i++) {
                //     const string_genre = genre_2d_array_for_predict[i].join(',')
                //     string_genre_concat += string_genre
                //     console.log("เอามาต่อกันแล้วแต่อาจจะมีซ้ำ",string_genre_concat)


                //     //จากนั้นก็สุ่มจาก 2 เรื่องที่ pred มาและส่งไปที่ big
                    
                //     const y_pred = classifier.categorize(string_genre)
                //         .then(answer => {
                //             console.log("Recommended Anime:", answer)
                //             answer_array.push(answer)
                            
                //             // console.log(answer_array.length)
                //         })
                //         .then(final_answer => {
                //             //then 2 อันเพราะให้มันรันถูกลำกับเฉยๆ final_answer ไม่ต้องใช้
                //             randomIndex = crypto.randomInt(0, answer_array.length)
                //             random_one_from_two_answer = answer_array[randomIndex]
                //             console.log(answer_array)
                //             console.log(random_one_from_two_answer)
                            
                //             if (i === genre_2d_array_for_predict.length - 1) {
                //                 console.log(`Misha คั่นหน้า Naive Bayes และตกเงื่อนไข username เป็น ${username}`)
                //                 //send คำตอบที่ predict ออกไป
                //                 res.send(`${random_one_from_two_answer}`)
                //             }
                //         })
                // }

                // const string_genre = array_concat.join(',')

                // console.log("หลายเรื่องรวมกันแล้ว",string_genre)
                // const y_pred = classifier.categorize(string_genre)
                //     .then(answer => {
                //         console.log("Recommended Anime:", answer)
                //         answer_array.push(answer)
                            
                //         console.log(`Misha คั่นหน้า Naive Bayes และตกเงื่อนไข username เป็น ${username}`)
                //         //send คำตอบที่ predict ออกไป
                //         res.send(`${answer}`)
                // })

            }
        }
        

        
    }
    catch (error) {
        console.error("Predict anime ไม่สำเร็จ Error:", error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}