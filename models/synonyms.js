const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const SynonymSchema = new Schema({
  word: { type: String, required: true },
  synonyms: { type: [String], required: true },
});



//Export model
module.exports = mongoose.model("Synonyms", SynonymSchema);
