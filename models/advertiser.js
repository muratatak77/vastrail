var mongoose = require('mongoose');
var validate = require('mongoose-validator');

var lengthValidator = [
  validate({
    validator: 'isLength',
    arguments: [2, 50],
    message: 'Should be between 3 and 50 characters'
  })
];

var advertiserSchema = new mongoose.Schema({

  title: {type: String, required: true, validate: lengthValidator},
  code: {type: String, required: true, validate: lengthValidator},
  desc: {type: String },
  
  startDate: { type: Date},
  endDate: { type: Date},
  createdDate: { type: Date},
  updatedDate: { type: Date},

  created_by: { type : mongoose.Schema.ObjectId, ref : 'User' },
  last_updated_by: { type : mongoose.Schema.ObjectId, ref : 'User' },
  
  order: { type : mongoose.Schema.ObjectId, ref : 'Order'}

});


advertiserSchema.statics = {

  list: function (options, cb) {
    var criteria = options.criteria || {}
    return this.find(criteria)
      .sort({'createdDate': -1}) // sort by date
      .exec(cb);
  },

  show: function(id, cb){
     this.findOne({ _id : id })
      .exec(cb);
  },

  save: function(req, advertiser, cb){
    advertiser.created_by  = req.user;
    advertiser.last_updated_by  = req.user;
    advertiser.createdDate = new Date;
    advertiser.updatedDate = new Date;
    return advertiser.save(cb);
  },

}

module.exports = mongoose.model('Advertiser', advertiserSchema);




