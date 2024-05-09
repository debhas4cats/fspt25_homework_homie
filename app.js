const cors = require('cors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const homeworkRouter = require('./routes/homework');
const studentRouter = require('./routes/student');
const calendarRouter = require('./routes/calendar'); // Assuming your router file is named calendarRouter.js

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

app.use('/api/calendar', calendarRouter); // Use the calendarRouter for /api/calendar routes

app.use((req, res, next) => {
  console.log('Received request:', req.method, req.url);
  next();
});

app.get("/", function(req, res, next) {
  res.send("Access the API at path /homework");
});

app.get("/api/homework", function(req, res, next) {
  res.send("Access the homework API");
});

app.get("/api/student", function(req, res, next) {
  res.send("Access the student API");
});

module.exports = app;