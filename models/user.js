const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: [{ type: String, required: true }],
    date_registered: { type: Date, default: Date.now },
  }
);

UserSchema
.virtual('date_formatted')
.get(function() {
  return  DateTime.fromJSDate(this.date_registed).toLocaleString(DateTime.DATE_MED);
});





//Export model
module.exports = mongoose.model('User', UserSchema);
