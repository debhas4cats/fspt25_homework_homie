const cors = require('cors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

let homeworkRouter = require('./routes/homework'); //for the homework.js file in the route folder


const app = express();

app.use(cors()); 

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));


app.get("/", function(req, res, next) {
    res.send("Access the API at path /homework");
  });

app.use('/api/homework', homeworkRouter); 




module.exports = app;
