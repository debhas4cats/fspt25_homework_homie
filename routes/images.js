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
    const results = await db("SELECT * FROM student_homework_images;");
    res.send(results.data);
  } catch (err) {
    res.status(500).send(err);
  }
};

router.get("/", getImages);

//add these after you get Kecia's part
router.post("/:homeworkId", upload.single("imagefile"), async (req, res) => {
    const studentId = 1;
    console.log('THIS IS THE STUDENT ID: ', studentId)

    const homeworkId = req.params.homeworkId;
    console.log('HOMEWORK ID', req.params.homeworkId)
  // file is available at req.file
  const imagefile = req.file;
console.log('THIS IS THE IMAGE FILE: ', imagefile)
  // check the extension of the file
  const extension = mime.extension(imagefile.mimetype);
console.log('THIS IS THE EXTENSION: ', extension)
  // create a new random name for the file
  const filename = uuidv4() + "." + extension;
console.log('THIS IS THE FILENAME: ', filename)
  // grab the filepath for the temporary file
  const tmp_path = imagefile.path;
console.log('THIS IS THE TMP_PATH: ', tmp_path)
  // construct the new path for the final file
  const target_path = path.join(__dirname, "../public/img/") + filename;
console.log('THIS IS THE TARGET_PATH: ', target_path)
  try {
    // rename the file
  const fsRename =  await fs.rename(tmp_path, target_path);
    // console.log('THIS IS fs.rename',fsRename);
    // console.log('Tmp_path: ', tmp_path);
    console.log('Target_path: ', target_path);
   
    // store image in the DB
    const query = `INSERT INTO student_homework_images (student_id, homework_id, image_data) VALUES (${studentId}, ${homeworkId}, '${filename}');`;
    console.log('THIS IS THE QUERY: ', query)
   
    const result = await db(query);
// console.log('THIS IS THE RESULT: ', result)
    // await db(`INSERT INTO images (path) VALUES ("${filename}");`);
    getImages(req, res);
  } catch (err) {
    console.log('Error renaming file: ', err);
    res.status(500).send(err);
  }
});

module.exports = router;