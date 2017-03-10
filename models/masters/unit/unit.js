var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var unitSchema = new Schema({
    name: {type: String, required: true},
    formalName: {type: String},
    symbol: {type: String},
    numberOfDecimalPlaces: {type: Number, required: true}
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

module.exports.createUnit = function(newUnit, callback){
  newUnit.save(callback);
};

module.exports.updateUnit = function(updatedValuesOfExistingUnit, callback){
  Unit.update(
    {"_id": updatedValuesOfExistingUnit.id},
    {"$set": {"name": updatedValuesOfExistingUnit.name, "formalName": updatedValuesOfExistingUnit.formalName,
              "symbol": updatedValuesOfExistingUnit.symbol, "numberOfDecimalPlaces": updatedValuesOfExistingUnit.numberOfDecimalPlaces}},
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