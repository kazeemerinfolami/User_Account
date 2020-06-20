const User = require("../model/user");
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
