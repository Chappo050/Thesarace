"use strict";

//IMPORTS
//READ .ENV
if (process.env.NODE_ENV !== "production") {
  var dotenv = require("dotenv");

  dotenv.config();
}

var createError = require("http-errors");

var express = require("express");

var path = require("path");

var cookieParser = require("cookie-parser");

var logger = require("morgan");

var multer = require("multer");

var cors = require("cors");

var passport = require("passport");

var flash = require("express-flash");

var session = require("express-session");

var compression = require("compression"); //Compression


var helmet = require("helmet"); //Protection


var initilizePassport = require("./passport_config");

var MongoStore = require("connect-mongo"); //Model


var User = require("./models/user.js"); //Route imports


var indexRouter = require("./routes/index");

var userRouter = require("./routes/user");

var blogRouter = require("./routes/blog");

var app = express(); //No view engine
// Set up mongoose connection to mongoDB

var mongoose = require("mongoose");

var mongoDB = process.env.MONGODB_URI;
mongoose.connect(mongoDB, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
var db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:")); //Middleware

app.use(cors({
  origin: "URL ALLOWED",
  credentials: true
}));
app.use(flash());
app.use(session({
  secret: process.env.SESSION_SECRET,
  cookie: {
    _expires: 86400000
  },
  //1 day
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: mongoDB,
    collection: "sessions"
  })
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(helmet());
app.use(logger("dev"));
app.use(express.urlencoded({
  extended: false
}));
app.use(express.json());
app.use(cookieParser());
app.use(compression()); //Compress all routes

app.use(express["static"](path.join(__dirname, "client", "build"))); //ROUTES

app.use("/api/user", userRouter);
app.use("/api/blog", blogRouter);
app.use("/api", indexRouter); // catchall

app.get("/*", function (req, res) {
  res.sendFile(path.join(__dirname, "client", "build", "index.html"));
}); // catch 404 and forward to error handler

app.use(function (req, res, next) {
  next(createError(404));
}); // error handler

app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {}; // render the error page

  res.status(err.status || 500);
  res.json({
    error: err
  });
});
module.exports = app;