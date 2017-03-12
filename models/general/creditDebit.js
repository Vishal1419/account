var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var encodeURL = require("../../helpers/encodeURL");

var creditDebitSchema = new Schema({
    name: {type: String, required: true},
    code: {type: String, required: true},
    isSystemCreditDebit: {type: Boolean}
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

module.exports.getCreditDebitByName = function(name, callback){
  name = encodeURL(name);
  CreditDebit.find({name: new RegExp('^'+name+'$', "i")}).lean().exec(function(err, creditDebit){
    if(err) return callback(err, null);
    callback(null, creditDebit);
  });
};

module.exports.getCreditDebitByCode = function(code, callback){
  code = encodeURL(code);
  CreditDebit.find({code: new RegExp('^'+code+'$', "i")}).lean().exec(function(err, creditDebit){
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
    {"$set": {"name": updatedValuesOfExistingCreditDebit.name, "code": updatedValuesOfExistingCreditDebit.code,
              "isSystemCreditDebit": updatedValuesOfExistingCreditDebit.isSystemCreditDebit}},
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