var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var encodeURL = require("../../../helpers/encodeURL");

var effectSchema = new Schema({
    name: {type: String, required: true}
});

var Effect = module.exports = mongoose.model('Effect', effectSchema);

module.exports.getAllEffects = function(callback){
  	Effect.find().lean().exec(function(err, effects){
    	if (err) return callback(err, null);
    	callback(null, effects);
  	});
};

module.exports.getEffectById = function(id, callback){
  	Effect.find({_id: id}).lean().exec(function(err, effect){
    	if(err) return callback(err, null);
    	callback(null, effect);
  	});
};

module.exports.getEffectByName = function(name, callback){
	name = encodeURL(name);
	Effect.find({name: new RegExp('^'+name+'$', "i")}).lean().exec(function(err, effect){
		if(err) return callback(err, null);
    	callback(null, effect);
  	});
};

module.exports.createEffect = function(newEffect, callback){
  	newEffect.save(callback);
};

module.exports.updateEffect = function(updatedValuesOfExistingEffect, callback){
  	Effect.update(
    	{"_id": updatedValuesOfExistingEffect.id},
    	{"$set": {"name": updatedValuesOfExistingEffect.name}},
    	{multi: false},
   		callback
  	);
};

module.exports.deleteEffect = function(id, callback){
    	Effect.remove({_id: id}, function(err, effect) {
        	if(err) return callback(err, null);
        	callback(null, effect);
    	});
};