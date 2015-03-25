var mongoose = require('mongoose');
var validate = require('mongoose-validator');

var lengthValidator = [
  validate({
    validator: 'isLength',
    arguments: [2, 50],
    message: 'Should be between 3 and 50 characters'
  })
];

var contentTagSchema = new mongoose.Schema({

  title: {type: String, required: true, validate: lengthValidator},
  desc: {type: String },
  code: {type: String, required: true, validate: lengthValidator},

  startDate: { type: Date},
  endDate: { type: Date},
  createdDate: { type: Date},
  updatedDate: { type: Date},
  
  created_by: { type : mongoose.Schema.ObjectId, ref : 'User' },
  last_updated_by: { type : mongoose.Schema.ObjectId, ref : 'User' },
  
  orders: { type : mongoose.Schema.ObjectId, ref : 'Order'}
});



contentTagSchema.statics = {

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

  save: function(req, content_tag, cb){
    content_tag.created_by  = req.user;
    content_tag.last_updated_by  = req.user;
    content_tag.createdDate = new Date;
    content_tag.updatedDate = new Date;
    return content_tag.save(cb);
  },

}

module.exports = mongoose.model('ContentTag', contentTagSchema);




