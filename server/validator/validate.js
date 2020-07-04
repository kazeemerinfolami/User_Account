const { check } = require("express-validator");
//validator to make sure the client/user input a correct info before getting to the controller

exports.userSignupValidator = [
  check("name").not().isEmpty().withMessage("Name required"),
  check("email").isEmail().withMessage("Valid Email required"),
  check("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];
//after this we created a module @validation/validateIndex that send an err message if a client make a wrong input

exports.userSignInValidator = [
  check("email").isEmail().withMessage("Valid Email required"),
  check("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];

//creatin a password recovery mail, where the client can get a recovery mail
//then this was made a middleware at the signup router
exports.forgotPasswordValidator = [
  check("email")
    .not()
    .isEmail() //to make sure that the email session is not empty
    .isEmail()
    .withMessage("Valid Email required"),
];
// for password reset then this was made a middleware at the signup router
exports.resetPasswordValidator = [
  check("newPassword")
    .not()
    .isEmail() //to make sure that the email session is not empty
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),
];
