var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var encodeURL = require("../../helpers/encodeURL");

var stateSchema = new Schema({
    name: {type: String, required: true},
    country: {type: Schema.Types.ObjectId, ref: 'Country'},
    isSystemState : {type: Boolean}
});

var State = module.exports = mongoose.model('State', stateSchema);

module.exports.getAllStates = function(callback){
  State.find().sort('name').populate('country').exec(function(err, states){
    if (err) return callback(err, null);
    callback(null, states);
  });
};

module.exports.getStateById = function(id, callback){
  State.find({_id: id}).sort('name').populate('country').exec(function(err, state){
    if(err) return callback(err, null);
    callback(null, state);
  });
};

module.exports.getStateByName = function(name, callback){
  name = encodeURL(name);
  State.find({name: new RegExp('^'+name+'$', "i")}).sort('name').populate('country').exec(function(err, state){
    if(err) return callback(err, null);
    callback(null, state);
  });
};

module.exports.createState = function(newState, callback){
  newState.save(callback);
};

module.exports.updateState = function(updatedValuesOfExistingState, callback){
  State.update(
    {"_id": updatedValuesOfExistingState.id},
    {"$set": {"name": updatedValuesOfExistingState.name, "country": updatedValuesOfExistingState.country,
              "isSystemState": updatedValuesOfExistingState.isSystemState}},
    {multi: false},
    callback
  );
};

module.exports.deleteState = function(id, callback){
    State.remove({_id: id}, function(err, state) {
        if(err) return callback(err, null);
        callback(null, state);
    });
};