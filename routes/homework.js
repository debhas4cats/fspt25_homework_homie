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
  
  
    AND h.due_date BETWEEN CURDATE() AND CURDATE() + INTERVAL 5 DAY
    ORDER BY h.due_date;`
  
  try {
    const results = await db(query);
    res.status(200).json({ data: results.data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
//endpoint that will get the subject name from a specific subject id
//snippet needed for Postman test: localhost:5000/homework/subjects/6
router.get('/subjects/:subjectId', async (req, res) => {
  const subjectId = req.params.subjectId;
  const query = `SELECT name FROM subjects WHERE id = ${subjectId}`;
  
  try {
    const result = await db(query);
    if (result.data.length === 0) {
      return res.status(404).json({ error: 'Subject not found' });
    }
    res.status(200).json({ subjectName: result.data[0].name });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE endpoint to delete a homework assignment
// code snippet example needed for Postman test: localhost:5000/homework/homeworks/14
router.delete('/homeworks/:id', async (req, res) => {
  const homeworkId = req.params.id;

  try {
 
    const deleteJunctionQuery = `
      DELETE FROM students_subjects_homeworks
      WHERE homeworkID = ${homeworkId}`;

    await db(deleteJunctionQuery);

    const deleteHomeworkQuery = `
      DELETE FROM homeworks
      WHERE id = ${homeworkId}`;

    await db(deleteHomeworkQuery);

    res.status(200).json({ message: 'Homework assignment deleted successfully' });
  } catch (error) {
    console.error('Error deleting homework:', error);
    res.status(500).json({ error: 'An error occurred while deleting the homework assignment' });
  }
});


//POST endpoint to create a new homework assignment
//VERSION 1
// router.post('/', async (req, res) => {
//   const { assignment, description, due_date, priority, subjectId, studentId, teacherId } = req.body;

//   console.log('Received POST request to /homework');
//   console.log('Request Body:', req.body);

//   const insertHomeworkQuery = `
//     INSERT INTO homeworks (assignment, description, due_date, priority)
//     VALUES ('${assignment}', '${description}', '${due_date}', '${priority}')`;

//   try {
//     console.log('This is my insertHomeworkQuery', insertHomeworkQuery);

//     // Insert new homework assignment into the homeworks table
//     const result = await db(insertHomeworkQuery);

//     console.log('This is my result', result);

//     if (result.error) {
//       throw new Error('Failed to add homework');
//     }

//     const homeworkId = result.data.insertId;

//     // If necessary, insert corresponding record into the students_subjects_homeworks junction table
//     if (subjectId && studentId && teacherId) {
//       const insertJunctionQuery = `
//         INSERT INTO students_subjects_homeworks (studentID, subjectID, teacherID, homeworkID)
//         VALUES ('${studentId}', '${subjectId}', '${teacherId}', '${homeworkId}')`;

//       console.log('This is my insertJunctionQUERY', insertJunctionQuery);
//       const junctionResult = await db(insertJunctionQuery);

//       console.log('INSERT JUNCTION RESULTS:', junctionResult);
//     }

//     // Retrieve the inserted homework data from the database
//     const getInsertedHomeworkQuery = `
//       SELECT * FROM homeworks WHERE id = '${homeworkId}'`;

//     const insertedHomework = await db(getInsertedHomeworkQuery);

//     console.log('Inserted homework:', insertedHomework);

//     res.status(201).json({ 
//       message: 'Homework assignment added successfully', 
//       homework: insertedHomework.data[0]
//     });
//   } catch (error) {
//     console.error('Error executing query:', error);
//     res.status(500).json({ error: error.message });
//   }
// });
// VERSION 2
// router.post('/', async (req, res) => {
//   const { assignment, description, due_date, priority } = req.body;

//   console.log('Received POST request to /homework');
//   console.log('Request Body:', req.body);

//   const insertHomeworkQuery = `
//     INSERT INTO homeworks (assignment, description, due_date, priority)
//     VALUES ('${assignment}', '${description}', '${due_date}', '${priority}')`;

//   try {
//     console.log('This is my insertHomeworkQuery', insertHomeworkQuery);

//     // Insert new homework assignment into the homeworks table
//     const result = await db( `SELECT *FROM homeworks WHERE id= LAST_INSERT_ID();`);
 
//     console.log('This is my result', result);

//     if (result.error) {
//       throw new Error('Failed to add homework');
//     }

//     const homeworkId = result.data.insertId;

//     // Retrieve the inserted homework data from the database
//     const getInsertedHomeworkQuery = `
//       SELECT * FROM homeworks WHERE id = '${homeworkId}'`;

//     const insertedHomework = await db(getInsertedHomeworkQuery);

//     console.log('Inserted homework:', insertedHomework);

//     res.status(201).json({ 
//       message: 'Homework assignment added successfully', 
//       homework: insertedHomework.data[0]
//     });
//   } catch (error) {
//     console.error('Error executing query:', error);
//     res.status(500).json({ error: error.message });
//   }
// });
// VERSION 3
router.post('/', async (req, res) => {
  const { assignment, description, due_date, priority } = req.body;

  console.log('Received POST request to /');
  console.log('Request Body:', req.body);

  // Convert boolean values to integers
  const completedInt = 0; // Assuming you've removed completed and pastdue from the request body
  const pastdueInt = 0;

  const insertHomeworkQuery = `
    INSERT INTO homeworks (assignment, description, due_date, priority, completed, pastdue)
    VALUES ('${assignment}', '${description}', '${due_date}', '${priority}', ${completedInt}, ${pastdueInt})`;

  try {
    console.log('This is my insertHomeworkQuery', insertHomeworkQuery);

    // Insert new homework assignment into the homeworks table
    const result = await db(insertHomeworkQuery);
    console.log('This is my result', result);

    // Retrieve the ID of the last inserted record
    const lastInsertedIdResult = await db('SELECT LAST_INSERT_ID() AS lastInsertId');
    const lastInsertedId = lastInsertedIdResult.data[0].lastInsertId;

    // Fetch the homework data based on the last inserted ID
    const fetchHomeworkQuery = `
      SELECT * FROM homeworks WHERE id = ${lastInsertedId}`;

    // Execute the fetch query to get the last inserted homework's data
    const fetchedHomeworkResult = await db(fetchHomeworkQuery);
    const insertedHomework = fetchedHomeworkResult.data[0];

    console.log('Inserted homework:', insertedHomework);

    res.status(201).json({
      message: 'Homework assignment added successfully',
      homework: insertedHomework
    });
  } catch (error) {
    console.error("Error executing query:", error);
    res.status(500).send("Internal server error");
  }
});




module.exports = router;
