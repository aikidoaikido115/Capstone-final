const pool = require('../../models/database');



module.exports = async (req, res) =>{
    try {

        let {title, ep_number} = req.query

        let anime_id = await pool.execute('SELECT anime_id FROM anime WHERE title = ? LIMIT 1', [title])
        anime_id = anime_id[0][0].anime_id

        let get_episode_id = 'SELECT episode_id FROM episode WHERE anime_id = ? AND episode_number = ?'

        let episode_id = await pool.execute(get_episode_id, [anime_id, ep_number])
        episode_id = episode_id[0][0].episode_id

        let get_all_danmaku_in_this_episode =
        `
        SELECT text, episode_time_stamp
        FROM fly_comment
        WHERE episode_id = ?
        `

        let all_danmaku_in_this_episode = await pool.execute(get_all_danmaku_in_this_episode, [episode_id])



        let text_array = []
        let episode_time_stamp_array = []

        for (let i = 0; i < all_danmaku_in_this_episode[0].length; i++) {


            let textData = all_danmaku_in_this_episode[0][i].text
            text_array.push(textData)

            let episode_time_stamp_data = all_danmaku_in_this_episode[0][i].episode_time_stamp
            episode_time_stamp_array.push(episode_time_stamp_data)

        }


        const responseData = {
            text_array:text_array,
            episode_time_stamp_array:episode_time_stamp_array
        }

        console.log("Misha คั่นหน้า show danmaku")
        console.log(responseData)

        res.set('Content-Type', 'application/json; charset=utf-8');
        
        res.json(responseData)
    }
    catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}