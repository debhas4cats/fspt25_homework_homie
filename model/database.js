require("dotenv").config();
const mysql = require("mysql");
const fs = require("fs");

const DB_HOST = process.env.DB_HOST || "127.0.0.1";
const DB_USER = process.env.DB_USER || "root";
const DB_PASS = process.env.DB_PASS || "root";
const DB_NAME = process.env.DB_NAME || "homework";

const con = mysql.createConnection({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASS,
  database: DB_NAME,
  multipleStatements: true
});

con.connect(function(err) {
  if (err) {
    console.error("Error connecting to database:", err);
    return;
  }
  console.log("Connected to database!");

  let sql = fs.readFileSync(__dirname + "/init_db.sql").toString();
  con.query(sql, function(err, result) {
    if (err) {
      console.error("Error creating tables:", err);
      return;
    }
    console.log("Table creation was successful!");
    console.log("Closing connection...");
    con.end();
  });
});
