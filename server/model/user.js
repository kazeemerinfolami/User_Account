const mongoose = require("mongoose");
const crypto = require("crypto");

//schema
const user_Schema = new mongoose.Schema(
  {
    nickName: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    user_Password: {
      type: String,
      required: true,
    },
    salt: {
      type: String,
    },
    reset_Password_link: {
      data: String,
      default: "",
    },
    role: {
      type: String,
      default: "Subscriber",
    },
  },
  {
    timestamps: true,
  }
);
//virtual
user_Schema
  .virtual("password")
  .set(function (password) {
    this._password = password;
    this.salt = this.makeSalt();
    this.user_Password = this.encryptPassword(password);
  })
  .get(function () {
    return this._password;
  });

//methods
user_Schema.methods = {
  //Authenticate was created to compare the user login password if it marge with the one in the database
  authenticate: function (plainText) {
    return this.encryptPassword(plainText) === this.user_Password;
  },
  encryptPassword: function (password) {
    if (!password) return "";
    try {
      return crypto
        .createHmac("sha1", this.salt)
        .update(password)
        .digest("hex");
    } catch (err) {
      return "";
    }
  },
  makeSalt: function () {
    return Math.round(new Date().valueOf() * Math.random()) + "";
  },
};

module.exports = mongoose.model("User", user_Schema);
