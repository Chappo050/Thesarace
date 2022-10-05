"use strict";

var passport = require("passport"); //Middleware functions


exports.checkAuthenticated = function (req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  res.status(403).json({});
};

exports.checkNotAuthenticated = function (req, res, next) {
  if (req.isAuthenticated()) {
    return res.status(403).json({});
  }

  return next();
};