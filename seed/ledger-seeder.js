var Group = require('../models/masters/group/group');
var Ledger = require('../models/masters/ledger/ledger');
var State = require('../models/landDivision/state');
var CreditDebit = require('../models/general/creditDebit');

var mongoose = require('mongoose');
mongoose.connect('localhost:27017/accountdb');

function seedLedgers(ledgerName, alias, parentName, isSystemLedger, mailingName, mailingAddress, mailingState, mailingPinCode, contactPerson, contactMobile1, contactMobile2, contactEmail, bankAccountNumber, bankBranchName, bankBsrCode, taxPanOrItNumber, taxSalesTaxNumber, openingBalanceAmount, openingBalanceCreditOrDebit, callback) {
    State.find({ name: mailingState || '' })
        .exec(function(err, state) {
            if(err) { console.log(err); }
            else {
                CreditDebit.find({ name: openingBalanceCreditOrDebit || '' })
                        .exec(function(err2, creditDebit) {
                            if(err2) { console.log(err2); }
                            else {
                                Group.find({ name: parentName || '' })
                                    .exec(function(err3, parent) {
                                        if(err3) { console.log(err3); }
                                        else {
                                            var parentGroup = parent[0];
                                            // console.log(parentGroup);
                                            var ledger = new Ledger({
                                                name: ledgerName,
                                                alias: alias || undefined,
                                                parent: parent != null ? parentGroup : undefined,
                                                isSystemLedger: isSystemLedger || false,
                                                details: {
                                                    mailing: {
                                                        name: (!(parent == null || parentGroup == undefined)) ? (parentGroup.details.mailing ? mailingName : undefined) : undefined,
                                                        address: (!(parent == null || parentGroup == undefined)) ? (parentGroup.details.mailing ? mailingAddress : undefined) : undefined,
                                                        state: (!(parent == null || parentGroup == undefined)) ? (parentGroup.details.mailing ? (state != null ? state[0] : undefined) : undefined) : undefined,
                                                        pincode: (!(parent == null || parentGroup == undefined)) ? (parentGroup.details.mailing ? mailingPinCode : undefined) : undefined
                                                    },
                                                    contact: {
                                                        contactPerson: (!(parent == null || parentGroup == undefined)) ? (parentGroup.details.contact ? contactPerson : undefined) : undefined,
                                                        mobile1: (!(parent == null || parentGroup == undefined)) ? (parentGroup.details.contact ? contactMobile1 : undefined) : undefined,
                                                        mobile2: (!(parent == null || parentGroup == undefined)) ? (parentGroup.details.contact ? contactMobile2 : undefined) : undefined,
                                                        email: (!(parent == null || parentGroup == undefined)) ? (parentGroup.details.contact ? contactEmail : undefined) : undefined
                                                    },
                                                    bank: {
                                                        accountNumber: (!(parent == null || parentGroup == undefined)) ? (parentGroup.details.bank ? bankAccountNumber : undefined) : undefined,
                                                        branchName: (!(parent == null || parentGroup == undefined)) ? (parentGroup.details.bank ? bankBranchName : undefined) : undefined,
                                                        bsrCode: (!(parent == null || parentGroup == undefined)) ? (parentGroup.details.bank ? bankBsrCode : undefined) : undefined
                                                    },
                                                    tax: {
                                                        panOrItNumber: (!(parent == null || parentGroup == undefined)) ? (parentGroup.details.tax ? taxPanOrItNumber : undefined) : undefined,
                                                        salesTaxNumber: (!(parent == null || parentGroup == undefined)) ? (parentGroup.details.tax ? taxSalesTaxNumber : undefined) : undefined,
                                                    }
                                                },
                                                openingBalance: {
                                                    amount: openingBalanceAmount || 0,
                                                    creditOrDebit: creditDebit != null ? creditDebit[0] : undefined
                                                }
                                            });
                                            ledger.save(function(err4, result){
                                                if(err4) {console.log(err4);}
                                                else { callback(); }
                                            });
                                        }
                                    });
                            }
                        });
            }
        });
}

let ledgers = [
    ['Cash', null, 'Cash-in-Hand', true, null, null, null, null, null, null, null, null, null, null, null, null, null, 0, 'Credit'],
    ['Profit & Loss A/c', null, null, true, null, null, null, null, null, null, null, null, null, null, null, null, null, 0, 'Credit']
];

let callback = function(e,r) { 
    console.log('Ledgers Saved');
    mongoose.disconnect(); 
};

for (let i = ledgers.length-1; i>= 0; i--) {
  let ledger = ledgers[i];
  ledger.push( callback );
  callback = function(e,r) { seedLedgers.apply(this, ledger); }
}

callback();