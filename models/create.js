var mongoose = require('mongoose');
var validate = require('mongoose-validator');
var createModel  = ""
// var skipValidator = [
//   validate({
//    validator: 'isAlphanumeric',
//    passIfEmpty: true,
//    message: 'Skip must be number'
//   })
// ];

var nameValidator = [
  validate({
    validator: 'isLength',
    arguments: [3, 50],
    message: 'Name should be between 3 and 50 characters'
  }),
  // validate({
  //   validator: 'isAlphanumeric',
  //   passIfEmpty: true,
  //   message: 'Name should contain alpha-numeric characters only'
  // })
];

var skipValidator = [
  validate({
   validator: 'matches',
   arguments: '^[0-9]*$',
   message: 'Skip must be number'
  })
];


var createSchema = new mongoose.Schema({
  title: {type: String, required: true, validate: nameValidator},
  type: { type: String, default: '' },
  advertisers: { type: String, default: '' },
  video_clickthrough_url: { type: String, default: '' },
  skip: { type: Number, required: true, validate: skipValidator }
});


// createSchema.statics.byNameAndYear = function (name, year, callback) {
//   // NOTE: find() returns an array and may return multiple results
// 	console.log("geldiiiii");

//   // return this.find({ name: name, year: year }, callback);
// }
// var createModule = mongoose.model('Create', createSchema);


createSchema.statics = {

  new: function (req){

  	console.log("req geldiiiii : ");

	var module = mongoose.model('Create', createSchema);

	return new module({
		title: req.body.title,
		type: req.body.type,
		advertisers: req.body.advertisers,
		video_clickthrough_url: req.body.video_clickthrough_url,
		skip: req.body.skip
	});

  },

  load: function () {
   	console.log("<<<<<<<>>>>>>>>> geldiiiii");
  },

  /**
   * List articles
   *
   * @param {Object} options
   * @param {Function} cb
   * @api private
   */

  // list: function (options, cb) {
  //   var criteria = options.criteria || {}

  //   this.find(criteria)
  //     .populate('user', 'name username')
  //     .sort({'createdAt': -1}) // sort by date
  //     .limit(options.perPage)
  //     .skip(options.perPage * options.page)
  //     .exec(cb);
  // }

}


// createModel.findByTitle('fido', function (err, creates) {
//   console.log(err);
//   console.log(animals);
// });


// createSchema.statics.newCreate = function newCreate(req){

// };

// function newCreate(req) {

//    	return new createModel({
// 		title: req.body.title,
// 		type: req.body.type,
// 		advertisers: req.body.advertisers,
// 		video_clickthrough_url: req.body.video_clickthrough_url,
// 		skip: req.body.skip
// 	});

// }

// createSchema.statics.newCreate = function newCreate (req) {

// 	console.log("geldiiiiii");


//  //   	return new createModel({
// 	// 	title: req.body.title,
// 	// 	type: req.body.type,
// 	// 	advertisers: req.body.advertisers,
// 	// 	video_clickthrough_url: req.body.video_clickthrough_url,
// 	// 	skip: req.body.skip
// 	// });
 
// }
// if you define a static method




 
// var Schema = new mongoose.Schema({
//   name: {type: String, required: true, validate: nameValidator}
// });



// CreateSchema.path('title').required(true, 'Create title cannot be blank');
// CreateSchema.path('type').required(true, 'Create type cannot be blank');


// CreateSchema.path('skip').validate(function (skip) {

// 	if (typeof skip != "number") {
// 	    console.log('This is not number');
// 	    return false;
// 	}
// }, 'Skip must be number');

createSchema.statics.byNameAndYear = function (name, year, callback) {
  // NOTE: find() returns an array and may return multiple results
	console.log("geldiiiii");

  // return this.find({ name: name, year: year }, callback);
}


module.exports = mongoose.model('Create', createSchema);




