var mongoose = require('mongoose');

var CreateSchema = new mongoose.Schema({
  title: { type: String, default: '' },
  type: { type: String, default: '' },
  advertisers: { type: String, default: '' },
  video_clickthrough_url: { type: String, default: '' },
  skip: { type: Number, default: '' }
});

module.exports = mongoose.model('Create', CreateSchema);


