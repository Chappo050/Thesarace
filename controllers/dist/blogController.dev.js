"use strict";

var _require = require("express-validator"),
    body = _require.body,
    validationResult = _require.validationResult; //Data parsing


var _require2 = require("mongoose"),
    mongoose = _require2["default"];

var post = require("../models/post.js");

var Post = require("../models/post.js");

var User = require("../models/user.js");

exports.create_new_post = [//Trim data
//Add extra data validation
body("message", "Please enter a message").trim().isLength({
  min: 1
}).escape(), // Process request after validation and sanitization.
function (req, res, next) {
  // Extract the validation errors from a request.
  var errors = validationResult(req); // Create a post object with escaped and trimmed data.

  var current_time = Date.now();
  var post = new Post({
    user_details: req.user.id,
    message: req.body.message,
    post_time: current_time,
    isPublic: req.body.isPublic
  });

  if (!errors.isEmpty()) {
    // There are errors. Return data and erros as JSON
    res.json({
      user: user,
      errors: errors.array()
    });
    return;
  } else {
    // Data from form is valid.
    // Check if post with same date/time by user already exists.
    Post.findOne({
      message: req.body.message,
      post_time: current_time
    }).exec(function (err, found_message_copy) {
      if (err) {
        return next(err);
      }

      if (found_message_copy) {
        // Post exists.
        res.json({
          message: "Post already exists."
        });
      } else {
        post.save(function (err) {
          if (err) {
            return next(err);
          }

          res.json({
            message: "Post successfully added to database"
          });
        });
      }
    });
  }
}];

exports.count_posts = function (req, res, next) {
  Post.countDocuments({}).exec(function (err, count) {
    if (err) {
      return next(err);
    } //Successful, so send JSON


    res.json(count);
  });
};

exports.count_posts_user = function (req, res, next) {
  var query = {}; //Not logged in

  if (req.params.userId && req.query.auth === "false") {
    var userId = req.params.userId;
    query = {
      user_details: userId,
      isPublic: true
    };
  } //Logged in
  else {
      var _userId = req.params.userId;
      query = {
        user_details: _userId
      };
    }

  Post.countDocuments(query).exec(function (err, count) {
    if (err) {
      return next(err);
    } //Successful, so send JSON


    res.json(count);
  });
};

exports.get_single_post = function (req, res, next) {
  Post.find({
    _id: req.params.postId
  }, {
    __v: 0
  }).exec(function (err, post) {
    if (err) {
      return next(err);
    } //Successful, so send JSON


    res.json(post);
  });
}; // Display list of all books.


exports.get_post_list = function (req, res, next) {
  Post.find({
    isPublic: true
  }, {
    __v: 0
  }).sort({
    post_time: -1
  }).skip(req.query.pointer).limit(10).populate("user_details", {
    username: 1
  }).exec(function (err, list_posts) {
    if (err) {
      return next(err);
    } //Successful, so send JSON


    res.json(list_posts);
  });
}; // Display list of all books.


exports.get_user_post_list = function (req, res, next) {
  var query = {}; //Not logged in

  if (req.params.userId && req.query.auth === "false") {
    var userId = req.params.userId;
    query = {
      user_details: userId,
      isPublic: true
    };
  } //Logged in
  else {
      var _userId2 = req.params.userId;
      query = {
        user_details: _userId2
      };
    }

  Post.find(query, {
    __v: 0
  }).sort({
    post_time: -1
  }).skip(req.query.pointer).limit(10).populate("user_details", {
    username: 1
  }).exec(function (err, list_posts) {
    if (err) {
      return next(err);
    } //Successful, so send JSON


    res.json(list_posts);
  });
};

exports.edit_post = [//Trim data
//Add extra data validation
body("message", "Please enter a message").trim().isLength({
  min: 1
}).escape(), // Process request after validation and sanitization.
function (req, res, next) {
  // Extract the validation errors from a request.
  var errors = validationResult(req);

  if (!errors.isEmpty()) {
    // There are errors. Return data and erros as JSON
    res.json({
      user: user,
      errors: errors.array()
    });
    return;
  } else {
    // Data from form is valid.
    //Update message and isPublic, not that it is edited
    Post.findOneAndUpdate({
      _id: mongoose.Types.ObjectId(req.params.postId)
    }, {
      message: req.body.message,
      isPublic: req.body.isPublic
    }, {
      "new": true
    }, function (err, info) {
      if (err) return res.json({
        success: false,
        err: err
      });
      res.status(200).json(info);
    });
  }
}]; // Delete post

exports.delete_post = function (req, res, next) {
  Post.findByIdAndRemove({
    _id: req.query.postId
  }).exec(function (err) {
    if (err) {
      return next(err);
    } //Successful, so send JSON


    res.json("Post deleted successfully");
  });
};

exports.check_current_user = function (req, res, next) {
  try {
    if (req.user.id === req.params.userId) {
      res.status(200).json({
        logged: true
      });
    } else {
      res.status(200).json({
        logged: false
      });
    }
  } catch (error) {
    next(err);
  }
};