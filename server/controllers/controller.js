//client/users have a direct contact with the controller..here is where the client signup/ do any interaction with the model/server
const User = require("../model/user");
//create a user input where it will be saved on the database BUT =>
//before that we send the registered client a verification mail to restrict clients without a valid mail to be added to our database
exports.signup = (req, res) => {
  //here the user can signup, but we have to create a middleware for validating the user inputs (@module validator)..
  //before it gets to the controller
  //console.log("User info", req.body),
  const { nickName, name, email, password } = req.body;

  //this will make us have a unique user in the database
  User.findOne({ email }).exec((err, user) => {
    if (user) {
      return res.status(400).json({
        error: "Email has been taken",
      });
    }
  });
  let newUser = new User({ nickName, name, email, password });
  newUser.save((err, success) => {
    if (err) {
      console.log("sign up error", err);
      return res.status(400).json({
        error: err,
      });
    }
    res.json({
      message: "signup successful! please signIn",
    });
  });
};
