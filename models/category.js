var mongoose = require('mongoose');
var validate = require('mongoose-validator');

var lengthValidator = [
  validate({
    validator: 'isLength',
    arguments: [2, 50],
    message: 'Should be between 3 and 50 characters'
  })
];

var categorySchema = new mongoose.Schema({
  title: {type: String, required: true, validate: lengthValidator},
  cat_name: {type: String, required: true, validate: lengthValidator},
  createdDate: { type: Date},
  updatedDate: { type: Date}
});

categorySchema.statics = {

	new: function (req){
		console.log("Calling model : category /  method = new ");
		var module = mongoose.model('Category', categorySchema);
		return new module({
			title: req.body.title,
			cat_name: req.body.cat_name,
      createdDate: new Date
		});
	},

  load: function (category , req) {
		console.log("Calling model : category /  method = load ");
		category.title =  req.body.title;
		category.cat_name =  req.body.cat_name;
    category.updatedDate = new Date;
		return category;
	},

  list: function (options, cb) {
    var criteria = options.criteria || {}
    return this.find(criteria)
      .sort({'createdAt': -1}) // sort by date
      .exec(cb);

    // this.find({}).exec(function(err, cats) { 
    // // Your callback code where you can access subdomain directly through custPhone.subdomain.name 
    //   if (err){
    //       console.log("ERROR OCCURED 3 : " , err);
    //       req.session.sessionFlash = {
    //           type: 'danger',
    //           message: 'Error Ocuured' + utils.errors(err)
    //       }
    //   }
    //   return cats;
    // })

    // return this.find(function (err, categories) {
    //   if (err){
    //     console.log("ERROR OCCURED : " , err);
    //     return res.render('500');
    //   }
    //   console.log("")
    // });

  },

}

module.exports = mongoose.model('Category', categorySchema);




