var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    roomData = require('../models/room-schema');
    roomSchedule = require('../models/room-schedule-schema');

var dayData = new Schema
(
    { room_number      : {
                            type: Schema.Types.ObjectId,
                            ref: 'roomData'
                         }, 
      day_of_the_week  : { type: String },
      room_schedule    : [{
                            type: Schema.Types.ObjectId,
                            ref: 'roomSchedule'
                         }]
    },
    {
       collection: 'dayData'
    }
);

module.exports = mongoose.model('dayData', dayData);