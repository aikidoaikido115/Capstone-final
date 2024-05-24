const pool = require('../../models/database');
const { Readable } = require('stream');

module.exports = async (req, res) =>{
    try {

        const Username = req.session.user
        console.log("เอาชื่อนี้ไปเช็คสิทธิ์พรีเมี่ยมห้น watch ด้วย api อื่นเพราะ api นี้สำหรับ vedio เท่านั้น",Username)
        const { anime_title, episode_number } = req.params;


        const get_anime_id =
        `
        SELECT DISTINCT anime_id FROM anime WHERE title = ?
        `
        let anime_id = await pool.execute(get_anime_id, [anime_title])
        anime_id = anime_id[0][0].anime_id
  

        const get_animeFile =
        `
        SELECT anime_file
        FROM anime
        JOIN episode
        USING (anime_id)
        WHERE anime_id = ? AND episode_number = ?
        `
        let anime_file = await pool.execute(get_animeFile, [anime_id, episode_number])
        anime_file = anime_file[0][0].anime_file
        console.log(anime_file, "ไรวะ")



        const stream = new Readable();
        stream.push(anime_file);
        stream.push(null); // End the stream

        // Set appropriate headers for video streaming
        res.writeHead(200, {
        'Content-Type': 'video/mp4',
        'Content-Length': Buffer.byteLength(anime_file)
        });

        // Pipe the stream to the response
        stream.pipe(res);
    }
    catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}