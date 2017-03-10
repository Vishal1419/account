var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var encodeURL = require("../../helpers/encodeURL");

var countrySchema = new Schema({
    name: {type: String, required: true},
	code: {type: String, required: true}
});

var Country = module.exports = mongoose.model('Country', countrySchema);

module.exports.getAllCountries = function(callback){
  	Country.find().lean().exec(function(err, countries){
    	if (err) return callback(err, null);
    	callback(null, countries);
  	});
};

module.exports.getCountryById = function(id, callback){
  	Country.find({_id: id}).lean().exec(function(err, country){
    	if(err) return callback(err, null);
    	callback(null, country);
  	});
};

module.exports.getCountryByName = function(name, callback){
	name = encodeURL(name);
	Country.find({name: new RegExp('^'+name+'$', "i")}).lean().exec(function(err, country){
		if(err) return callback(err, null);
    	callback(null, country);
  	});
};

module.exports.getCountryByCode = function(code, callback){
	code = encodeURL(code);
	Country.find({code: new RegExp('^'+code+'$', "i")}).lean().exec(function(err, country){
		if(err) return callback(err, null);
    	callback(null, country);
  	});
};

module.exports.createCountry = function(newCountry, callback){
  	newCountry.save(callback);
};

module.exports.updateCountry = function(updatedValuesOfExistingCountry, callback){
  	Country.update(
    	{"_id": updatedValuesOfExistingCountry.id},
    	{"$set": {"name": updatedValuesOfExistingCountry.name, "code": updatedValuesOfExistingCountry.code}},
    	{multi: false},
   		callback
  	);
};

module.exports.deleteCountry = function(id, callback){
    	Country.remove({_id: id}, function(err, country) {
        	if(err) return callback(err, null);
        	callback(null, country);
    	});
};