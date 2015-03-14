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

var catValidator = [
  validate({
    validator: function(val) {
      console.log("@@@@@ val >>>> " , val );
      return val != "0";
    },
    message: 'Category can not be empty.'
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
  // type: { type: String, required: true, default: '' , validate: lengthValidator},
  advertisers: { type: String, default: '' },
  video_clickthrough_url: { type: String, required: true, default: '', validate: urlValidator },
  skip: { type: Number, required: true, validate: skipValidator },
  createdDate: { type: Date },
  updatedDate: { type: Date },
  user: { type : mongoose.Schema.ObjectId, ref : 'User' },
  category: { type : mongoose.Schema.ObjectId, ref : 'Category' ,  required: true}
});

createSchema.statics = {

	new: function (req){
    console.log("Calling model : create /  method = new ");
    var module = mongoose.model('Create', createSchema);
    return new module({
      title: req.body.title,
      // type: req.body.type,
      advertisers: req.body.advertisers,
      video_clickthrough_url: req.body.video_clickthrough_url,
      skip: req.body.skip,
      createdDate: new Date,
      updatedDate: new Date,
      user: req.user._id,
      category: req.body.category
    });
	},

  load: function (create , req) {
  		console.log("Calling model : create /  method = load ");
  		create.title =  req.body.title;
  		// create.type =  req.body.type;
  		create.advertisers = req.body.advertisers;
  		create.video_clickthrough_url =  req.body.video_clickthrough_url;
  		create.skip =  req.body.skip;
      create.updatedDate = new Date;
		  return create;
	 },

}


createSchema.path('category').validate(function (category) {
  return parseInt(category) != 0;
}, 'Category can not be empty.');


// createSchema.pre("save", function(next) {
createSchema.pre('save', true, function (next, done) {

  console.log("this.category : " , this.category ); 
  if (this.category == ""){
    console.log("errorrrrrrrr");
  }
  console.log("next :" , next);
  console.log("done :" , done);

  // calling next kicks off the next middleware in parallel
  next();

});



module.exports = mongoose.model('Create', createSchema);




