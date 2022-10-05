const passport = require("passport");


//Middleware functions
exports.checkAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }
  
    res.status(403).json({});
  };
  
exports.checkNotAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
      return res.status(403).json({});
    }
  
    return next();
  };
