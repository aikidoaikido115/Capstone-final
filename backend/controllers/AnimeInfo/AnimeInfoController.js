const pool = require('../../models/database');
const crypto = require('crypto');
const fs = require('fs');
const axios = require('axios');



module.exports = async (req, res) =>{
    try {

        let {title, ep_number} = req.query
        // console.log(req.query)

        let get_ep_name =
        `
        SELECT e.title, description, sum_view
        FROM episode e
        JOIN anime a
        USING (anime_id)
        WHERE a.title = ? AND episode_number = ?
        LIMIT 1
        `

        let data = await pool.execute(get_ep_name, [title, ep_number])
        let ep_name = data[0][0].title
        let description = data[0][0].description
        let sum_view = data[0][0].sum_view
        console.log(ep_name)

        let get_first_anime_id = `SELECT anime_id FROM anime WHERE title = ? LIMIT 1`
        let get_genre = `SELECT genre_name FROM genre WHERE genre_id IN (
            SELECT genre_id FROM anime_genre WHERE anime_id = ?
        )`

        
        const first_anime_id = await pool.execute(get_first_anime_id, [title])
        const genre = await pool.execute(get_genre, [first_anime_id[0][0].anime_id])
        let genre_1d_array = genre[0].map(element => element.genre_name)

        const responseData = {
            AnimeTitle: title,
            ep_name:ep_name,
            genre_1d_array:genre_1d_array,
            description:description,
            view:sum_view
        }

        console.log("Misha คั่นหน้า anime_info")
        console.log(responseData)

        res.set('Content-Type', 'application/json; charset=utf-8');
        
        res.json(responseData)
    }
    catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}