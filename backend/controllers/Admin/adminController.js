const pool = require('../../models/database');

module.exports = async (req, res) =>{
    try {
        const Username = req.query.username

        const admin_auth = `SELECT * FROM admin WHERE username = ?`
        const user_table = `SELECT username FROM user`
        


        try {
            const [rows, fields] = await pool.execute(admin_auth, [Username]);
            
            if (rows.length > 0) {
                // Admin with the provided username exists
                console.log('Admin found:', rows[0]);
                res.json({adminName:rows[0].username})
            } else {
                // Admin with the provided username does not exist
                console.log('Admin not found');
                res.json({adminName:"you are not admin"})
            }
        } catch (error) {
            // Handle query execution error
            console.error('Error Auth admin:', error);
        }


        console.log("Misha คั่นหน้า Admin")
    }
    catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}