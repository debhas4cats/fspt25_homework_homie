const cors = require('cors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var authRouter = require('./routes/auth');
let homeworkRouter = require('./routes/homework'); //for the homework.js file in the route folder
const studentRouter = require('./routes/student');
const app = express();

app.use(cors()); 

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));
app.use('/', indexRouter);
app.use("/api/auth", authRouter);
app.use('/homework', homeworkRouter); 
app.use('/api/student', studentRouter);

app.use((req, res, next) => {
  console.log('Received request:', req.method, req.url);
  next();
app.get("/", function(req, res, next) {
    res.send("Access the API at path /homework");
  });

app.use('/api/homework', homeworkRouter); 
  app.use((req, res, next) => {
    console.log('Received request:', req.method, req.url);
    next();
});

app.get("/", function(req, res, next) {
  res.send("Access the API at path /student");
});

});

module.exports = app;
