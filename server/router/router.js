const express = require("express");
const router = express.Router();
const { signup } = require("../controllers/controller");
//we import the @validator/validate then the @resValidator
const { userSignupValidator } = require("../validator/validate");
const { runValidation } = require("../validator/resValidate");

//now we in the route.post form the client..
//CLIENTS GETS THE signup link MAKE SOME INPUTS-> VERIFIED BY userSignupValidator ->IF ERR IT WILL BE REJECTED ND AN ERR MSG runValidation/ELSE CLIENT WILL BE DIRECTED TO-> signup
router.post("/signup", userSignupValidator, runValidation, signup); //MIDDLEWARE

module.exports = router;
