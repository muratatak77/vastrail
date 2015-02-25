/**
 * User Schema
 */
var mongoose = require('mongoose');

var UserSchema = new Schema({
  first_name: { type: String, default: '' },
  last_name: { type: String, default: '' },
  email: { type: String, default: '' },
  username: { type: String, default: '' },
  hashed_password: { type: String, default: '' }
});
  
module.exports = mongoose.model('User', UserSchema);
