var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    passportLocalMongoose = require('passport-local-mongoose');

var LabAdmin = new Schema
(
	{
	    username	: String,
	    first_name	: String,
	    isAdmin 	: { type : Boolean, default : false }
	},
	{
	    collection	: 'userAccount'
	}
);

LabAdmin.plugin(passportLocalMongoose);

module.exports = mongoose.model('LabAdmin', LabAdmin);