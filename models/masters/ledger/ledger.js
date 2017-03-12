var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ledgerSchema = new Schema({
    name: {type: String, required: true},
    alias: {type: String},
    parent: {type: Schema.Types.ObjectId, ref: 'Group'},
    isSystemLedger: {type: Boolean},
    details: {
        mailing: {
            name: {type: String},
            address: {type: String},
            state: {type: Schema.Types.ObjectId, ref: 'State'},
            pincode: {type: String}
        },
        contact: {
            contactPerson: {type: String},
            mobile1: {type: String},
            mobile2: {type: String},
            email: {type: String}
        },
        bank: {
            accountNumber: {type: String},
            branchName: {type: String},
            bsrCode: {type: String}
        },
        tax: {
            panOrItNumber: {type: String},
            salesTaxNumbr: {type: String}
        }
    },
    openingBalance: {
        amount: {type: Number, required: true},
        creditOrDebit: {type: Schema.Types.ObjectId, ref: 'CreditDebit'}
    }
});

var Ledger = module.exports = mongoose.model('Ledger', ledgerSchema);

module.exports.getAllLedgers = function(callback){
  Ledger.find().sort('name').populate('parent').populate('details.mailing.state').populate('openingBalance.creditOrDebit').exec(function(err, ledgers){
    if (err) return callback(err, null);
    callback(null, ledgers);
  });
};

module.exports.getLedgerById = function(id, callback){
  Ledger.find({_id: id}).sort('name').populate('parent').populate('details.mailing.state').populate('openingBalance.creditOrDebit').exec(function(err, ledger){
    if(err) return callback(err, null);
    callback(null, ledger);
  });
};

module.exports.getLedgerByName = function(name, callback){
    name = encodeURL(name);
    Ledger.find({name: new RegExp('^'+name+'$', "i")}).sort('name').populate('parent').populate('details.mailing.state').populate('openingBalance.creditOrDebit').exec(function(err, ledger){
        if(err) return callback(err, null);
        callback(null, ledger);
    });
};

module.exports.createLedger = function(newLedger, callback){
  newLedger.save(callback);
};

module.exports.updateLedger = function(updatedValuesOfExistingLedger, callback){
  Ledger.update(
    {"_id": updatedValuesOfExistingLedger.id},
    {"$set": {"name": updatedValuesOfExistingLedger.name, "alias": updatedValuesOfExistingLedger.alias,
              "parent": updatedValuesOfExistingLedger.parent, "isSystemLedger": updatedValuesOfExistingLedger.isSystemLedger,
              "details": { "mailing": { "name": updatedValuesOfExistingLedger.details.mailing.name,
                                        "address": updatedValuesOfExistingLedger.details.mailing.address,
                                        "state": updatedValuesOfExistingLedger.details.mailing.state,
                                        "pincode": updatedValuesOfExistingLedger.details.mailing.pincode},
                           "contact": { "contactPerson": updatedValuesOfExistingLedger.details.contact.contactPerson,
                                        "mobile1": updatedValuesOfExistingLedger.details.contact.mobile1,
                                        "mobile2": updatedValuesOfExistingLedger.details.contact.mobile2,
                                        "email": updatedValuesOfExistingLedger.details.contact.email},
                           "bank": { "accountNumber": updatedValuesOfExistingLedger.details.bank.accountNumber,
                                     "branchName": updatedValuesOfExistingLedger.details.bank.branchName,
                                     "bsrCode": updatedValuesOfExistingLedger.details.bank.bsrCode},
                           "tax": { "panOrItNumber": updatedValuesOfExistingLedger.details.tax.panOrItNumber,
                                    "salesTaxNumbr": updatedValuesOfExistingLedger.details.tax.salesTaxNumbr}},
              "openingBalance": { "amount": updatedValuesOfExistingLedger.openingBalance.amount,
                                  "creditOrDebit": updatedValuesOfExistingLedger.openingBalance.creditOrDebit}}},
    {multi: false},
    callback
  );
};

module.exports.deleteLedger = function(id, callback){
    Ledger.remove({_id: id}, function(err, ledger) {
        if(err) return callback(err, null);
        callback(null, ledger);
    });
};