var mongoose = require('mongoose');
var validate = require('mongoose-validator');

var lengthValidator = [
  validate({
    validator: 'isLength',
    arguments: [2, 50],
    message: 'Should be between 3 and 50 characters'
  })
];

var companySchema = new mongoose.Schema({

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


companySchema.statics = {

	new: function (req){
		console.log("Calling model : order /  method = new ");
		var module = mongoose.model('Company', companySchema);
		return new module({
			title: req.body.title,
			cat_name: req.body.cat_name,
      createdDate: new Date
		});
	},

  load: function (order , req) {
		console.log("Calling model : order /  method = load ");
    // order = req.body;
		// order.title =  req.body.title;
		// order.cat_name =  req.body.cat_name;
  //   order.updatedDate = new Date;
		return req.body;
	},

  list: function (options, cb) {
    var criteria = options.criteria || {}
    return this.find(criteria)
      .sort({'createdAt': -1}) // sort by date
      .exec(cb);
  },

}

module.exports = mongoose.model('Company', companySchema);




