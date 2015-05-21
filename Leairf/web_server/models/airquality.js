var mongoose = require('mongoose');

var aqSchema = mongoose.Schema({
  aqi: Number,
  temp: Number,
  date: Date,
  geolocation: {
    longitude: Number,
    latitude: Number
  }
});
var aqiRecordModel = mongoose.model('aqhistories', aqSchema);


module.exports = aqiRecordModel;
