const express = require("express");
const router = express.Router();
const db = require("../model/helper");
const fs = require("fs/promises");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const mime = require("mime-types");
const multer = require("multer");
const upload = multer({ dest: "public/img/" });

const getImages = async (req, res) => {
  try {
    const results = await db("SELECT * FROM images;");
    res.send(results.data);
  } catch (err) {
    res.status(500).send(err);
  }
};

router.get("/", getImages);

router.post("/", upload.single("imagefile"), async (req, res) => {
  // file is available at req.file
  const imagefile = req.file;

  // check the extension of the file
  const extension = mime.extension(imagefile.mimetype);

  // create a new random name for the file
  const filename = uuidv4() + "." + extension;

  // grab the filepath for the temporary file
  const tmp_path = imagefile.path;

  // construct the new path for the final file
  const target_path = path.join(__dirname, "../public/img/") + filename;

  try {
    // rename the file
    await fs.rename(tmp_path, target_path);

    // store image in the DB
    const query = `INSERT INTO student_homework_images (student_id, homework_id, image_data) VALUES (${studentId}, ${homeworkId}, ${filename} )`;
    const result = await db(query, [req.body.studentId, req.body.homeworkId, target_path]);
    // await db(`INSERT INTO images (path) VALUES ("${filename}");`);
    getImages(req, res);
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;