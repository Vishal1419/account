var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var encodeURL = require("../../../helpers/encodeURL");

var unitSchema = new Schema({
    name: {type: String, required: true},
    symbol: {type: String, required: true},
    numberOfDecimalPlaces: {type: Number, required: true},
    isSystemUnit: {type: Boolean}
});

var Unit = module.exports = mongoose.model('Unit', unitSchema);

module.exports.getAllUnits = function(callback){
  Unit.find().lean().exec(function(err, units){
    if (err) return callback(err, null);
    callback(null, units);
  });
};

module.exports.getUnitById = function(id, callback){
  Unit.find({_id: id}).lean().exec(function(err, unit){
    if(err) return callback(err, null);
    callback(null, unit);
  });
};

module.exports.getUnitByName = function(name, callback){
	name = encodeURL(name);
	Unit.find({name: new RegExp('^'+name+'$', "i")}).lean().exec(function(err, unit){
		if(err) return callback(err, null);
    	callback(null, unit);
  	});
};

module.exports.getUnitBySymbol = function(symbol, callback){
	symbol = encodeURL(symbol);
	Unit.find({symbol: new RegExp('^'+symbol+'$', "i")}).lean().exec(function(err, unit){
		if(err) return callback(err, null);
    	callback(null, unit);
  	});
};

module.exports.createUnit = function(newUnit, callback){
  newUnit.save(callback);
};

module.exports.updateUnit = function(updatedValuesOfExistingUnit, callback){
  Unit.update(
    {"_id": updatedValuesOfExistingUnit.id},
    {"$set": {"name": updatedValuesOfExistingUnit.name,
              "symbol": updatedValuesOfExistingUnit.symbol, 
              "numberOfDecimalPlaces": updatedValuesOfExistingUnit.numberOfDecimalPlaces,
              "isSystemUnit": updatedValuesOfExistingUnit.isSystemUnit}},
    {multi: false},
    callback
  );
};

module.exports.deleteUnit = function(id, callback){
    Unit.remove({_id: id}, function(err, unit) {
        if(err) return callback(err, null);
        callback(null, unit);
    });
};