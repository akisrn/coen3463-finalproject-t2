var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    dayData = require('../models/day-schema');

var roomData = new Schema
(
	{
	    room_number		: { type: Number },
	    day_of_the_week	: [{
	    					  type: Schema.Types.ObjectId,
                      		  ref: 'dayData'
	    				  }],
	    
	},
    {
       collection		: 'roomData'
    }
);

module.exports = mongoose.model('roomData', roomData);