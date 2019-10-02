const mongoose = require('mongoose');
const { Schema } = mongoose;
const { RequiredString } = require('./required-types');


const schema = new Schema({
  title: RequiredString,
  activites: [{
    type: String,
  }], 
  launchDate: {
    type: Date,
    default: () => new Date()
  }, 
  stops: [{
    address: String,
    location: {
      latitude: Number,
      longitude: Number
    }, 
    weather: {
      type: Object, // will get from weather API
    },
    attendance: {
      type: Number,
      min: 1 
    }
  }]
});

module.exports = mongoose.model('Tour', schema);