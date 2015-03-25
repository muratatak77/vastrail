var mongoose = require('mongoose');
var validate = require('mongoose-validator');

var lengthValidator = [
  validate({
    validator: 'isLength',
    arguments: [2, 50],
    message: 'Should be between 3 and 50 characters'
  })
];

var videoFormatSchema = new mongoose.Schema({

  title: {type: String, required: true, validate: lengthValidator},
  code: {type: String, required: true, validate: lengthValidator},
  desc: {type: String },
  
  startDate: { type: Date},
  endDate: { type: Date},
  createdDate: { type: Date},
  updatedDate: { type: Date},

  created_by: { type : mongoose.Schema.ObjectId, ref : 'User' },
  last_updated_by: { type : mongoose.Schema.ObjectId, ref : 'User' },
  
  creatives: { type : mongoose.Schema.ObjectId, ref : 'Order'}

});


videoFormatSchema.statics = {

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

  save: function(req, video_format, cb){
    video_format.created_by  = req.user;
    video_format.last_updated_by  = req.user;
    video_format.createdDate = new Date;
    video_format.updatedDate = new Date;
    return video_format.save(cb);
  },

}


module.exports = mongoose.model('VideoFormat', videoFormatSchema);




