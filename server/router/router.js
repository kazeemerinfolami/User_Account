const express = require("express");
const router = express.Router();

const {
  signup,
  accountActivated,
  signIn,
  forgotPassword,
  resetPassword,
} = require("../controllers/controller");
//we import the @validator/validate from the @resValidator
//imported forgotPasswordValidator and resetPasswordValidator from the @validate
const {
  userSignupValidator,
  userSignInValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
} = require("../validator/validate");
const { runValidation } = require("../validator/resValidate");

//now we in the route.post form the client..
//CLIENTS GETS THE signup link MAKE SOME INPUTS-> VERIFIED BY userSignupValidator ->IF ERR IT WILL BE REJECTED ND AN ERR MSG runValidation/ELSE CLIENT WILL BE DIRECTED TO-> signup
router.post("/signup", userSignupValidator, runValidation, signup); //MIDDLEWARE
router.post("/account_activation", accountActivated); // gotten from the @controller, after a user has received a mail and  authenticated/ saved to the dataBase nd ready for login
router.post("/signin", userSignInValidator, runValidation, signIn);

//forgot rest password middleware
router.put(
  "/forgot-password",
  forgotPasswordValidator,
  runValidation,
  forgotPassword
);
router.put(
  "/reset-password",
  resetPasswordValidator,
  runValidation,
  resetPassword
);

module.exports = router;
