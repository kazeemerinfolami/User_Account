const { check } = require("express-validator");
//validator to make sure the client/user input a correct info before getting to the controller

exports.userSignupValidator = [
  check("nickName").not().isEmpty().withMessage("UniqueName required"),
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
