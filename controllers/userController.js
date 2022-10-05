const { mongo, default: mongoose } = require("mongoose");
const User = require("../models/user.js");
const Session = require("../models/session.js");
const bcrypt = require("bcrypt");
const { body, validationResult } = require("express-validator"); //Data parsing
const passport = require("passport");
const { query } = require("express");

// Display list of all User.
exports.init = (req, res, next) => {
  res.json({ Message: "Hello, welcome to the users page" });
};

// Display list of all User.
exports.register_new_user = [
  //Trim data
  //Add extra data validation
  body("username", "User name required").trim().isLength({ min: 1 }).escape(),
  body("email", "Email is required").trim().isLength({ min: 1 }).escape(),
  body("password", "Longer password is required")
    .trim()
    .isLength({ min: 2 })
    .escape(), //update this

  // Process request after validation and sanitization.
  async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const user = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
      date_registered: Date.now(),
    });

    if (!errors.isEmpty()) {
      // There are errors. Return data and erros as JSON
      res.json({
        user,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid.
      // Check if User with same name already exists.
      User.findOne({ username: req.body.username }).exec(
        (err, found_message_copy) => {
          if (err) {
            return next(err);
          }

          if (found_message_copy) {
            // User exists
            res.json({ message: "Username already exists." });
          } else {
            user.save((err) => {
              if (err) {
                return next(err);
              }
              res.json({ message: "User successfully added to database" });
            });
          }
        }
      );
    }
  },
];

exports.user_login_post = (req, res, next) => {
  passport.authenticate("local", function (err, user, info) {
    if (err) {
      return res.status(400).json({ errors: err });
    }
    if (!user) {
      return res.status(400).json({ errors: "No user found" });
    }
    req.logIn(user, function (err) {
      if (err) {
        return res.status(400).json({ errors: err });
      }
      return res.status(200).json({ success: `logged in ${user.id}` });
    });
  })(req, res, next);
};

exports.user_login_get = (req, res, next) => {
  res.json({
    Message: "Hello, welcome to the users login page :). Please sign in",
  });
};

exports.user_logout = (req, res) => {
  res.clearCookie("connect.sid").json("Logged out");
};

exports.get_user_logged_in = (req, res, next) => {
  if (!req.user.id) {
    res.status(403).json("Could not find user. Please log in");
  }
  const query = req.user.id;

  Session.findOne({ session: { $regex: query, $options: "i" } }).exec(
    (err, user) => {
      if (err) {
        return next(err);
      }

      if (user) {
        // User session exists. Extract time
        if (user.expires.valueOf() > Date.now().valueOf()) {
          res.status(200).json({ message: "Users session is still valid" });
        } else {
          res
            .status(403)
            .json({ message: "User found, session expired. Access forbidden" });
        }
      } else {
        res.status(403).json({ message: "User not found. Access forbidden" });
      }
    }
  );
};
