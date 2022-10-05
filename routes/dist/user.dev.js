"use strict";

var express = require("express");

var passport = require("passport");

var authCheck = require("../authCheck"); //checking if the user is already logged in or not


var router = express.Router();

var userController = require("../controllers/userController"); //GET//

/* GET users listing. */


router.get("/", userController.init);
router.get("/login", authCheck.checkNotAuthenticated, userController.user_login_get); //Check if the current session is still valid   ???

router.get("/auth", userController.get_user_logged_in); //POST//
//create new user from form.

router.post("/register", userController.register_new_user);
router.post("/login", authCheck.checkNotAuthenticated, userController.user_login_post);
router.get("/logout", authCheck.checkAuthenticated, userController.user_logout);
module.exports = router;