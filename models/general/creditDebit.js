var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var creditDebitSchema = new Schema({
    name: {type: String, required: true}
});

var CreditDebit = module.exports = mongoose.model('CreditDebit', creditDebitSchema);

module.exports.getAllCreditDebits = function(callback){
  CreditDebit.find().lean().exec(function(err, creditDebits){
    if (err) return callback(err, null);
    callback(null, creditDebits);
  });
};

module.exports.getCreditDebitById = function(id, callback){
  CreditDebit.find({_id: id}).lean().exec(function(err, creditDebit){
    if(err) return callback(err, null);
    callback(null, creditDebit);
  });
};

module.exports.createCreditDebit = function(newCreditDebit, callback){
  newCreditDebit.save(callback);
};

module.exports.updateCreditDebit = function(updatedValuesOfExistingCreditDebit, callback){
  CreditDebit.update(
    {"_id": updatedValuesOfExistingCreditDebit.id},
    {"$set": {"name": updatedValuesOfExistingCreditDebit.name}},
    {multi: false},
    callback
  );
};

module.exports.deleteCreditDebit = function(id, callback){
    CreditDebit.remove({_id: id}, function(err, creditDebit) {
        if(err) return callback(err, null);
        callback(null, creditDebit);
    });
};