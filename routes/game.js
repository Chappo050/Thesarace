var express = require("express");
const passport = require("passport");
const authCheck = require("../authCheck"); //checking if the user is already logged in or not
var router = express.Router();
const gameController = require("../controllers/gameController");

//GET//
/* GET users listing. */
router.get("/newSoloGame", gameController.newGame);

module.exports = router;
