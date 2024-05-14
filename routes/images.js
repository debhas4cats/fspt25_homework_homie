const express = require("express");
const router = express.Router();
const db = require("../model/helper");
const fs = require("fs/promises");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const mime = require("mime-types");
const multer = require("multer");
const upload = multer({ dest: "public/img/" });
const studentIsLoggedIn = require("../guards/studentIsLoggedIn");

const getImages = async (req, res) => {
  try {
    const files = await fs.readdir(path.join(__dirname, "../public/img"));
    // Send the array of file names as the response
    res.json(files);
  } catch (err) {
    console.error('Error retrieving images:', err);
    res.status(500).send('Error retrieving images');
  }
};

router.get("/", getImages);

router.post("/:homeworkId", upload.single("imagefile"), async (req, res) => {
  const studentId = 1; // Just an example, you should use the actual student ID
  const homeworkId = req.params.homeworkId;

  // Extract the filename from the request
  const filename = req.file.filename;

  // Insert the filename into the database
  const query = `INSERT INTO student_homework_images (student_id, homework_id, image_data) VALUES (${studentId}, ${homeworkId}, '${filename}');`;

  try {
    const result = await db(query);

    // Send the filename back to the client
    res.status(200).json({ filename: filename }); // Send the filename as JSON
  } catch (err) {
    console.error('Error inserting image into database:', err);
    res.status(500).send('Error inserting image into database');
  }
});


module.exports = router;