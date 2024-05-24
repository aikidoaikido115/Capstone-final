const pool = require('../../models/database');

module.exports = async (req, res) =>{
    try {

        let get_premium_info = `SELECT package_name, price FROM subscription_package`
        let premium_info = await pool.execute(get_premium_info)
        console.log(premium_info)

        let package_name_array = []
        let price_array = []

        for (let i of premium_info[0]) {
            package_name_array.push(i.package_name)
            price_array.push(i.price)
        }


        const responseData = {
            package_name_array:package_name_array,
            price_array:price_array
        }

        console.log(`Misha คั่นหน้า premium Info`)
        console.log(responseData)

        res.json(responseData)


        
    }
    catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}