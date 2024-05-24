module.exports = (req, res, next) =>{
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} มาจาก Middle ware ครับผม`);
    next(); // Pass control to the next middleware function
}