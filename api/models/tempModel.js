'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var TaskSchema = new Schema({
  city: {
    type: String,
    required: 'Please provide city name'
  },
  Created_date: {
    type: Date,
    default: Date.now
  },
  temperature: {
    type: String,
    required: 'Please provide temperature'
  }
});

module.exports = mongoose.model('Temps', TaskSchema);
