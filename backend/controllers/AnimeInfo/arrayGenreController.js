const pool = require('../../models/database');
const fs = require('fs');


module.exports = async (req, res) =>{
    try {

        let sql = `SELECT genre_name FROM genre`
        const data = await pool.query(sql)
        console.log(data)




        let genre_array = []


        for (let i = 0; i < data[0].length; i++){
            genre_array.push(data[0][i].genre_name)

        }



        const responseData = {
            AnimeGenre: genre_array
        }

        console.log("Misha คั่นหน้า array genre")
        console.log(responseData)

        res.json(responseData)
    }
    catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}