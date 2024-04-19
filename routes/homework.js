const express = require('express'); //require express module and creates an express application
const router = express.Router(); // has methods for routing http requests and controls how the application behaves
const db = require("../model/helper"); //imports a module named helper from the model directory -- contains helper functions or utilities related to interacting with a database.
// Express middleware to parse JSON request bodies
router.use(express.json());

// internal server url = http://localhost:5000/homework

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send({ title: 'Express' });
});

module.exports = router;
