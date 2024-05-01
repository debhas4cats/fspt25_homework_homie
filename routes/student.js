var express = require('express');
var router = express.Router();
const db = require("../model/helper");
var bcrypt = require("bcrypt");
const saltRounds = 10;



//endpoint to get all students
// code snippet for testing in Postman: localhost:5000/api/student
router.get("/", async function(req, res, next) {
  try {
    const result = await db("SELECT * FROM students;");
    res.send(result.data);
  } catch (err) {
    res.status(500).send(err)
  }
});

/* POST a new student */

router.post("/", async function(req, res, next) {
 
    const { firstname, lastname, email, username, avatar, password} = req.body
     const hash = await bcrypt.hash(password, saltRounds);
    console.log(`This is my req.body ${ firstname, lastname, email, username, avatar, password }`)
    if (!req.body) {
      res.status(400).send({
        message: "Please complete the form",
    });
    return;
    }
  
    try {
      await db (
        `INSERT INTO students (firstname, lastname, email, username, avatar, password) 
        VALUES ('${firstname}','${lastname}','${email}','${username}','${avatar}','${hash}');`
        );
      const result = await db("SELECT * FROM students;");
      res.send(result.data);
    } catch (err) {
      res.status(500).send(err)
    }
  });
  module.exports = router;