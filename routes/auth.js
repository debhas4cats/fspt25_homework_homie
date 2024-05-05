var express = require("express");
var router = express.Router();
var jwt = require("jsonwebtoken");
var studentLoggedIn = require("../guards/studentLoggedIn");
var db = require("../model/helper");
require("dotenv").config();
var bcrypt = require("bcrypt");

const supersecret = process.env.SUPER_SECRET;

  // POST: LOGIN student
  router.post("/login", async (req, res) => {
    const { username, password } = req.body;
  
    try {
      const results = await db(
        `SELECT * FROM students WHERE username = '${username}'`
      );
      const user = results.data[0];
      if (user) {
        const user_id = user.id;
  
        const correctPassword = await bcrypt.compare(password, user.password);
  
        if (!correctPassword) throw new Error("Incorrect password");
  
        var token = jwt.sign({ user_id }, supersecret);
        res.send({ message: `Hello, ${user.firstname}`, token });
      } else {
        throw new Error("Student does not exist");
      }
    } catch (err) {
      res.status(400).send({ message: err.message });
    }
  });

module.exports = router;
