const { mongo, default: mongoose } = require("mongoose");
const Synonyms = require("../models/synonyms.js");
const Session = require("../models/session.js");
const { body, validationResult } = require("express-validator"); //Data parsing
const passport = require("passport");
const { query } = require("express");
const axios = require("axios");
const User = require("../models/user.js");
const { uniqueNamesGenerator, adjectives, colors, animals } = require('unique-names-generator');



const synonyms = require("../models/synonyms.js");
// Rate limited, fix later
exports.fillData = (req, res, next) => {
  //pick random word and get its synonyms
  for (let i = 0; i < wordList.length; i++) {
    setTimeout(function () {
      const element = wordList[i];

      axios
        .request({
          method: "GET",
          url:
            "https://wordsapiv1.p.rapidapi.com/words/" + element + "/synonyms",
          headers: {
            "X-RapidAPI-Key": process.env.WORDS_API_KEY,
            "X-RapidAPI-Host": "wordsapiv1.p.rapidapi.com",
          },
        })
        .then(function (response) {
          //clean data
          const synonyms = new Synonyms(response.data);
          synonyms.save((err) => {
            if (err) return err;
          });
        });
    }, 50 * i);
  }

  res.status(200).json({ message: "Done" });
};

// Get a new random word with synonyms
exports.newGame = (req, res, next) => {
  synonyms.aggregate([{ $sample: { size: 1 } }]).exec((err, word) => {
    if (err) {
      return next(err);
    }
    if (word) {
      res.status(200).json(word);
    } else {
      res.status(200).json({ message: "No word found" });
    }
  });
};

// Cleaning
exports.userDetails = (req, res, next) => {
  try {
    const username = req.user.username
    res.status(200).json({username: username, guest: false})
  } catch (error) {
    const randomName = uniqueNamesGenerator({ dictionaries: [adjectives, colors, animals] }); // big_red_donkey
    res.status(200).json({username: randomName, guest: true})
  }

};

// Cleaning
exports.clean = (req, res, next) => {
  synonyms.remove({ synonyms: { $size: 1 } }).exec((err) => {
    if (err) {
      return next(err);
    } else {
      res.status(200).json({ message: "Word deleted" });
    }
  });
};
