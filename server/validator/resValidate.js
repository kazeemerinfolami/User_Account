//validationResult is a special module in express-validator
const { validationResult } = require("express-validator");

exports.runValidation = (req, res, next) => {
  //next here is the main middleware that will be executed and sent to @ROUTER
  const errors = validationResult(req); //error will be checked
  if (!errors.isEmpty()) {
    return res.status(442).json({
      //442 means recognized input but its incorrect
      error: errors.array()[0].msg, //this will get the error message @validate
    });
  }
  //the resValidator servers as a MIDDLEWARE that will me used at the @route to make sure the user input is correct beforE IT get to the @CONTROLLER
  next();
};
