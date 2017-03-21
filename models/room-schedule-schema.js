var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    dayData = require('../models/day-schema');

var roomSchedule = new Schema
(
    { day_of_the_week  : { 
                            type: Schema.Types.ObjectId,
                            ref: 'dayData'
                         },
      room_schedule    : [{
                            day_of_the_week: String,
                            class_start: String,
                            class_end: String,
                            class_code: String,
                            class_subject: String,
                            class_professor: String
                        }]
    },
    {
       collection: 'roomSchedule'
    }
);

module.exports = mongoose.model('roomSchedule', roomSchedule);