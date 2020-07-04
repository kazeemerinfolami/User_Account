//.......client/users have a direct contact with the controller..here is where the client signup/ do any interaction with the model/server
const User = require("../model/user");

//......create a user input where it will be saved on the database BUT =>
//.....before that we send the registered client a verification mail to restrict clients without a valid mail to be added to our database
//....>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> UNCOMMENT FORM EXPORTS TO RES.JSON(this makes us create a user account without email verification to prevent user without active email..below is the verification signup)....
//user signUp without email verification.....>>>>..below
// exports.signup = (req, res) => {
//   //......here the user can signup, but we have to create a middleware for validating the user inputs (@module validator)..
//   //......before it gets to the controller
//   //.....console.log("User info", req.body),
//   const { nickName, name, email, password } = req.body;

//   //.....this will make us have a unique user in the database by checking the database if the email provided by signup user is existing / not
//   User.findOne({ email }).exec((err, user) => {
//     if (user) {
//       return res.status(400).json({
//         error: "Email has been taken",
//       });
//     }
//   });
//   //.....if email is not found in the database..that means the user is unique and this data can be saved on the database.
//   let newUser = new User({ nickName, name, email, password });
//   newUser.save((err, success) => {
//     if (err) {
//       console.log("sign up error", err);
//       return res.status(400).json({
//         error: err,
//       });
//     }
//     res.json({
//       message: "signup successful! please signIn",
//     });
//   });
// };
// user signup with email verification, if verified, user data will be created in the dataBase and directed to the UI signin page
//require jwt for generating user token..
const jwt = require("jsonwebtoken");
const _ = require("lodash");
const expressJWT = require("express-jwt");
require("dotenv").config();
const sgMail = require("@sendgrid/mail");
const nodeMailer = require("nodemailer");
const user = require("../model/user");
const { forgotPasswordValidator } = require("../validator/validate");
//set the sendGrid apiKey
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.signup = (req, res) => {
  const { name, email, password } = req.body;
  //if signup email is found in the dataBase send err
  //"exec" - execute is gotten from mongodb
  User.findOne({ email }).exec((err, user) => {
    if (user) {
      return res.status(400).json({
        error: "Email has been taken",
      });
    } //else
    //we generate a token by add the user information, where user information, secretKey, and expire date will be decoded
    const token = jwt.sign(
      { name, email, password },
      process.env.JWT_ACCOUNT_ACTIVATION,
      { expiresIn: "10m" }
    );
    //create where the verification email will be sent
    const emailMessage = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: `Account activation link`,
      html: `<h2><i>Please ${name} use the following link to activate your account</i></h2>
            <p>${process.env.CLIENT_URL}/auth/activate/${token}</p>
            <hr />
            <p>This email may contain sensitive information</p>
            `,
    }; //this will send a verification email to the user

    const transport = nodeMailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_FROM,
        pass: process.env.CREATORPASS,
      },
    });
    transport.sendMail(emailMessage, function (error, info) {
      if (error) {
        console.log("send email verification err", err);
        return json({
          message: err.message,
        });
      } else {
        return res.json({
          message: `email sent to ${email}, follow the instructions on your email`,
        });
      }
    });

    //  sgMail
    // //   .send(emailMessage)
    // //   .then(() => {
    // //     //if no err
    // //     return res.json({
    // //       message: `email sent to ${email}, follow the instructions on your email`,
    // //     });
    // //   }) // if err
    // //   .catch((err) => {
    // //     console.log("send email verification err", err);
    // //     return json({
    // //       message: err.message,
    // //     });
    // //   });
  });
};

//now we make sure our signup user has received a mail and has passed the verification stage so the user can be saved in the dataBase

//created "account_activated" to @route for , when a user has gotten verification mail and then clicked on, they can be directed/ get a confirmation
//message the the user has bee authenticated and saved to ur dataBase ..

exports.accountActivated = (req, res) => {
  // user information that was decoded in jwt token
  const { token } = req.body;
  //this is to verify if the token is real, if the token haven't expire, if the token is still validate
  if (token) {
    jwt.verify(
      token,
      process.env.JWT_ACCOUNT_ACTIVATION,
      (err, decodedToken) => {
        if (err) {
          console.log("JWT verification activation err", err);
          return res.status(401).json({
            error: "expired Token, signup again",
          });
        } // and if no err, the user can be saved to our dataBase
        //this will extract the user information that was decoded in jwt token so it can be saved to the dataBase
        const { name, email, password } = jwt.decode(token);
        //dataBase
        const user = new User({
          name,
          email,
          password,
        });
        // this saves the user to the dataBase but the user wont receive a confirmation mail that he has been accepted/ authenticated

        //   user.save((err, userDataSaved) => {
        //     if (err) {
        //       console.log("user account activation error", err);
        //       return res.status(401).json({
        //         error: "error saving the user in dataBase",
        //       });
        //     }
        //     return res.json({
        //       message: "signup success. Please signIn",
        //     });
        //   });

        // this saves the user to dataBase with email notification that he has been accepted

        user.save((err, userDataSaved) => {
          if (err) {
            return res.status(400).json({
              error: "error saving the user",
            });
          }
          const userMessage = {
            from: process.env.EMAIL_FROM,
            to: email,
            subject: `You are welcome ${name}`,
            html: `<h2><i>activated account</i></h2>
                      <p>Noplace like home, Just smile and make the sun bright</p>
                      <hr />
                      <p>This email may contain sensitive information</p>
                      `,
          };
          const transport = nodeMailer.createTransport({
            service: "gmail",
            auth: {
              user: process.env.EMAIL_FROM,
              pass: process.env.CREATORPASS,
            },
          });
          transport.sendMail(userMessage, function (error, info) {
            if (error) {
              console.log("send email verification err", err);
              return json({
                message: err.message,
              });
            } else {
              return res.json({
                message: `Welcome ${name}, it's a Big world, enjoy the moment`,
              });
            }
          });
          // sgMail
          //   .send(userMessage)
          //   .then(() => {
          //     //if no err
          //     return res.json({
          //       message: "signup success. Please signIn",
          //     });
          //   })
          //   .catch((err) => {
          //     console.log("error saving the user in dataBase", err);
          //     return json({
          //       message: err.message,
          //     });
          //   });
        });
      }
    ); // if a user tries to signIn/ signup without passing the mail authentication/ verified
  } else {
    return res.json({
      message: "Something went wrong please try again.",
    });
  }
};

exports.signIn = (req, res) => {
  const { email, password } = req.body;
  //to check if a user exist while signing up
  User.findOne({ email }).exec((err, user) => {
    if (err || !user) {
      //if email don't match any in the dataBase
      return res.status(400).json({
        error: "User with that email does not exist. please signup",
      });
    } //else
    // if email match but password is wrong....this will be checked @model
    //remember password has been hashed @models @methods @ if authenticate = hashed_password then this will be true/ false
    if (!user.authenticate(password)) {
      return res.status(400).json({
        error: "Email and password do not exist",
      });
    } //else
    //when a user email and password is correct then we create a token ...and get some user details form the database and then it will be sent to the frontend
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    const { _id, name, role } = user; //what will be gotten from the database then sent to the frontend

    return res.json({
      token,
      user: { _id, name, role },
    });
  });
};
//makes only the user/ logged in client access his account even when typed on the url
exports.requireSignIn = expressJWT({
  secret: process.env.JWT_SECRET, //middleWare validates every token request
});

//creating a middleware for the admin, to limit the subscribers from updating son data

exports.adminMiddleware = (req, res, next) => {
  User.findById({ _id: req.user._id }).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "User not found",
      });
    }
    if (user.role != "admin") {
      return res.status(400).json({
        error: "Admin resource. Access denied",
      });
    }
    req.profile = user;
    next();
  });
};
//forgotPassword, resetPassword;

exports.forgotPassword = (req, res) => {
  const { email } = req.body;
  User.findOne({ email }, (err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "User with that email does not exist",
      });
    }
    const resetToken = jwt.sign(
      { _id: user._id },
      process.env.JWT_RESET_PASSWORD,
      {
        expiresIn: "10m",
      }
    );
    //create where the password reset link email will be sent
    const passwordResetMessage = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: `Password reset link`,
      html: `<h2><i>Please ${name} use the following link to reset your password</i></h2>
            <p>${process.env.CLIENT_URL}/auth/password/reset/${resetToken}</p>
            <hr />
            <p>This email may contain sensitive information</p>
            `,
    };
    const transport = nodeMailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_FROM,
        pass: process.env.CREATORPASS,
      },
    });
    return user.updateOne({ reset_Password_link: token }, (err, success) => {
      if (err) {
        console.log("reset password link error");
        return res.status(400).json({
          error: "Database connection error on user password request",
        });
      } else {
        transport.sendMail(passwordResetMessage, function (error, info) {
          if (error) {
            console.log("send email verification err", err);
            return json({
              message: err.message,
            });
          } else {
            return res.json({
              message: `reset password token has been sent to ${email}, follow the instructions on your email`,
            });
          }
        });
      }
    });
    //this will send a password reset token email to the user
  });
};
exports.resetPassword = (req, res) => {
  const { reset_Password_link, newPassword } = req.body;
  if (reset_Password_link) {
    jwt.verify(reset_Password_link, process.env.JWT_RESET_PASSWORD, function (
      err,
      decoded
    ) {
      if (err) {
        return res.status(400).json({
          error: "Expired link, try again",
        });
      }

      User.findOne({ reset_Password_link }, (err, user) => {
        if (err || !user) {
          return res.status(400).json({
            error: "something went wrong try again",
          });
        }
        const updatedFields = {
          password: newPassword,
          reset_Password_link: "",
        };
        user = _.extend(user, updatedFields);
        user.save((err, result) => {
          if (err) {
            return res.status(400).json({
              error: "error resetting your password",
            });
          }
          res.json({
            message: "password changed",
          });
        });
      });
    });
  }
};
