const mysql = require("mysql");
const pool = mysql.createPool({
  connectionLimit: 10,
  host: "localhost",
  user: "root",
  password: process.env.SQL_CRED,
  database: "test",
});

const db = (query, variables=[]) => {
  return new Promise((resolve, reject) => {
    pool.query(query, variables, function (err, rows, fields) {
      if (err) {
        reject(err);
      }
        resolve(rows, fields);
          
    });
  });
};

module.exports = {db, pool};
