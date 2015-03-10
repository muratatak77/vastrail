var mongoose = require('mongoose');
var validate = require('mongoose-validator');

var lengthValidator = [
  validate({
    validator: 'isLength',
    arguments: [3, 50],
    message: 'Should be between 3 and 50 characters'
  })
];

var skipValidator = [
  validate({
   validator: 'matches',
   arguments: '^[0-9]*$',
   message: 'Skip must be number'
  })
];

var urlValidator = [
  validate({
   validator: 'matches',
   arguments: '^[a-zA-Z0-9\-\.]+\.(com|org|net|mil|edu|COM|ORG|NET|MIL|EDU)$',
   message: 'Skip must be url format'
  })
];

var createSchema = new mongoose.Schema({
  title: {type: String, required: true, validate: lengthValidator},
  type: { type: String, required: true, default: '' , validate: lengthValidator},
  advertisers: { type: String, default: '' },
  video_clickthrough_url: { type: String, required: true, default: '', validate: urlValidator },
  skip: { type: Number, required: true, validate: skipValidator },
  createdDate: { type: Date, default: Date.now },
  updatedDate: { type: Date, default: Date.now },
  user: { type : mongoose.Schema.ObjectId, ref : 'User' }
});

createSchema.statics = {

	new: function (req){
		console.log("Calling model : create /  method = new ");
		var module = mongoose.model('Create', createSchema);
		return new module({
			title: req.body.title,
			type: req.body.type,
			advertisers: req.body.advertisers,
			video_clickthrough_url: req.body.video_clickthrough_url,
			skip: req.body.skip,
      user: req.user._id
		});
	},

  	load: function (create , req) {
		console.log("Calling model : create /  method = load ");
		create.title =  req.body.title;
		create.type =  req.body.type;
		create.advertisers = req.body.advertisers;
		create.video_clickthrough_url =  req.body.video_clickthrough_url;
		create.skip =  req.body.skip;
		return create;
	},

}


module.exports = mongoose.model('Create', createSchema);




