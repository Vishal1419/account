var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var encodeURL = require("../../../helpers/encodeURL");

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
            salesTaxNumber: {type: String}
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
    
    console.log(updatedValuesOfExistingLedger);

    const operators = { "$set" : {
                            "name" : updatedValuesOfExistingLedger, 
                            "parent" : updatedValuesOfExistingLedger.parent, 
                            "isSystemLedger" : updatedValuesOfExistingLedger.isSystemLedger 
                         }
                      };

    if(updatedValuesOfExistingLedger.alias) {
        operators.$set.alias = updatedValuesOfExistingLedger.alias;
    } else {
        operators.$unset = {alias: 1};
    }

    if(updatedValuesOfExistingLedger.details) {

        operators.$set.details = {};

        if(updatedValuesOfExistingLedger.details.mailing) {

            operators.$set.details.mailing = {};

            if(updatedValuesOfExistingLedger.details.mailing.name) {
                operators.$set.details.mailing.name = updatedValuesOfExistingLedger.details.mailing.name;
            } else {
                operators.$unset = {"details.mailing.name": 1};
            }
            if(updatedValuesOfExistingLedger.details.mailing.address) {
                operators.$set.details.mailing.address = updatedValuesOfExistingLedger.details.mailing.address;
            } else {
                operators.$unset = {"details.mailing.address": 1};
            }
            if(updatedValuesOfExistingLedger.details.mailing.state) {
                operators.$set.details.mailing.state = updatedValuesOfExistingLedger.details.mailing.state;
            } else {
                operators.$unset = {"details.mailing.state": 1};
            }
            if(updatedValuesOfExistingLedger.details.mailing.pincode) {
                operators.$set.details.mailing.pincode = updatedValuesOfExistingLedger.details.mailing.pincode;
            } else {
                operators.$unset = {"details.mailing.pincode": 1};
            }
        } else {
            operators.$unset = {"details.mailing": 1};
        }
        if(updatedValuesOfExistingLedger.details.contact) {

            operators.$set.details.contact = {};

            if(updatedValuesOfExistingLedger.details.contact.contactPerson) {
                operators.$set.details.contact.contactPerson = updatedValuesOfExistingLedger.details.contact.contactPerson;
            } else {
                operators.$unset = {"details.contact.contactPerson": 1};
            }
            if(updatedValuesOfExistingLedger.details.contact.mobile1) {
                operators.$set.details.contact.mobile1 = updatedValuesOfExistingLedger.details.contact.mobile1;
            } else {
                operators.$unset = {"details.contact.mobile1": 1};
            }
            if(updatedValuesOfExistingLedger.details.contact.mobile2) {
                operators.$set.details.contact.mobile2 = updatedValuesOfExistingLedger.details.contact.mobile2;
            } else {
                operators.$unset = {"details.contact.mobile2": 1};
            }
            if(updatedValuesOfExistingLedger.details.contact.email) {
                operators.$set.details.contact.email = updatedValuesOfExistingLedger.details.contact.email;
            } else {
                operators.$unset = {"details.contact.email": 1};
            }
        } else {
            operators.$unset = {"details.contact": 1};
        }
         if(updatedValuesOfExistingLedger.details.bank) {

            operators.$set.details.bank = {}; 

            if(updatedValuesOfExistingLedger.details.bank.accountNumber) {
                operators.$set.details.bank.accountNumber = updatedValuesOfExistingLedger.details.bank.accountNumber;
            } else {
                operators.$unset = {"details.bank.accountNumber": 1};
            }
            if(updatedValuesOfExistingLedger.details.bank.branchName) {
                operators.$set.details.bank.branchName = updatedValuesOfExistingLedger.details.bank.branchName;
            } else {
                operators.$unset = {"details.bank.branchName": 1};
            }
            if(updatedValuesOfExistingLedger.details.bank.bsrCode) {
                operators.$set.details.bank.bsrCode = updatedValuesOfExistingLedger.details.bank.bsrCode;
            } else {
                operators.$unset = {"details.bank.bsrCode": 1};
            }
        } else {
            operators.$unset = {"details.bank": 1};
        }
         if(updatedValuesOfExistingLedger.details.tax) {

            operators.$set.details.tax = {}; 

            if(updatedValuesOfExistingLedger.details.tax.panOrItNumber) {
                operators.$set.details.tax.panOrItNumber = updatedValuesOfExistingLedger.details.tax.panOrItNumber;
            } else {
                operators.$unset = {"details.tax.panOrItNumber": 1};
            }
            if(updatedValuesOfExistingLedger.details.tax.salesTaxNumber) {
                operators.$set.details.tax.salesTaxNumber = updatedValuesOfExistingLedger.details.tax.salesTaxNumber;
            } else {
                operators.$unset = {"details.tax.salesTaxNumber": 1};
            }
        } else {
            operators.$unset = {"details.tax": 1};
        }
    } else {
        operators.$unset = {"details": 1};
    }

    if(updatedValuesOfExistingLedger.openingBalance) {

        operators.$set.openingBalance = {};

        if(updatedValuesOfExistingLedger.openingBalance.amount) {
            operators.$set.openingBalance.amount = updatedValuesOfExistingLedger.openingBalance.amount;
        } else {
            operators.$unset = {"openingBalance.amount": 1};
        }
        if(updatedValuesOfExistingLedger.openingBalance.creditOrDebit) {
            operators.$set.openingBalance.creditOrDebit = updatedValuesOfExistingLedger.openingBalance.creditOrDebit;
        } else {
            operators.$unset = {"openingBalance.creditOrDebit": 1};
        }
    } else {
        operators.$unset = {"openingBalance": 1};
    }

  Ledger.update({"_id": updatedValuesOfExistingLedger.id}, operators, {multi: false}, callback);
  
};

module.exports.deleteLedger = function(id, callback){
    Ledger.remove({_id: id}, function(err, ledger) {
        if(err) return callback(err, null);
        callback(null, ledger);
    });
};