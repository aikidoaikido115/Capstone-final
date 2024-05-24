

module.exports = (req, res) =>{
    const auth = req.auth
    res.json(auth)
}