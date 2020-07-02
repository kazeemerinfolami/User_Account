const User = require("../model/user");
const user = require("../model/user");
//get a user from the database after login
exports.read = (req, res) => {
  const userId = req.params.id;
  User.findById(userId).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "User not found",
      });
    } // this is to hide the user password and salt after getting his details from the server
    user.user_password = undefined;
    user.salt = undefined;
    // err
    res.json(user);
  });
};

exports.update = (req, res) => {
  //console.log("update user-req", req.user, "UPDATE_DATa", req.body);
  const { name, password } = req.body;

  //this makes you make an update your profile on the database/ name, password etc
  User.findOne({ _id: req.user._id }, (err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "User not found",
      });
    }
    if (!name) {
      return res.status(400).json({
        error: "Name is required",
      });
    } else {
      user.name = name;
    }
    if (password) {
      if (password.length < 8) {
        return res.status(400).json({
          error: "Password should be min 8 characters long",
        });
      } else {
        user.password = password;
      }
    }
    user.save((err, updatedUser) => {
      if (err) {
        console.log("user update error", err);
        return res.status(400).json({
          error: "User update failed",
        });
      }
      updatedUser.user_password = undefined;
      updatedUser.salt = undefined;
      res.json(updatedUser);
    });
  });
};
