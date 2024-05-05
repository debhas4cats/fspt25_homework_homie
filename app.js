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
app.use('/api/homework', homeworkRouter); 
app.use('/api/student', studentRouter);
module.exports = app;