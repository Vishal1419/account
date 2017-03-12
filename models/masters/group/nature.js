var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var encodeURL = require("../../../helpers/encodeURL");

var natureSchema = new Schema({
    name: {type: String, required: true},
	isSystemNature: {type: Boolean}
});

var Nature = module.exports = mongoose.model('Nature', natureSchema);

module.exports.getAllNatures = function(callback){
  	Nature.find().lean().exec(function(err, natures){
    	if (err) return callback(err, null);
    	callback(null, natures);
  	});
};

module.exports.getNatureById = function(id, callback){
  	Nature.find({_id: id}).lean().exec(function(err, nature){
    	if(err) return callback(err, null);
    	callback(null, nature);
  	});
};

module.exports.getNatureByName = function(name, callback){
	name = encodeURL(name);
	Nature.find({name: new RegExp('^'+name+'$', "i")}).lean().exec(function(err, nature){
		if(err) return callback(err, null);
    	callback(null, nature);
  	});
};

module.exports.createNature = function(newNature, callback){
  	newNature.save(callback);
};

module.exports.updateNature = function(updatedValuesOfExistingNature, callback){
  	Nature.update(
    	{"_id": updatedValuesOfExistingNature.id},
    	{"$set": {"name": updatedValuesOfExistingNature.name, 
				  "isSystemNature": updatedValuesOfExistingNature.isSystemNature}},
    	{multi: false},
   		callback
  	);
};

module.exports.deleteNature = function(id, callback){
    	Nature.remove({_id: id}, function(err, nature) {
        	if(err) return callback(err, null);
        	callback(null, nature);
    	});
};