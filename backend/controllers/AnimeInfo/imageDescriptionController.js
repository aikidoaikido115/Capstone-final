const pool = require('../../models/database');
const fs = require('fs');


module.exports = async (req, res) =>{
    try {



        const data = await pool.query(
            `SELECT ag.genre_id,anime_image, episode_number, e.title Etitle, a.title Atitle, description, g.genre_name
            from anime a
            JOIN episode e
            USING (anime_id)
            JOIN anime_genre ag
            USING(anime_id)
            JOIN genre g
            ON ag.genre_id = g.genre_id
            WHERE a.title = 'classroom of the elite ss1'`)


        let get_genre_of_this_anime = `
        SELECT genre_id, genre_name FROM anime
        JOIN genre
        USING(genre_id)
        WHERE title = ?
        `
        const data_genre = await pool.execute(get_genre_of_this_anime, [data[0][0].Atitle])



        const imageData = data[0][0].anime_image
        const imageBase64 = Buffer.from(imageData).toString('base64');
        const descriptionData = data[0][0].description
        const titleAnimeData = data[0][0].Atitle
        const titleEpisodeData = data[0][0].Etitle
        const episode_number = data[0][0].episode_number

        //genre
        let genreData_array = []
        for (let i = 0; i < data_genre[0].length; i++){
            if (i == data_genre[0].length -1){
                genreData_array.push(data_genre[0][i].genre_name)
            }
            else{
                genreData_array.push(data_genre[0][i].genre_name + ', ')
            }
            
        }

        const responseData = {
            image:imageBase64,
            description:descriptionData,
            genre: genreData_array,
            AnimeTitle: titleAnimeData,
            EpisodeTitle: titleEpisodeData,
            EpisodeNumber: episode_number
        }


        

        console.log("Misha คั่นหน้า basic_info")
        res.json(responseData)
    }
    catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}