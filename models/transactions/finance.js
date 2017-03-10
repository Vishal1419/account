var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var financeSchema = new Schema({
    billNumber: {type: String, required: true},
    date: {type: Date, required: true},
    credit: [
        { 
            account: {type: Schema.Types.ObjectId, ref: 'Ledger'},
            amount: {type: Number}
        }
    ],
    debit: [
        {
            account: {type: Schema.Types.ObjectId, ref: 'Ledger'},
            amount: {type: Number}
        }
    ]
});

var Finance = module.exports = mongoose.model('Finance', financeSchema);

module.exports.getAllFinances = function(callback){
  Finance.find().lean().exec(function(err, finances){
    if (err) return callback(err, null);
    callback(null, finances);
  });
};

module.exports.getFinanceById = function(id, callback){
  Finance.find({_id: id}).lean().exec(function(err, finance){
    if(err) return callback(err, null);
    callback(null, finance);
  });
};

module.exports.createFinance = function(newFinance, callback){
  newFinance.save(callback);
};

module.exports.updateFinance = function(updatedValuesOfExistingFinance, callback){
  Finance.update(
    {"_id": updatedValuesOfExistingFinance.id},
    {"$set": {"billNumber": updatedValuesOfExistingFinance.billNumber, "date": updatedValuesOfExistingFinance.date,
              "credit.$": {"account": updatedValuesOfExistingFinance.credit.$.account,
                           "amount": updatedValuesOfExistingFinance.credit.$.amount},
              "debit.$": {"account": updatedValuesOfExistingFinance.debit.$.account,
                          "amount": updatedValuesOfExistingFinance.debit.$.amount}}},
    {multi: false},
    callback
  );
};

module.exports.deleteFinance = function(id, callback){
    Finance.remove({_id: id}, function(err, finance) {
        if(err) return callback(err, null);
        callback(null, finance);
    });
};