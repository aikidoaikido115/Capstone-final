const pool = require('../../models/database');



module.exports = async (req, res) =>{
    try {

        let {title, ep_number} = req.query

        let anime_id = await pool.execute('SELECT anime_id FROM anime WHERE title = ? LIMIT 1', [title])
        anime_id = anime_id[0][0].anime_id

        let get_episode_id = 'SELECT episode_id FROM episode WHERE anime_id = ? AND episode_number = ?'

        let episode_id = await pool.execute(get_episode_id, [anime_id, ep_number])
        episode_id = episode_id[0][0].episode_id

        let get_all_comment_in_this_episode =
        `
        SELECT comment_id, username, image, text, comment_date
        FROM user
        JOIN comment
        USING (user_id)
        WHERE episode_id = ?
        `

        let all_comment_in_this_episode = await pool.execute(get_all_comment_in_this_episode, [episode_id])


        let user_imagebase64_array = []
        let comment_id_array = []
        let username_array = []
        let text_array = []
        let date_array = []

        for (let i = 0; i < all_comment_in_this_episode[0].length; i++) {

            let imageData = all_comment_in_this_episode[0][i].image
            user_imagebase64_array.push(Buffer.from(imageData).toString('base64'))

            let usernameData = all_comment_in_this_episode[0][i].username
            username_array.push(usernameData)

            let textData = all_comment_in_this_episode[0][i].text
            text_array.push(textData)

            let dateData = all_comment_in_this_episode[0][i].comment_date
            date_array.push(dateData)

            let idData = all_comment_in_this_episode[0][i].comment_id
            comment_id_array.push(idData)

        }


        const responseData = {
            user_imagebase64_array:user_imagebase64_array,
            username_array:username_array,
            text_array:text_array,
            date_array:date_array,
            comment_id_array:comment_id_array
        }

        for (let i = 0; i < date_array.length; i++) {
            console.log(date_array)
        }

        console.log("Misha คั่นหน้า show comment")
        console.log(responseData)

        res.set('Content-Type', 'application/json; charset=utf-8');
        
        res.json(responseData)
    }
    catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}