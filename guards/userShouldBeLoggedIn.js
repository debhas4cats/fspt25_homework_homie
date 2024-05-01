var jwt = require("jsonwebtoken");
require("dotenv").config();

const supersecret = process.env.SUPER_SECRET;

function userShouldBeLoggedIn(req, res, next) {
    //get the token from the header
const token = req.headers["authorization"].replace(/^Bearer\s/, "");
console.log("THIS IS MY TOKEN", token)
//if there is no token, return an error
if (!token) {
  res.status(401).send({ message: "please provide a token" });
} else {
//if there is a token, verify the token is valid
jwt.verify(token, supersecret,  async function (err, decoded) {
//if the token is not valid, return an error (using the cb function from the verify method)
if(err) {
  res.status(401).send({ message: err.message });
} else {
  //if the token is valid, get the user profile from the token
  //everything is awesome
  const user_id = decoded.userid;
  //I want to provide the user_id to the next function
  //I can do this by adding a new property to the req object and the value will be the user_id decoded from the token
 req.user_id = user_id;
 //I want to call the next function.  
 next();
}
})
}

}

module.exports = userShouldBeLoggedIn;