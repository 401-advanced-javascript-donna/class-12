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
    location: {
      type: Object
    }, 
    weather: {
      type: Object, // will get from weather API
    },
    attendance: {
      type: Number
    }
  }]
});

schema.statics = {
  addStop(id, location, weather) {
    return this.updateById(
      id,
      {
        $push: {
          stops: [{ location: location, weather: weather, attendance: 0 }]
        }
      }
    )
      .then(tour => tour.stops);
  },

  removeStop(id, stopId) {
    return this.updateById(id, {
      $pull: {
        stops: { _id: stopId }
      }
    })
      .then(tour => tour.shows);
  },

  updateStopAtt(id, stopId, attendance) {
    console.log('main id', id, 'stop id', stopId);
    return this.updateOne(
      { _id: id, 'stops._id': stopId },
      {
        $set: {
          'stops.$.attendance': attendance
        }
      }
    )
      .then(tour => tour.stops);
  }
};

module.exports = mongoose.model('Tour', schema);