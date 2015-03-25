var mongoose = require('mongoose');
var extend = require('mongoose-schema-extend');

var validateMongo = require('mongoose-validator');


var lengthValidator = [
  validateMongo({
    validator: 'isLength',
    arguments: [3, 250],
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
   arguments: '^[a-zA-Z0-9\-\.]+\.(com|org|net|mil|edu|COM|ORG|NET|MIL|EDU)',
   message: 'Skip must be url format'
  })
];

var creativeSchema = new mongoose.Schema({

  title: {type: String, required: true, validate: lengthValidator },
  desc: {type: String },
  createdDate: { type: Date },
  updatedDate: { type: Date },

  video_url: {type: String, required: true, validate: lengthValidator },

  clickthrough_url: { type: String, required: true, default: '' },

  created_by: { type : mongoose.Schema.ObjectId, ref : 'User' },
  last_updated_by: { type : mongoose.Schema.ObjectId, ref : 'User' },
  user: { type : mongoose.Schema.ObjectId, ref : 'User' },
  creative_categories: { type : mongoose.Schema.ObjectId, ref : 'CreativeCategory' },
  order: { type : mongoose.Schema.ObjectId, ref : 'Order' },

  video: {
    url: { type: String, required: true, default: ''},
    bitrate: { type: Number, required: true }, 
    width: { type: Number, required: true}, 
    heigth: { type: Number, required: true}, 
    duration: { type: Number, required: true},
    video_format: { type : mongoose.Schema.ObjectId, ref : 'VideoFormat' }
  }

});

creativeSchema.statics = {

  list: function (options, cb) {
    var criteria = options.criteria || {}
    return this.find(criteria)
      .populate('user', 'id first_name last_name local.email')
      .populate('created_by', 'id first_name last_name local.email')
      .populate('last_updated_by', 'id first_name last_name local.email')
      .populate('category')
      .sort({'createdDate': -1}) // sort by date
      .exec(cb);
  },

  show: function(id, cb){
     this.findOne({ _id : id })
      .populate('user', 'id first_name last_name local.email')
      .populate('created_by', 'id first_name last_name local.email')
      .populate('last_updated_by', 'id first_name last_name local.email')
      .populate('category')
      .exec(cb);
  },

  save: function(req, creative, cb){
    console.log("Calling model : creative /  method = save ");
    creative.user = req.user;
    creative.created_by  = req.user;
    creative.last_updated_by  = req.user;
    creative.createdDate = new Date;
    creative.updatedDate = new Date;
    return creative.save(cb);
  },

	// new: function (req){
 //    console.log("Calling model : creative /  method = new ");
 //    var module = mongoose.model('Creative', creativeSchema);
 //    return new module({
 //      title: req.body.title,
 //      desc: req.body.desc,
 //      // type: req.body.type,
 //      advertisers: req.body.advertisers,
 //      clickthrough_url: req.body.clickthrough_url,
 //      skip: req.body.skip,
 //      createdDate: new Date,
 //      updatedDate: new Date,
 //      user: req.user._id,
 //      category: req.body.category
 //    });
	// },

 //  load: function (creative , req) {
 //  		console.log("Calling model : creative /  method = load ");
 //  		creative.title =  req.body.title;
 //  		// creative.type =  req.body.type;
 //  		creative.advertisers = req.body.advertisers;
 //  		creative.clickthrough_url =  req.body.clickthrough_url;
 //  		creative.skip =  req.body.skip;
 //      creative.updatedDate = new Date;
	// 	  return creative;
	//  },

}

// // creativeSchema.pre("save", function(next) {
// creativeSchema.pre('save', true, function (next, done) {

//   console.log("this.category : " , this.category ); 
//   if (this.category == ""){
//     console.log("errorrrrrrrr");
//   }
//   console.log("next :" , next);
//   console.log("done :" , done);

//   // calling next kicks off the next middleware in parallel
//   next();

// });



module.exports = mongoose.model('Creative', creativeSchema);




