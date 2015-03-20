var mongoose = require('mongoose');
var validate = require('mongoose-validator');

var lengthValidator = [
  validate({
    validator: 'isLength',
    arguments: [2, 50],
    message: 'Should be between 3 and 50 characters'
  })
];

var adPositionSchema = new mongoose.Schema({

  title: {type: String, required: true, validate: lengthValidator},
  desc: {type: String, required: true, validate: lengthValidator},
  
  startDate: { type: Date},
  endDate: { type: Date},
  createdDate: { type: Date},
  updatedDate: { type: Date},
  created_by: { type: Date},
  last_updated_by: { type: Date},
  
  orders: { type : mongoose.Schema.ObjectId, ref : 'Order'}
});


adPositionSchema.statics = {

	new: function (req){
		console.log("Calling model : ad_position /  method = new ");
		var module = mongoose.model('AdPosition', adPositionSchema);
		return new module({
			title: req.body.title,
			cat_name: req.body.cat_name,
      createdDate: new Date
		});
	},

  load: function (ad_position , req) {
		console.log("Calling model : ad_position /  method = load ");
    // ad_position = req.body;
		// ad_position.title =  req.body.title;
		// ad_position.cat_name =  req.body.cat_name;
  //   ad_position.updatedDate = new Date;
		return req.body;
	},

  list: function (options, cb) {
    var criteria = options.criteria || {}
    return this.find(criteria)
      .sort({'createdAt': -1}) // sort by date
      .exec(cb);
  },

}

module.exports = mongoose.model('AdPosition', adPositionSchema);




