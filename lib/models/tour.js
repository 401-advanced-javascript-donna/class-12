const mongoose = require('mongoose');
const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const schema = new Schema({
  title: {
    type: String,
    required: true
  }, 
  activites: [{
    type: String,
  }], 
  launchDate: {
    type: Date,
    default: () => new Date()
  }, 
  stops: [{
    type: ObjectId,
    ref: 'Stops'
  }]
});

module.exports = mongoose.model('Tour', schema);