module.exports = (req, res, next) =>{



    if (req.session.user) {


        req.auth = {valid: true, username:req.session.user}
    }
    else{
        console.log(req.session.user)
        req.auth = {valid:false}
    }
    
    next();
}