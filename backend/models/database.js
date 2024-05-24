const mysql = require('mysql2');


let host = 'localhost'

// if (process.env.NODE_ENV === 'production') {
//     host = 'mysql-server'
// }

if (process.env.NODE_ENV === 'production') {
    host = 'backend-db-1'
}

const pool = mysql.createPool({
  host: host,
  user: 'root',
  password: 'css222',
  database: 'anime_acs',
  charset: 'utf8mb4', // Set the character set to UTF-8 MB4
  collation: 'utf8mb4_unicode_ci', // <--- Add this lineม
  encoding: 'utf8mb4', // <--- Add this line
});

console.log('mysql2 pool ready')



module.exports = pool.promise(); // Export the promise-based pool