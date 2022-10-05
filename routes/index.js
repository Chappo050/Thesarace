var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.json({Message: 'Hello, welcome to the main page'})
});

module.exports = router;
