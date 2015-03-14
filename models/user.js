var mongoose = require('mongoose');
var validate = require('mongoose-validator');
var bcrypt   = require('bcrypt-nodejs');

var emailValidator = [
  validate({
   validator: 'matches',
   arguments: /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/,
   message: 'Email , Must be email format'
  })
];

var userSchema = new mongoose.Schema({
	local: {
		email: { type: String, required: true, default: '' , validate: emailValidator},	
		password: { type: String, required: true, default: '' },	
	},
	first_name: { type: String, default: '' , required: true },	
	last_name: { type: String, default: '' },
  createdDate: { type: Date, default: Date.now },
  updatedDate: { type: Date, default: Date.now },
  creates: { type: mongoose.Schema.ObjectId, ref: 'Create' }
});

userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};


module.exports = mongoose.model('User', userSchema);
