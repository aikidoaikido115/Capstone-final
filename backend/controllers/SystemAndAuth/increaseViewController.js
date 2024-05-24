const pool = require('../../models/database')

module.exports = async (req, res) => {
    try {
        const title = req.body.title

        let get_current_view = `SELECT sum_view FROM anime WHERE title = ? ORDER BY anime_id LIMIT 1`
        const current_view = await pool.execute(get_current_view, [title])
        const update_view = current_view[0][0].sum_view + 1
        // console.log(update_view)

        let increase_view_by_title = `UPDATE anime SET sum_view = ? WHERE title = ?`
        await pool.execute(increase_view_by_title, [update_view, title])


        console.log("Misha คั่นหน้าเพิ่มยอดวิว")
        res.send(`ยอดวิวเรื่อง ${title} ถูก += 1 แล้ว`)
    }
    catch (error) {
        console.error("เพิ่มยอดวิวไม่สำเร็จ Error:", error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}