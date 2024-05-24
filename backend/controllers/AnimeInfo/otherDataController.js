const pool = require('../../models/database');
const fs = require('fs');


module.exports = async (req, res) =>{
    try {


        const title = req.query.title



        if (title != "anime_title1") {
            let other_data_query_except_episode_name = `
            SELECT studio_name, description, average_rating, premium_status, is_ended FROM anime
            JOIN studio
            USING(studio_id)
            WHERE title = ?
            LIMIT 1
            `
            
            let other_data_episode = `
            SELECT e.title FROM anime a
            JOIN episode e
            USING(anime_id)
            WHERE a.title = ?
            `

            let other_data_genre = `
            SELECT genre_name FROM anime
            JOIN genre
            USING(genre_id)
            WHERE title = ?
            `
            const [data] = await pool.execute(other_data_query_except_episode_name, [title])

            const [episode_data] = await pool.execute(other_data_episode, [title])

            const [genre_data] = await pool.execute(other_data_genre, [title])

            console.log(genre_data)

            let all_episode_data_with_comma = ""
            for (let i = 0; i < episode_data.length; i++){

                if(i != episode_data.length-1){
                    all_episode_data_with_comma += `${episode_data[i].title},`
                }
                else{
                    all_episode_data_with_comma += episode_data[i].title
                }
                
            }

            let [string_premium_status, string_isEnded] = ["",""]
            if (data[0].premium_status == 1) {

                string_premium_status = "true"
            }
            else{
                string_premium_status = "false"
            }
            if (data[0].is_ended == 1) {

                string_isEnded = "true"
            }
            else{
                string_isEnded = "false"
            }

            let array_genre_data = []
            for (let i = 0; i < genre_data.length; i++){
                array_genre_data.push(genre_data[i].genre_name)
            }

            const responseData = {
                studio_name:data[0].studio_name,
                plot:data[0].description,
                rating:parseFloat(data[0].average_rating),
                all_episode_name_with_comma: all_episode_data_with_comma,
                string_premium_status:string_premium_status,
                string_isEnded:string_isEnded,
                genre_data:array_genre_data
            }

            res.json(responseData)
        }
        else{
            res.json("ยังเป็น anime_title1 อยู่แต่เดี๋ยวก็เปลี่ยนแล้ว")
        }

        console.log("Misha คั่นหน้า other_data")

        
    }
    catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}