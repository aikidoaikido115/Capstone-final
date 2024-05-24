const pool = require('../../models/database');
const fs = require('fs');

//set ไว้ 1GB
pool.execute('SET global max_allowed_packet = 1073741824')
  .then(() => {
    console.log('max_allowed_packet set successfully now you can upload file 1GB per row');
  })
  .catch(err => {
    console.error('Error setting max_allowed_packet: ' + err.stack);
  });

//create ทุกตารางที่เกี่ยวกับอนิเมะ

module.exports = async (req, res) =>{
    try {
        const NewAnime = req.body
        const animeImage = req.files['animeImage'][0];
        const bigImage = req.files['bigImage'][0];
        const animeFiles = req.files['animeFile'];

        console.log(NewAnime)
        console.log(bigImage)



        const genre_array = NewAnime.genre.split(",")
        let genre_array_length = genre_array.length
        let dynamic_query_param = ``
        for(let i = 0; i < genre_array_length; i++){
            if(i == genre_array_length-1)
            {
                dynamic_query_param += `${'?'}`
            }
            else
            {
                dynamic_query_param += `${'?'},`
            }
        }
        console.log("ไหนดูดิ้ว่ามีกี่อัน",dynamic_query_param)
        let get_genre_id = `SELECT genre_id FROM genre WHERE genre_name IN (${dynamic_query_param})`

        const [raw_genre_id] = await pool.execute(get_genre_id, genre_array)
        const genre_id = raw_genre_id.map(element => element.genre_id)


        console.table(genre_id)



        let studio_id;
        try {
            let get_studio_id = 'SELECT studio_id FROM studio WHERE studio_name = ?'
            const [raw_studio_id] = await pool.execute(get_studio_id, [NewAnime.studio])
            studio_id = raw_studio_id[0].studio_id

        } catch (error) {
            console.log("error ตรง try catch: ",error)
            console.log("สร้าง row ใหม่ใน sql แทนเพราะมันไม่เคยมี studio")
            let create_studio = `INSERT INTO studio (studio_name) VALUES (?)`
            const result = await pool.execute(create_studio, [NewAnime.studio])


            let get_studio_id = 'SELECT studio_id FROM studio WHERE studio_name = ?'
            const [raw_studio_id] = await pool.execute(get_studio_id, [NewAnime.studio])
            studio_id = raw_studio_id[0].studio_id

        }
        



        let premium_status = NewAnime.isPremium === "true" ? true : false;
        premium_status = Number(premium_status)



        let isEnded = NewAnime.isEnded === "true" ? true : false;
        isEnded = Number(isEnded)



        let title = NewAnime.title



        let description = NewAnime.plot
 


        let rating = parseFloat(NewAnime.rating)
  


        let episode_number_array = NewAnime.episodeNumberList.split(',')



        let episode_name_array = NewAnime.episodeNameList.split(',')



        console.log(animeImage)
        console.log(animeFiles)

        

        if (episode_number_array.length !== animeFiles.length){
            for (let i=0; i < 5; i++){
                console.log("Misha คั่นหน้า Create โดยที่ไม่รัน SQL เพราะกรอกข้อมูลผิด")
            }
            console.log(`episode_number_array.length: ${episode_number_array.length} animeFiles.length: ${animeFiles.length}`)
            res.send(`wrong number of episode`)
        }
        else {
            let insert_anime =`
        INSERT INTO anime (genre_id, studio_id, premium_status, title, description, anime_image, big_image, release_date, average_rating, sum_view, is_ended)
        VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), ?, ?, ?)
        `

        for (let i = 0; i < genre_id.length; i++){
            const anime_data_array = [genre_id[i], studio_id, premium_status, title, description, animeImage.buffer, bigImage.buffer, rating, 0, isEnded]
            const insert_anime_table_result = await pool.execute(insert_anime, anime_data_array)
            console.log(insert_anime_table_result)
            console.log("insert anime ครั้งที่ ", i + 1)
        }


   
        let insert_anime_genre = `
        INSERT INTO anime_genre (anime_id, genre_id)
        VALUES((SELECT anime_id from anime WHERE title = ? LIMIT 1), ?)
        `

        for (let i = 0; i < genre_id.length; i++){
            const anime_genre_data_array = [NewAnime.title, genre_id[i]]
            const insert_anime_genre_table_result = await pool.execute(insert_anime_genre, anime_genre_data_array)
            console.log(insert_anime_genre_table_result)
            console.log("insert anime_genre ครั้งที่ ", i + 1)
        }


        let insert_episode_table = `
        INSERT INTO episode (anime_id, episode_number, anime_file, title, view, release_date)
        VALUES ((SELECT anime_id from anime WHERE title = ? LIMIT 1), ?, ?, ?, ?, NOW())
        `

        for (let i = 0; i < episode_number_array.length; i++){

            const episode_data_array = [NewAnime.title, episode_number_array[i], animeFiles[i].buffer, episode_name_array[i], 0]
            console.log(episode_data_array)
            const insert_episode_table_result = await pool.execute(insert_episode_table, episode_data_array)
            console.log(insert_episode_table_result)
            console.log("insert episode ครั้งที่", i + 1)
        }

        
        console.log("Misha คั่นหน้า Create")
        res.send(`Create ${NewAnime.title} successfully!!`)
        }
    }
    catch (error) {
        console.error("เพิ่มอนิเมะไม่สำเร็จ Error:", error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}