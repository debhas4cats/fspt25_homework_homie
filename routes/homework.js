const express = require('express'); //require express module and creates an express application
const router = express.Router(); // has methods for routing http requests and controls how the application behaves
const db = require("../model/helper"); //imports a module named helper from the model directory -- contains helper functions or utilities related to interacting with a database.
// Express middleware to parse JSON request bodies
router.use(express.json());

// internal server url = http://localhost:4000/homework

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send({ title: 'this is the homepage' });
});
//THIS ENDPOINT MODIFIED WITH STUDENT SPECIFIC HOMEWORK
// Endpoint to get homework for a specific subject
//this will be the endpoint needed for the individual subject pages
//snippet needed for Postman test: localhost:4000/homework/subjects/5/students/1/homework
router.get('/subjects/:subjectId/students/:studentId/homework', async (req, res) => {
  const subjectId = req.params.subjectId;
  //for after authentication is implemented
  const studentId = req.params.studentId;
  console.log('THIS IS THE STUDENTID', studentId)
  const query = `SELECT h.id,h.assignment, h.description, h.due_date, h.priority, h.completed, h.pastdue,
    CONCAT(t.firstname, ' ', t.lastname) AS teacher_name
    FROM students_subjects_homeworks ssh
    JOIN homeworks h ON ssh.homeworkID = h.id
    JOIN teachers t ON ssh.teacherID = t.id
    WHERE ssh.subjectID = ${subjectId}
    AND ssh.studentID = ${studentId}`;
    
     //WHERE statement needs to be hard coded with studentID 1 until after authentication is implemented
  try {
    const results = await db(query, [subjectId, studentId]);
    console.log('THIS IS THE RESULTS', query)
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
  const query = `SELECT  h.assignment, h.description, h.due_date, h.priority, h.completed, h.pastdue,
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

// POST endpoint to add a new homework assignment
//I want to add new homework to the homeworks table in MySQL database
//code snippet example needed for Postman test: localhost:4000/api/homework
router.post('/', async (req, res) => {
  //I need to collect everything I will need for this in my req.body
  const { assignment, description, due_date, priority, studentId, subjectId, teacherId } = req.body;

// console.log('THIS IS THE REQ.BODY:', req.body);

  try {
    //I will await db() a new variable that I will use to insert the new homework into the homeworks table
    const addHomeworkResult = await db(`
    INSERT INTO homeworks (assignment, description, due_date, priority)
    VALUES ('${assignment}', '${description}', '${due_date}', '${priority}');
    SELECT LAST_INSERT_ID() AS id;
   `);
// console.log('This is my ADDHOMEWORKRESULT', addHomeworkResult);
// console.log('This is my addHomeworkResultID', addHomeworkResult.data[0].id);

//if the homework wasn't successfully added, I will throw an error with a message that the homework wasn't successfully added
    if (addHomeworkResult.error) {
      throw new Error('Failed to add homework');
    }
    //from the results of the successful await db() call, I will take the id of the homework that was just added as and create a variable. 
    const homeworkId = addHomeworkResult.data[0].insertId;

   //I will then use that vaiable as well as the subjectID and teacherID and insert them into the junction table students_subjects_homeworks
   //to do this I need a query to insert the new homework into the junction table students_subjects_homeworks 
   const insertJunctionQuery = await db(`
      INSERT INTO students_subjects_homeworks (studentID, subjectID, homeworkID, teacherID)
      VALUES ('${studentId}', '${subjectId}', '${homeworkId}','${teacherId}')`);
//if the homework id was successfully added, I will get back the results of what I inserted as well as a message
      const InsertedHomeworkQuery = await db(`SELECT * FROM students_subjects_homeworks WHERE homeworkID = LAST_INSERT_ID();`) ;

// console.log('This is my INSERTEDHOMEWORKQUERY', InsertedHomeworkQuery);
//if the homework wasn't successfully added, I will throw an error with a message that the homework wasn't successfully added
    if (insertJunctionQuery.error) {
      throw new Error('Failed to add entry to junction table');
    }

    res.status(201).json({ 
      message: 'Homework assignment added successfully', 
      homework: InsertedHomeworkQuery.data[0]
    });
  } catch (error) {
console.error('Error executing query:', error);
    res.status(500).json({ error: error.message });
  }
});

// PUT endpoint to update a homework assignment
//code snippet example needed for Postman test: localhost:5000/homework/{homework_id}
router.put('/:id', async (req, res) => {
  // Extract the ID of the homework entry to update
  const homeworkId = req.params.id;

  // Extract the fields to update from the request body
  const { assignment, description, due_date, priority, completed } = req.body;

  try {
    // Initialize an empty array to store the field updates
    const updates = [];

    // Construct the UPDATE query dynamically based on the fields present in the request body
    if (assignment) updates.push(`assignment = '${assignment}'`);
    if (description) updates.push(`description = '${description}'`);
    if (due_date) updates.push(`due_date = '${due_date}'`);
    if (priority) updates.push(`priority = '${priority}'`);
    if (completed !== undefined) updates.push(`completed = ${completed ? 1 : 0}`);

    // Check if any fields were provided for update
    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields provided for update' });
    }

    // Join the updates array into a comma-separated string
    const setClause = updates.join(', ');

    // Construct the UPDATE query
    const updateQuery = `
      UPDATE homeworks 
      SET 
        ${setClause}
      WHERE id = ${homeworkId}`;

    // Execute the UPDATE query
    await db(updateQuery);

    // If the update is successful, send a success response
    res.status(200).json({ message: 'Homework assignment updated successfully' });
  } catch (error) {
    // If an error occurs during the update, send an error response
    console.error('Error updating homework:', error);
    res.status(500).json({ error: 'An error occurred while updating the homework assignment' });
  }
});

// GET endpoint to get all the subjects
//Code snippet for Postman test: localhost:5000/homework/subjects
// router.get('/subjects', async (req, res) => {
//   const query = `SELECT * FROM subjects`;
//   try {
//     const results = await db(query);
//     res.status(200).json({ data: results.data });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });


router.get('/subjects', async (req, res) => {
  const query = `
  SELECT DISTINCT subjects.id  AS subjectID, subjects.name AS subject_name, teachers.firstname, teachers.lastname
FROM students_subjects_homeworks
JOIN subjects ON students_subjects_homeworks.subjectID = subjects.id
JOIN teachers ON students_subjects_homeworks.teacherID = teachers.id;
  `;
  try {
    const results = await db(query);
    res.status(200).json({ data: results });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;