const pool = require('../../models/database');

module.exports = async (req, res) =>{
    try {


        const title = req.params.title.replace(":","")
        // console.log(title)


        let delete_to_watch_list = `
        DELETE FROM to_watch_list
        WHERE anime_id IN (
            SELECT anime_id FROM anime
            WHERE title = ?
        )
        `
        let delete_history = `
        DELETE FROM history
        WHERE anime_id IN (
            SELECT anime_id FROM anime
            WHERE title = ?
        )
        `

        let delete_anime_genre = `
        DELETE FROM anime_genre
        WHERE anime_id IN (
            SELECT anime_id FROM anime
            WHERE title = ?
        )`

        let delete_comment_reply = `
        DELETE FROM comment_reply
        WHERE comment_id IN (
            SELECT comment_id FROM comment
            WHERE episode_id IN (
                SELECT episode_id FROM episode
                WHERE anime_id IN (
                    SELECT anime_id FROM anime
                    WHERE title = ?
                )
            )
        )`

        let delete_comment = `
        DELETE FROM comment
        WHERE episode_id IN (
            SELECT episode_id FROM episode
            WHERE anime_id IN (
                SELECT anime_id FROM anime
                WHERE title = ?
            )
        )`

        let delete_fly_comment =`
        DELETE FROM fly_comment
        WHERE episode_id IN (
            SELECT episode_id FROM episode
            WHERE anime_id IN (
                SELECT anime_id FROM anime
                WHERE title = ?
            )
        )
        `

        let delete_episode = `
        DELETE FROM episode
        WHERE anime_id IN (
            SELECT anime_id FROM anime
            WHERE title = ?
        )`

        let delete_anime = `DELETE FROM anime WHERE title = ?`



        let delete_array =
            [
                delete_to_watch_list,
                delete_history,
                delete_anime_genre,
                delete_comment_reply,
                delete_comment,
                delete_fly_comment,
                delete_episode,
                delete_anime
            ]
        for (let i of delete_array){
            await pool.execute(i, [title])
        }


        console.log("Misha คั่นหน้า Delete")
        res.send(`Delete ${title} successfully!!`)

    }
    catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}