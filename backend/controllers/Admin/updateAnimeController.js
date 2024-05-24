const pool = require('../../models/database');

//set ไว้ 1GB
pool.execute('SET global max_allowed_packet = 1073741824')
  .then(() => {
    console.log('max_allowed_packet set successfully now you can upload file 1GB per row');
  })
  .catch(err => {
    console.error('Error setting max_allowed_packet: ' + err.stack);
  });

module.exports = async (req, res) =>{
    try {

        const UpdateAnime = req.body
        let [animeImage , bigImage, animeFiles] = ["api not change image", "api not change big","api not change mp4 file"]

        let old_animeFiles

        try{
            

            animeFiles = req.files['animeFile'];
            if (animeFiles === undefined){
                animeFiles = "api not change mp4 file"

                let get_old_animeFiles = `
                    SELECT anime_file FROM episode WHERE anime_id IN (
                    SELECT anime_id FROM anime
                    WHERE title = ?
                )`

                old_animeFiles = await pool.execute(get_old_animeFiles,[UpdateAnime.old_title])
            }


            try{
                animeImage = req.files['animeImage'][0];
            }
            catch (error){
                console.log("ไม่ใส่รูปปกมา")
            }
            try{
                bigImage = req.files['bigImage'][0];
            }
            catch (error){
                console.log("ไม่ใส่รูปใหญ่มา")
            }
            
            
        }
        catch (error){
            console.log("Error เพราะ user ไม่ใส่รูป/ไฟล์ หรือใส่ไม่ครบทั้ง 2 อย่าง")
        }
        
        console.table(UpdateAnime)
        console.log(animeImage)
        console.log(animeFiles)



        const genre_array = UpdateAnime.genre.split(",")
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
        // console.log("รันตรงนี้ได้ก่อน error ", UpdateAnime.genre)
        const [raw_genre_id] = await pool.execute(get_genre_id, genre_array)
        const genre_id = raw_genre_id.map(element => element.genre_id)

        
        let studio_id;
        try {
            let get_studio_id = 'SELECT studio_id FROM studio WHERE studio_name = ?'
            const [raw_studio_id] = await pool.execute(get_studio_id, [UpdateAnime.studio])
            studio_id = raw_studio_id[0].studio_id

        } catch (error) {
            console.log("error ตรง try catch: ",error)
            console.log("สร้าง row ใหม่ใน sql แทนเพราะมันไม่เคยมี studio")
            let create_studio = `INSERT INTO studio (studio_name) VALUES (?)`
            const result = await pool.execute(create_studio, [UpdateAnime.studio])

 
            let get_studio_id = 'SELECT studio_id FROM studio WHERE studio_name = ?'
            const [raw_studio_id] = await pool.execute(get_studio_id, [UpdateAnime.studio])
            studio_id = raw_studio_id[0].studio_id
            // console.log(studio_id)
        }


        let premium_status = UpdateAnime.isPremium === "true" ? true : false;
        premium_status = Number(premium_status)
        // console.log(premium_status)


        let isEnded = UpdateAnime.isEnded === "true" ? true : false;
        isEnded = Number(isEnded)
        // console.log(isEnded)


        let title = UpdateAnime.title
        // console.log(title)


        let description = UpdateAnime.plot
        // console.log(description)


        let rating = parseFloat(UpdateAnime.rating)
        // console.log(rating)


        let episode_number_array = UpdateAnime.episodeNumberList.split(',')
        // console.log(episode_number_array)


        let episode_name_array = UpdateAnime.episodeNameList.split(',')
        // console.log(episode_name_array)

        const get_episode_id = async (title) => {
            let get_first_anime_id = `SELECT anime_id FROM anime WHERE title = ?`
            let first_anime_id = await pool.execute(get_first_anime_id, [title])
            first_anime_id = first_anime_id[0][0].anime_id
            // console.log("เมะ id",first_anime_id)

            let find_episode_id = `SELECT episode_id FROM episode WHERE anime_id = ?`
            let episode_id = await pool.execute(find_episode_id, [first_anime_id])

            return episode_id
        }


        let old_episode_id = await get_episode_id(UpdateAnime.old_title)


        let delete_before_insert_episode = `
        DELETE FROM episode
        WHERE anime_id IN (
            SELECT anime_id FROM anime
            WHERE title = ?
        )`

        //ถ้าเป็นเรื่องที่มี comment จะติด constraints
        let delete_before_insert_anime_genre =
        `
        DELETE FROM anime_genre
        WHERE anime_id IN (
            SELECT anime_id FROM anime
            WHERE title = ?
        )
        `



        //step 1
        let create_temp_comment_reply = `CREATE TEMPORARY TABLE temp_comment_reply LIKE comment_reply`
        let create_temp_comment = `CREATE TEMPORARY TABLE temp_comment LIKE comment`
        let create_temp_fly_comment = `CREATE TEMPORARY TABLE temp_fly_comment LIKE fly_comment`

        //step 2
        let insert_temp_comment_reply = `INSERT INTO temp_comment_reply SELECT * FROM comment_reply`
        let insert_temp_comment = `INSERT INTO temp_comment SELECT * FROM comment`
        let insert_temp_fly_comment = `INSERT INTO temp_fly_comment SELECT * FROM fly_comment`

        //step 3
        let disable_constraints = `SET FOREIGN_KEY_CHECKS = 0`
        let enable_constraints = `SET FOREIGN_KEY_CHECKS = 1`
        
        //step 4

        let truncate_comment_reply = `TRUNCATE TABLE comment_reply`
        let truncate_comment = `TRUNCATE TABLE comment`
        let truncate_fly_comment = `TRUNCATE TABLE fly_comment`

        let reinsert_comment_reply = `INSERT INTO comment_reply SELECT * FROM temp_comment_reply`
        let reinsert_comment = `INSERT INTO comment SELECT * FROM temp_comment`
        let reinsert_fly_comment = `INSERT INTO fly_comment SELECT * FROM temp_fly_comment`

        //step 5 

        let drop_temp_comment_reply = `DROP TEMPORARY TABLE temp_comment_reply`
        let drop_temp_comment = `DROP TEMPORARY TABLE temp_comment`
        let drop_temp_fly_comment = `DROP TEMPORARY TABLE temp_fly_comment`






        //step1 จริง
        let create_temp_array = [create_temp_comment_reply, create_temp_comment, create_temp_fly_comment]


        for (let i of create_temp_array){
            await pool.execute(i)
        }

        console.log("step1 ผ่าน")

        //step2 จริง

        let insert_temp_array = [insert_temp_comment_reply, insert_temp_comment, insert_temp_fly_comment]
        for (let i of insert_temp_array){
            await pool.execute(i)
        }
        console.log("step2 ผ่าน")
        
        //Step3 จริง
        let delete_before_insert_array = [delete_before_insert_episode, delete_before_insert_anime_genre]

        await pool.execute(disable_constraints)
        for (let i of delete_before_insert_array){
            await pool.execute(i, [UpdateAnime.old_title])
        }
        await pool.execute(enable_constraints)

        
        console.log("step3 ผ่าน")
        
        //step4 จริง
        let truncate_array = [truncate_comment_reply, truncate_comment, truncate_fly_comment]

        await pool.execute(disable_constraints)
        for (let i of truncate_array) {
            await pool.execute(i)
        }
        await pool.execute(enable_constraints)
        console.log("step4 ส่วน truncate ผ่าน")

        let reinsert_array = [reinsert_comment_reply, reinsert_comment, reinsert_fly_comment]

        await pool.execute(disable_constraints)
        for (let i of reinsert_array) {
            await pool.execute(i)
        }
        await pool.execute(enable_constraints)

        console.log("step4 ส่วน reinsert ผ่าน")

        //step5 จริง

        let drop_array = [drop_temp_comment_reply, drop_temp_comment, drop_temp_fly_comment]

        await pool.execute(disable_constraints)
        for (let i of drop_array) {
            await pool.execute(i)
        }
        await pool.execute(enable_constraints)

        console.log("step5 ผ่าน")




        let delete_comment_reply = `
        DELETE FROM comment_reply
        WHERE comment_id IN (
            SELECT comment_id FROM comment WHERE episode_id = ?
        )
        `

        let delete_comment = `
        DELETE FROM comment
        WHERE episode_id = ?
        `

        let delete_fly_comment = `
        DELETE FROM fly_comment
        WHERE episode_id = ?
        `

        for (let i = 0; i < old_episode_id[0].length; i++) {
            let result1 = await pool.execute(delete_comment_reply, [old_episode_id[0][i].episode_id])
            let result2 = await pool.execute(delete_comment, [old_episode_id[0][i].episode_id])
            let result3 = await pool.execute(delete_fly_comment, [old_episode_id[0][i].episode_id])
            console.log("ลบเม้นตอนที่", i+1)
        }



        let get_anime_id_array =
        `
        SELECT anime_id FROM anime WHERE title = ?
        `
        const [anime_id_array] = await pool.execute(get_anime_id_array, [UpdateAnime.old_title])

        let update_anime;
        if (animeImage === "api not change image" && bigImage === "api not change big") {
            console.log("ตกเงื่อนไขไม่ input ทั้ง 2 รูป")
            //ถ้าไม่มีรูปก็ไม่ต้องอัพเดทรูป
            update_anime =
            `
            UPDATE anime SET 
            genre_id = ?,
            studio_id = ?,
            premium_status = ?,
            is_ended = ?,
            title = ?,
            description = ?,
            average_rating = ?
            WHERE anime_id = ?
            `


            const old_genre_array = UpdateAnime.old_genre.split(",")
            console.log(old_genre_array)


            if (genre_array.length == old_genre_array.length){
                console.log("ตกเงื่อนไข ==")
                for (let i = 0; i < genre_id.length; i++){
                    // console.log(genre_id[i])
                    const anime_data_array = [genre_id[i], studio_id, premium_status, isEnded, title, description, rating, anime_id_array[i].anime_id]
                    const update_anime_table_result = await pool.execute(update_anime, anime_data_array)
                    console.log(update_anime_table_result)
                    console.log("update anime ครั้งที่ ", i + 1)
                }
            }
            else if (genre_array.length < old_genre_array.length){
                console.log("ตกเงื่อนไข <")

                

                let diff_row = Math.abs(genre_array.length - old_genre_array.length);
                let get_row = `SELECT anime_id FROM anime WHERE title = ? ORDER BY anime_id DESC LIMIT ${diff_row}`
                const query_for_get_row = await pool.execute(get_row, [UpdateAnime.old_title])

                console.log(diff_row)
                console.log(get_row)

                console.log("กำลังจะรัน loop แรก")
                console.log(query_for_get_row[0])
                let delete_unuse_row =`DELETE FROM anime WHERE anime_id = ?`
                for (let i = 0; i< query_for_get_row[0].length; i++){
                    const [result] = await pool.execute(delete_unuse_row, [query_for_get_row[0][i].anime_id])
                    
                }
                console.log("ตอนนี้รัน loop แรกได้")
                for (let i = 0; i < genre_id.length; i++){

                    const anime_data_array = [genre_id[i], studio_id, premium_status, isEnded, title, description, rating, anime_id_array[i].anime_id]
                    const update_anime_table_result = await pool.execute(update_anime, anime_data_array)
                    console.log(update_anime_table_result)
                    console.log("update anime ครั้งที่ ", i + 1)
                }
                console.log("ตอนนี้รัน loop 2 ได้")
                
            }
            else if (genre_array.length > old_genre_array.length){
                console.log("ตกเงื่อนไข >")

                
                let diff_row = Math.abs(genre_array.length - old_genre_array.length);


                console.log(diff_row)
  

                console.log("กำลังจะรัน loop แรก")



                let create_dummy_row =
                `
                INSERT INTO anime (genre_id, premium_status , studio_id, title, description, anime_image, big_image, release_date, average_rating, sum_view, is_ended)
                SELECT genre_id, premium_status , studio_id, title, description, anime_image, big_image, release_date, average_rating, sum_view, is_ended
                FROM anime
                WHERE title = ?
                ORDER BY anime_id DESC
                LIMIT 1
                `
  
                for (let i = 0; i < diff_row; i++){
                    const [result] = await pool.execute(create_dummy_row, [UpdateAnime.old_title])
                }
                console.log("ตอนนี้รัน loop แรกได้")

                
                const [current_anime_id_array] = await pool.execute(get_anime_id_array, [UpdateAnime.old_title])
                console.table(current_anime_id_array)
                for (let i = 0; i < genre_id.length; i++){

                    const anime_data_array = [genre_id[i], studio_id, premium_status, isEnded, title, description, rating, current_anime_id_array[i].anime_id]
                    const update_anime_table_result = await pool.execute(update_anime, anime_data_array)
                    console.log(update_anime_table_result)
                    console.log("update anime ครั้งที่ ", i + 1)
                }
                console.log("ตอนนี้รัน loop 2 ได้")
            }
        }
        else if (animeImage !== "api not change image" && bigImage === "api not change big") {
            console.log("ตกเงื่อนไข input รูปปก แต่ไม่ input รูปใหญ่")
            update_anime =
            `
            UPDATE anime SET 
            genre_id = ?,
            studio_id = ?,
            premium_status = ?,
            is_ended = ?,
            title = ?,
            description = ?,
            anime_image = ?,
            average_rating = ?
            WHERE anime_id = ?
            `

            const old_genre_array = UpdateAnime.old_genre.split(",")
            console.log(old_genre_array)


            if (genre_array.length == old_genre_array.length){
                console.log("ตกเงื่อนไข ==")
                for (let i = 0; i < genre_id.length; i++){
                    // console.log(genre_id[i])
                    const anime_data_array = [genre_id[i], studio_id, premium_status, isEnded, title, description, animeImage.buffer, rating, anime_id_array[i].anime_id]
                    const update_anime_table_result = await pool.execute(update_anime, anime_data_array)
                    console.log(update_anime_table_result)
                    console.log("update anime ครั้งที่ ", i + 1)
                }
            }
            else if (genre_array.length < old_genre_array.length){
                console.log("ตกเงื่อนไข <")

                
     
                let diff_row = Math.abs(genre_array.length - old_genre_array.length);
                let get_row = `SELECT anime_id FROM anime WHERE title = ? ORDER BY anime_id DESC LIMIT ${diff_row}`
                const query_for_get_row = await pool.execute(get_row, [UpdateAnime.old_title])

                console.log(diff_row)
                console.log(get_row)

                console.log("กำลังจะรัน loop แรก")
                console.log(query_for_get_row[0])
                let delete_unuse_row =`DELETE FROM anime WHERE anime_id = ?`
                for (let i = 0; i< query_for_get_row[0].length; i++){
                    const [result] = await pool.execute(delete_unuse_row, [query_for_get_row[0][i].anime_id])
                    
                }
                console.log("ตอนนี้รัน loop แรกได้")
                for (let i = 0; i < genre_id.length; i++){
                    // console.log(genre_id[i])
                    const anime_data_array = [genre_id[i], studio_id, premium_status, isEnded, title, description, animeImage.buffer, rating, anime_id_array[i].anime_id]
                    const update_anime_table_result = await pool.execute(update_anime, anime_data_array)
                    console.log(update_anime_table_result)
                    console.log("update anime ครั้งที่ ", i + 1)
                }
                console.log("ตอนนี้รัน loop 2 ได้")
                
            }
            else if (genre_array.length > old_genre_array.length){
                console.log("ตกเงื่อนไข >")

                let diff_row = Math.abs(genre_array.length - old_genre_array.length);
                let get_row = `SELECT anime_id FROM anime WHERE title = ? ORDER BY anime_id DESC LIMIT ${diff_row}`
                const query_for_get_row = await pool.execute(get_row, [UpdateAnime.old_title])

                console.log(diff_row)
                console.log(get_row)

                console.log("กำลังจะรัน loop แรก")
                console.log(query_for_get_row[0])


                let create_dummy_row =
                `
                INSERT INTO anime (genre_id, premium_status , studio_id, title, description, anime_image, big_image, release_date, average_rating, sum_view, is_ended)
                SELECT genre_id, premium_status , studio_id, title, description, anime_image, big_image, release_date, average_rating, sum_view, is_ended
                FROM anime
                WHERE title = ?
                ORDER BY anime_id DESC
                LIMIT 1
                `

                for (let i = 0; i< diff_row; i++){
                    const [result] = await pool.execute(create_dummy_row, [UpdateAnime.old_title])
                }
                console.log("ตอนนี้รัน loop แรกได้")

           
                const [current_anime_id_array] = await pool.execute(get_anime_id_array, [UpdateAnime.old_title])
                console.table(current_anime_id_array)
                for (let i = 0; i < genre_id.length; i++){
                    // console.log(genre_id[i])
                    const anime_data_array = [genre_id[i], studio_id, premium_status, isEnded, title, description, animeImage.buffer, rating, current_anime_id_array[i].anime_id]
                    const update_anime_table_result = await pool.execute(update_anime, anime_data_array)
                    console.log(update_anime_table_result)
                    console.log("update anime ครั้งที่ ", i + 1)
                }
                console.log("ตอนนี้รัน loop 2 ได้")
                
            }
        }
        else if (animeImage === "api not change image" && bigImage !== "api not change big") {
            console.log("ตกเงื่อนไขไม่ input รูปปก แต่ input รูปใหญ่")
            update_anime =
            `
            UPDATE anime SET 
            genre_id = ?,
            studio_id = ?,
            premium_status = ?,
            is_ended = ?,
            title = ?,
            description = ?,
            big_image = ?,
            average_rating = ?
            WHERE anime_id = ?
            `

            const old_genre_array = UpdateAnime.old_genre.split(",")
            console.log(old_genre_array)


            if (genre_array.length == old_genre_array.length){
                console.log("ตกเงื่อนไข ==")
                for (let i = 0; i < genre_id.length; i++){
                    // console.log(genre_id[i])
                    const anime_data_array = [genre_id[i], studio_id, premium_status, isEnded, title, description, bigImage.buffer, rating, anime_id_array[i].anime_id]
                    const update_anime_table_result = await pool.execute(update_anime, anime_data_array)
                    console.log(update_anime_table_result)
                    console.log("update anime ครั้งที่ ", i + 1)
                }
            }
            else if (genre_array.length < old_genre_array.length){
                console.log("ตกเงื่อนไข <")

                let diff_row = Math.abs(genre_array.length - old_genre_array.length);
                let get_row = `SELECT anime_id FROM anime WHERE title = ? ORDER BY anime_id DESC LIMIT ${diff_row}`
                const query_for_get_row = await pool.execute(get_row, [UpdateAnime.old_title])

                console.log(diff_row)
                console.log(get_row)

                console.log("กำลังจะรัน loop แรก")
                console.log(query_for_get_row[0])
                let delete_unuse_row =`DELETE FROM anime WHERE anime_id = ?`
                for (let i = 0; i< query_for_get_row[0].length; i++){
                    const [result] = await pool.execute(delete_unuse_row, [query_for_get_row[0][i].anime_id])
                    
                }
                console.log("ตอนนี้รัน loop แรกได้")
                for (let i = 0; i < genre_id.length; i++){
                    // console.log(genre_id[i])
                    const anime_data_array = [genre_id[i], studio_id, premium_status, isEnded, title, description, bigImage.buffer, rating, anime_id_array[i].anime_id]
                    const update_anime_table_result = await pool.execute(update_anime, anime_data_array)
                    console.log(update_anime_table_result)
                    console.log("update anime ครั้งที่ ", i + 1)
                }
                console.log("ตอนนี้รัน loop 2 ได้")
                
            }
            else if (genre_array.length > old_genre_array.length){
                console.log("ตกเงื่อนไข >")

                let diff_row = Math.abs(genre_array.length - old_genre_array.length);
                let get_row = `SELECT anime_id FROM anime WHERE title = ? ORDER BY anime_id DESC LIMIT ${diff_row}`
                const query_for_get_row = await pool.execute(get_row, [UpdateAnime.old_title])

                console.log(diff_row)
                console.log(get_row)

                console.log("กำลังจะรัน loop แรก")
                console.log(query_for_get_row[0])


                let create_dummy_row =
                `
                INSERT INTO anime (genre_id, premium_status , studio_id, title, description, anime_image, big_image, release_date, average_rating, sum_view, is_ended)
                SELECT genre_id, premium_status , studio_id, title, description, anime_image, big_image, release_date, average_rating, sum_view, is_ended
                FROM anime
                WHERE title = ?
                ORDER BY anime_id DESC
                LIMIT 1
                `

                for (let i = 0; i< diff_row; i++){
                    const [result] = await pool.execute(create_dummy_row, [UpdateAnime.old_title])
                }
                console.log("ตอนนี้รัน loop แรกได้")


                const [current_anime_id_array] = await pool.execute(get_anime_id_array, [UpdateAnime.old_title])
                console.table(current_anime_id_array)
                for (let i = 0; i < genre_id.length; i++){
                    // console.log(genre_id[i])
                    const anime_data_array = [genre_id[i], studio_id, premium_status, isEnded, title, description, bigImage.buffer, rating, current_anime_id_array[i].anime_id]
                    const update_anime_table_result = await pool.execute(update_anime, anime_data_array)
                    console.log(update_anime_table_result)
                    console.log("update anime ครั้งที่ ", i + 1)
                }
                console.log("ตอนนี้รัน loop 2 ได้")
                
            }
        }
        else{
            console.log("ตกเงื่อนไข input ทั้งคู่ ทั้งรูปปก และ รูปใหญ่")
            update_anime =
            `
            UPDATE anime SET 
            genre_id = ?,
            studio_id = ?,
            premium_status = ?,
            is_ended = ?,
            title = ?,
            description = ?,
            anime_image = ?,
            big_image = ?,
            average_rating = ?
            WHERE anime_id = ?
            `

            const old_genre_array = UpdateAnime.old_genre.split(",")
            console.log(old_genre_array)

 
            if (genre_array.length == old_genre_array.length){
                console.log("ตกเงื่อนไข ==")
                for (let i = 0; i < genre_id.length; i++){
                    // console.log(genre_id[i])
                    const anime_data_array = [genre_id[i], studio_id, premium_status, isEnded, title, description, animeImage.buffer, bigImage.buffer, rating, anime_id_array[i].anime_id]
                    const update_anime_table_result = await pool.execute(update_anime, anime_data_array)
                    console.log(update_anime_table_result)
                    console.log("update anime ครั้งที่ ", i + 1)
                }
            }
            else if (genre_array.length < old_genre_array.length){
                console.log("ตกเงื่อนไข <")

                let diff_row = Math.abs(genre_array.length - old_genre_array.length);
                let get_row = `SELECT anime_id FROM anime WHERE title = ? ORDER BY anime_id DESC LIMIT ${diff_row}`
                const query_for_get_row = await pool.execute(get_row, [UpdateAnime.old_title])

                console.log(diff_row)
                console.log(get_row)

                console.log("กำลังจะรัน loop แรก")
                console.log(query_for_get_row[0])
                let delete_unuse_row =`DELETE FROM anime WHERE anime_id = ?`
                for (let i = 0; i< query_for_get_row[0].length; i++){
                    const [result] = await pool.execute(delete_unuse_row, [query_for_get_row[0][i].anime_id])
                    
                }
                console.log("ตอนนี้รัน loop แรกได้")
                for (let i = 0; i < genre_id.length; i++){
                    // console.log(genre_id[i])
                    const anime_data_array = [genre_id[i], studio_id, premium_status, isEnded, title, description, animeImage.buffer, bigImage.buffer, rating, anime_id_array[i].anime_id]
                    const update_anime_table_result = await pool.execute(update_anime, anime_data_array)
                    console.log(update_anime_table_result)
                    console.log("update anime ครั้งที่ ", i + 1)
                }
                console.log("ตอนนี้รัน loop 2 ได้")
                
            }
            else if (genre_array.length > old_genre_array.length){
                console.log("ตกเงื่อนไข >")

                let diff_row = Math.abs(genre_array.length - old_genre_array.length);
                let get_row = `SELECT anime_id FROM anime WHERE title = ? ORDER BY anime_id DESC LIMIT ${diff_row}`
                const query_for_get_row = await pool.execute(get_row, [UpdateAnime.old_title])

                console.log(diff_row)
                console.log(get_row)

                console.log("กำลังจะรัน loop แรก")
                console.log(query_for_get_row[0])

  
                let create_dummy_row =
                `
                INSERT INTO anime (genre_id, premium_status , studio_id, title, description, anime_image, big_image, release_date, average_rating, sum_view, is_ended)
                SELECT genre_id, premium_status , studio_id, title, description, anime_image, big_image, release_date, average_rating, sum_view, is_ended
                FROM anime
                WHERE title = ?
                ORDER BY anime_id DESC
                LIMIT 1
                `
     
                for (let i = 0; i< diff_row; i++){
                    const [result] = await pool.execute(create_dummy_row, [UpdateAnime.old_title])
                }
                console.log("ตอนนี้รัน loop แรกได้")

     
                const [current_anime_id_array] = await pool.execute(get_anime_id_array, [UpdateAnime.old_title])
                console.table(current_anime_id_array)
                for (let i = 0; i < genre_id.length; i++){
                    // console.log(genre_id[i])
                    const anime_data_array = [genre_id[i], studio_id, premium_status, isEnded, title, description, animeImage.buffer, bigImage.buffer, rating, current_anime_id_array[i].anime_id]
                    const update_anime_table_result = await pool.execute(update_anime, anime_data_array)
                    console.log(update_anime_table_result)
                    console.log("update anime ครั้งที่ ", i + 1)
                }
                console.log("ตอนนี้รัน loop 2 ได้")
                
            }
        }

        //INSERT กลับเข้าไปใหม่ สำหรับ table ที่ปัญหาจำนวน row อาจไม่เท่าเดิมกับ version เก่าก่อน UPDATE
        
        let insert_anime_genre_after_update = `
        INSERT INTO anime_genre (anime_id, genre_id)
        VALUES((SELECT anime_id from anime WHERE title = ? LIMIT 1), ?)
        `
        for (let i = 0; i < genre_id.length; i++){
            const anime_genre_data_array = [UpdateAnime.title, genre_id[i]]
            const result = await pool.execute(insert_anime_genre_after_update, anime_genre_data_array)
            console.log(result)
            console.log("insert anime_genre after update ครั้งที่ ", i + 1)
        }


        let insert_episode_after_update
        if(animeFiles === "api not change mp4 file"){
            insert_episode_after_update =
            `
            INSERT INTO episode (anime_id, episode_number, anime_file, title, view, release_date)
            VALUES ((SELECT anime_id from anime WHERE title = ? LIMIT 1), ?, ?, ?, ?, NOW())
            `

            for (let i = 0; i < episode_number_array.length; i++){
                // console.log("เข้ามาใน loop ก่อน error")
                const episode_data_array = [UpdateAnime.title, episode_number_array[i], old_animeFiles[0][i].anime_file, episode_name_array[i], 0]
                console.log(episode_data_array)
                const result = await pool.execute(insert_episode_after_update, episode_data_array)
                console.log(result)
                console.log("insert episode after update ครั้งที่", i + 1)
            }
        }
        else {
            let insert_episode_after_update =
            `
            INSERT INTO episode (anime_id, episode_number, anime_file, title, view, release_date)
            VALUES ((SELECT anime_id from anime WHERE title = ? LIMIT 1), ?, ?, ?, ?, NOW())
            `
            for (let i = 0; i < episode_number_array.length; i++){
                // console.log("เข้ามาใน loop ก่อน error")
                const episode_data_array = [UpdateAnime.title, episode_number_array[i], animeFiles[i].buffer, episode_name_array[i], 0]
                console.log(episode_data_array)
                const result = await pool.execute(insert_episode_after_update, episode_data_array)
                console.log(result)
                console.log("insert episode adter update ครั้งที่", i + 1)
            }
        }
        

        console.log("Misha คั่นหน้า Update")
        res.send(`Update ${UpdateAnime.title} successfully!!`)
    }
    catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}