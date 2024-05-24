const pool = require('../../models/database');

module.exports = async (req, res) =>{
    try {

        const {anime_title} = req.params

        let get_episode_number =
        `
        SELECT episode_number
        FROM episode
        WHERE anime_id IN (
            SELECT anime_id FROM anime WHERE title = ?
        )
        `
        let episode_number = await pool.execute(get_episode_number, [anime_title])
        let episode_number_array = []

        for (let i of episode_number[0]) {
            episode_number_array.push(i.episode_number)
            // console.log(episode_number_array)
        }

        const responseData = {
            episode_number_array: episode_number_array
        }

        console.log("Misha คั่นหน้า episode_number")
        // console.log(responseData)

        res.json(responseData)
    }
    catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}