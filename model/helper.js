require("dotenv").config();
const mysql = require("mysql");

// Create a MySQL connection pool
const pool = mysql.createPool({ //a connection pool is more efficient for handling multiple queries
    connectionLimit: 10, // Adjust this according to your needs
    host: process.env.DB_HOST,
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASS || "root",
    database: process.env.DB_NAME || "homework",
    multipleStatements: true
});

// Wrap MySQL query with a promise
module.exports = function db(query, values = []) {
    return new Promise((resolve, reject) => { // returns a promise for better handling of asynchronous operations
        pool.getConnection((err, connection) => {
            if (err) {
                console.error('Error connecting to database:', err);
                reject(err);
                return;
            }

            connection.query(query, values, (err, result) => {
                if (err) {
                    console.error('Error executing query:', err);
                    connection.release();
                    reject(err);
                    return;
                }

                connection.release();

                const results = {
                    data: [],
                    error: null
                };

                // Process the result
                if (!result.length) {
                    if (result.affectedRows === 0) {
                        results.error = "Action not complete";
                    }
                } else if (result[0].constructor.name == "RowDataPacket") {
                    // Push each row (RowDataPacket) to data
                    result.forEach(row => results.data.push(row));
                } else if (result[0].constructor.name == "OkPacket") {
                    // Push the first item in result list to data (this accounts for situations
                    // such as when the query ends with SELECT LAST_INSERT_ID() and returns an insertId)
                    results.data.push(result[0]);
                }

                resolve(results);
            });
        });
    });
};
