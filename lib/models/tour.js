const mongoose = require('mongoose');
const { Schema } = mongoose;

const schema = new Schema({
  title: {
    type: String,
    required: true
  }, 
  activites: [{
    type: String,
  }], 
  date: {
    type: Date,
    required: true
  }
});

module.exports = mongoose.model('Tour', schema);