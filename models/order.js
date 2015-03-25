var mongoose = require('mongoose');
var validate = require('mongoose-validator');

var lengthValidator = [
  validate({
    validator: 'isLength',
    arguments: [2, 50],
    message: 'Should be between 3 and 50 characters'
  })
];

var orderSchema = new mongoose.Schema({

  title: {type: String, required: true, validate: lengthValidator},
  desc: {type: String },

  startDate: { type: Date},
  endDate: { type: Date},
  createdDate: { type: Date},
  updatedDate: { type: Date},

  created_by: { type : mongoose.Schema.ObjectId, ref : 'User' },
  last_updated_by: { type : mongoose.Schema.ObjectId, ref : 'User' },

  pod_order: { type: Number , default: 0},
  max_impression: { type: Number , default: 0},
  total_impression: { type: Number , default: 0},
  
  company: { type : mongoose.Schema.ObjectId, ref : 'Company'},
  user: { type : mongoose.Schema.ObjectId, ref : 'User' },
  order_status: { type : mongoose.Schema.ObjectId, ref : 'OrderStatus'},
  // order_categories: { type : mongoose.Schema.ObjectId, ref : 'OrderCategory'},
  
  content_tags: { type : mongoose.Schema.ObjectId, ref : 'ContentTag'},
  
  // ad_positions: { type : mongoose.Schema.ObjectId, ref : 'AdPosition'},
  creatives: { type : mongoose.Schema.ObjectId, ref : 'Creative'}, 
  advertiser: { type : mongoose.Schema.ObjectId, ref : 'Advertiser'}, //reklam veren
  ad_spaces: { type : mongoose.Schema.ObjectId, ref : 'AdSpace'}, //reklam verilen

});


orderSchema.statics = {

  list: function (options, cb) {
    console.log("Calling model : order /  method = list ");
    var criteria = options.criteria || {}
    return this.find(criteria)
      .populate('user', 'id first_name last_name local.email')
      .populate('created_by', 'id first_name last_name local.email')
      .populate('last_updated_by', 'id first_name last_name local.email')
      .sort({'createdDate': -1}) // sort by date
      .exec(cb);
  },

  show: function(id, cb){
    console.log("Calling model : order /  method = show ");

     this.findOne({ _id : id })
      .populate('user', 'id first_name last_name local.email')
      .populate('created_by', 'id first_name last_name local.email')
      .populate('last_updated_by', 'id first_name last_name local.email')
      .exec(cb);
  },

  save: function(req, order, cb){
    console.log("Calling model : order /  method = save ");
    order.user = req.user;
    order.created_by  = req.user;
    order.last_updated_by  = req.user;
    order.createdDate = new Date;
    order.updatedDate = new Date;
    return order.save(cb);
  },

}

module.exports = mongoose.model('Order', orderSchema);




