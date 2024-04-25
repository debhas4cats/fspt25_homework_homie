const express = require('express'); //require express module and creates an express application
const router = express.Router(); // has methods for routing http requests and controls how the application behaves
const db = require("../model/helper"); //imports a module named helper from the model directory -- contains helper functions or utilities related to interacting with a database.
// Express middleware to parse JSON request bodies
router.use(express.json());

// internal server url = http://localhost:5000/homework

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send({ title: 'this is the homepage' });
});
//THIS ENDPOINT WILL BE MODIFIED WITH STUDENT SPECIFIC HOMEWORK
// Endpoint to get homework for a specific subject
//this will be the endpoint needed for the individual subject pages
//snippet needed for Postman test: localhost:5000/homework/subjects/6/homework
router.get('/subjects/:subjectId/students/:studentId/homework', async (req, res) => {
  const subjectId = req.params.subjectId;
  //for after authentication is implemented
  const studentId = req.params.studentId;
  const query = `SELECT h.assignment, h.description, h.due_date, h.priority, h.completed, h.pastdue,
    CONCAT(t.firstname, ' ', t.lastname) AS teacher_name
    FROM students_subjects_homeworks ssh
    JOIN homeworks h ON ssh.homeworkID = h.id
    JOIN teachers t ON ssh.teacherID = t.id
    WHERE ssh.subjectID = ${subjectId}
   AND ssh.studentID = ${studentId}`;
    //for after authentication is implemented
     
     // AND ssh.studentID = 1`;
     //WHERE statement needs to be hard coded with studentID 1 until after authentication is implemented
  try {
    const results = await db(query);
    res.status(200).json({ data: results.data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
//THIS ENDPOINT WILL BE MODIFIED WITH QUERY PARAM 
//Endpoint that will get all homework for a specific student 
//based on today's date going out 6 days from today
//this should be the endpoint for the dashboard display
//snippet needed for Postman test: localhost:5000/homework/students/1/homework
router.get('/students/:studentId/homework', async (req, res) => {
  const studentId = req.params.studentId;
 //WHERE statement needs to be hard coded with studentID 1 until after authentication is implemented
  const query = `SELECT h.assignment, h.description, h.due_date, h.priority, h.completed, h.pastdue,
    CONCAT(t.firstname, ' ', t.lastname) AS teacher_name
    FROM students_subjects_homeworks ssh
    JOIN homeworks h ON ssh.homeworkID = h.id
    JOIN teachers t ON ssh.teacherID = t.id
    WHERE ssh.studentID = 1
  
  
    AND h.due_date BETWEEN CURDATE() AND CURDATE() + INTERVAL 6 DAY
    ORDER BY h.due_date;`
  
  try {
    const results = await db(query);
    res.status(200).json({ data: results.data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
