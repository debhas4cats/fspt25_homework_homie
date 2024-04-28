const cors = require('cors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

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

app.get("/api", function(req, res, next) {
    res.send("Access the API at path /homework");
  });

module.exports = app;
