var mongoose = require('mongoose');
var extend = require('mongoose-schema-extend');

var validateMongo = require('mongoose-validator');


var lengthValidator = [
  validateMongo({
    validator: 'isLength',
    arguments: [3, 50],
    message: 'Should be between 3 and 50 characters'
  })
];

var skipValidator = [
  validateMongo({
   validator: 'matches',
   arguments: '^[0-9]*$',
   message: 'Skip must be number'
  })
];

var catValidator = [
  validateMongo({
    validator: function(val) {
      console.log("@@@@@ val >>>> " , val );
      return val != "0";
    },
    message: 'Category can not be empty.'
  })
];

var urlValidator = [
  validateMongo({
   validator: 'matches',
   arguments: '^[a-zA-Z0-9\-\.]+\.(com|org|net|mil|edu|COM|ORG|NET|MIL|EDU)$',
   message: 'Skip must be url format'
  })
];

var createSchema = new mongoose.Schema({
  title: {type: String, required: true, validate: lengthValidator},
  advertisers: { type: String, default: '' },
  video_clickthrough_url: { type: String, required: true, default: '', validate: urlValidator },
  skip: { type: Number, required: true, validate: skipValidator },
  createdDate: { type: Date },
  updatedDate: { type: Date },
  user: { type : mongoose.Schema.ObjectId, ref : 'User' },
  category: { type : mongoose.Schema.ObjectId, ref : 'Category'},
});

createSchema.statics = {

	new: function (req){
    console.log("Calling model : creative /  method = new ");
    var module = mongoose.model('Creative', createSchema);
    return new module({
      title: req.body.title,
      desc: req.body.desc,
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

  load: function (creative , req) {
  		console.log("Calling model : creative /  method = load ");
  		creative.title =  req.body.title;
  		// creative.type =  req.body.type;
  		creative.advertisers = req.body.advertisers;
  		creative.video_clickthrough_url =  req.body.video_clickthrough_url;
  		creative.skip =  req.body.skip;
      creative.updatedDate = new Date;
		  return creative;
	 },

}


createSchema.path('category').validate(function (category) {
  return parseInt(category) != 0;
}, 'Category can not be empty.');


// // createSchema.pre("save", function(next) {
// createSchema.pre('save', true, function (next, done) {

//   console.log("this.category : " , this.category ); 
//   if (this.category == ""){
//     console.log("errorrrrrrrr");
//   }
//   console.log("next :" , next);
//   console.log("done :" , done);

//   // calling next kicks off the next middleware in parallel
//   next();

// });



module.exports = mongoose.model('Creative', createSchema);




