var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var relationSchema = new Schema({
    firstUnit: {type: Schema.Types.ObjectId, ref: 'Unit', required: true},
    secondUnit: {type: Schema.Types.ObjectId, ref: 'Unit', required: true},
    multiplier: {type: Number, required: true}
});

var relation = module.exports = mongoose.model('Relation', relationSchema);

module.exports.getAllRelations = function(callback){
  Relation.find().lean().exec(function(err, relations){
    if (err) return callback(err, null);
    callback(null, relations);
  });
};

module.exports.getRelationById = function(id, callback){
  Relation.find({_id: id}).lean().exec(function(err, relation){
    if(err) return callback(err, null);
    callback(null, relation);
  });
};

module.exports.createRelation = function(newRelation, callback){
  newRelation.save(callback);
};

module.exports.updateRelation = function(updatedValuesOfExistingRelation, callback){
  Relation.update(
    {"_id": updatedValuesOfExistingRelation.id},
    {"$set": {"firstUnit": updatedValuesOfExistingRelation.firstUnit,
              "secondUnit": updatedValuesOfExistingRelation.secondUnit,
              "multiplier": updatedValuesOfExistingRelation.multiplier}},
    {multi: false},
    callback
  );
};

module.exports.deleteRelation = function(id, callback){
    Relation.remove({_id: id}, function(err, relation) {
        if(err) return callback(err, null);
        callback(null, relation);
    });
};