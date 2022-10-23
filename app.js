//IMPORTS

//READ .ENV
if (process.env.NODE_ENV !== "production") {
  const dotenv = require("dotenv");
  dotenv.config();
}

var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

const multer = require("multer");
const cors = require("cors");
const passport = require("passport");
const flash = require("express-flash");
const session = require("express-session");

const compression = require("compression"); //Compression
const helmet = require("helmet"); //Protection
const initilizePassport = require("./passport_config");
const MongoStore = require("connect-mongo");

// Web socket


//Route imports
var indexRouter = require("./routes/index");
var userRouter = require("./routes/user");
var gameRouter = require("./routes/game");

var app = express();

//No view engine

// Set up mongoose connection to mongoDB
const mongoose = require("mongoose");
const mongoDB = process.env.MONGODB_URI;

mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));


//Middleware
app.use(cors({ origin: "*", credentials: true }));
app.use(flash());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    cookie: { _expires: 86400000 }, //1 day
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: mongoDB, collection: "sessions" }),
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(helmet());
app.use(logger("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use(compression()); //Compress all routes
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "client", "build")));


//ROUTES
app.use("/api/user", userRouter);
app.use("/api/game", gameRouter);
app.use("/api", indexRouter);


app.get("/*", function (req, res) {
  res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({ error: err });
});

module.exports = app;
