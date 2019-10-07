const mongoose = require('mongoose');
const { Schema } = mongoose;

const schema = new Schema({
  location: {
    latitude: Number,
    longitude: Number
  }, 
  weather: {
    any: 'object', // will get from weather API
  },
  attendance: {
    type: Number
  }
});

module.exports = mongoose.model('Stop', schema);