const mongoose = require('mongoose');
const Schema = mongoose.Schema; //mongoose has many properties on it.  One is a constructor function for Schemas

const logSchema = new Schema({
	title:  String, //can say whether we want properties to be required or unique
	entry: String,
	shipIsBroken: {type: Boolean, default: true},
	Date: {type: Date, default: Date.now},
	user: String
},
{timestamps: true});

//Creating an Article class -- will be stored in 'articles' collection.  Mongo does this for you automatically
const Logs = mongoose.model('logs', logSchema);

module.exports = Logs;
