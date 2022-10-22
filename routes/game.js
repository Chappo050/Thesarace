var express = require("express");
const passport = require("passport");
const authCheck = require("../authCheck"); //checking if the user is already logged in or not
var router = express.Router();
const gameController = require("../controllers/gameController");

//GET//
//Start a new game (solo and versus)
router.get("/new", gameController.newGame);

router.get("/user", gameController.userDetails);

// router.get("/fill", gameController.fillData);

// router.get("/clean", gameController.clean);

module.exports = router;
