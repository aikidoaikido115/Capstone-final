const pool = require('../models/database');


let isUserExistSQL =
`SELECT * FROM user
WHERE username = 'aikidoaikido115' `

pool.execute(isUserExistSQL)
.then(result => {
    if (Boolean(result[0][0])){
        console.log(result[0][0])
        console.log(true)
    }
    else {
        console.log(false)
    }
})
.catch(err => console.log(err))
