const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const SessionSchema = new Schema(
  {
    expires: { type: Date, required: true },
    session: { type: String, required: true },
  }
);


//Export model
module.exports = mongoose.model('Session', SessionSchema);
