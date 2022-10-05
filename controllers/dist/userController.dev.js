"use strict";

var _require = require("mongoose"),
    mongo = _require.mongo,
    mongoose = _require["default"];

var User = require("../models/user.js");

var Session = require("../models/session.js");

var _require2 = require("luxon"),
    DateTime = _require2.DateTime;

var bcrypt = require("bcrypt");

var _require3 = require("express-validator"),
    body = _require3.body,
    validationResult = _require3.validationResult; //Data parsing


var passport = require("passport");

var _require4 = require("express"),
    query = _require4.query; // Display list of all User.


exports.init = function (req, res, next) {
  res.json({
    Message: "Hello, welcome to the users page"
  });
}; // Display list of all User.


exports.register_new_user = [//Trim data
//Add extra data validation
body("username", "User name required").trim().isLength({
  min: 1
}).escape(), body("email", "Email is required").trim().isLength({
  min: 1
}).escape(), body("password", "Longer password is required").trim().isLength({
  min: 2
}).escape(), //update this
// Process request after validation and sanitization.
function _callee(req, res, next) {
  var errors, hashedPassword, user;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          // Extract the validation errors from a request.
          errors = validationResult(req);
          _context.next = 3;
          return regeneratorRuntime.awrap(bcrypt.hash(req.body.password, 10));

        case 3:
          hashedPassword = _context.sent;
          user = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
            date_registered: Date.now()
          });

          if (errors.isEmpty()) {
            _context.next = 10;
            break;
          }

          // There are errors. Return data and erros as JSON
          res.json({
            user: user,
            errors: errors.array()
          });
          return _context.abrupt("return");

        case 10:
          // Data from form is valid.
          // Check if User with same name already exists.
          User.findOne({
            username: req.body.username
          }).exec(function (err, found_message_copy) {
            if (err) {
              return next(err);
            }

            if (found_message_copy) {
              // User exists
              res.json({
                message: "Username already exists."
              });
            } else {
              user.save(function (err) {
                if (err) {
                  return next(err);
                }

                res.json({
                  message: "User successfully added to database"
                });
              });
            }
          });

        case 11:
        case "end":
          return _context.stop();
      }
    }
  });
}];

exports.user_login_post = function (req, res, next) {
  passport.authenticate("local", function (err, user, info) {
    if (err) {
      return res.status(400).json({
        errors: err
      });
    }

    if (!user) {
      return res.status(400).json({
        errors: "No user found"
      });
    }

    req.logIn(user, function (err) {
      if (err) {
        return res.status(400).json({
          errors: err
        });
      }

      return res.status(200).json({
        success: "logged in ".concat(user.id)
      });
    });
  })(req, res, next);
};

exports.user_login_get = function (req, res, next) {
  res.json({
    Message: "Hello, welcome to the users login page :). Please sign in"
  });
};

exports.user_logout = function (req, res) {
  res.clearCookie("connect.sid").json("Logged out");
};

exports.get_user_logged_in = function (req, res, next) {
  if (!req.user.id) {
    res.status(403).json("Could not find user. Please log in");
  }

  var query = req.user.id;
  Session.findOne({
    session: {
      $regex: query,
      $options: "i"
    }
  }).exec(function (err, user) {
    if (err) {
      return next(err);
    }

    if (user) {
      // User session exists. Extract time
      if (user.expires.valueOf() > Date.now().valueOf()) {
        res.status(200).json({
          message: "Users session is still valid"
        });
      } else {
        res.status(403).json({
          message: "User found, session expired. Access forbidden"
        });
      }
    } else {
      res.status(403).json({
        message: "User not found. Access forbidden"
      });
    }
  });
};