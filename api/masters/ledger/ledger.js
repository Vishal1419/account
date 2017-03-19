var express = require('express')
var router = express.Router();

var State = require('../../../models/landDivision/state');
var Group = require('../../../models/masters/group/group');
var CreditDebit = require('../../../models/general/creditDebit');
var Ledger = require('../../../models/masters/ledger/ledger');

var cs = require('../../../helpers/compareStrings');

router.get('/', function(req, res, next) {

    Ledger.getAllLedgers(function(err, ledgers) {
        if(err) { res.status(400).json(err); }
        else { res.status(200).json(ledgers); }
    });

});

router.get('/:id', function(req, res, next){

  var ledgerId = req.params.id;

  Ledger.getLedgerById(ledgerId, function(err, ledger) {
 
        if (err) { return res.status(400).json(err); } 
        else { res.status(200).json(ledger); }

  });

});

router.get('/:name/:currentLedgerName', function(req, res, next){

  var ledgerName = req.params.name;
  var currentLedgerName = req.params.currentLedgerName;

  Ledger.getLedgerByName(ledgerName, function(err, ledger) {
 
        if (err) {
            return res.status(400).json(err);
        } else { 
            if(!(ledger == undefined || ledger.length < 1 || cs(ledgerName, currentLedgerName, true, false))) { res.status(200).json(ledger); }
            else { res.status(404).json(ledger); }
        }

  });

});

router.post('/', function(req, res){

    var name = req.body.name;
    var alias = req.body.alias;
    var parent = req.body.parent == undefined ? '' : req.body.parent;
    var state = (req.body.details == undefined || req.body.details.mailing == undefined) ? undefined : req.body.details.mailing.state;
    var creditDebit = (req.body.openingBalance == undefined) ? undefined : req.body.openingBalance.creditOrDebit;

    Ledger.getAllLedgers(function(err, ledgers) {
  
        Group.getGroupByName("Stock-in-Hand", function(err, groupStockInHand) {

            Group.getGroupsOtherThanSelectedGroupAndItsDescendents(groupStockInHand[0]._id, 100).then(function(groups) {

                State.getAllStates(function(err, states) {

                    CreditDebit.getAllCreditDebits(function(err, creditDebits) {

                        if (err) {
                            res.status(400).json(err);
                        } 

                        req.checkBody('name', 'Ledger name is required.').notEmpty();
                        req.checkBody('name', 'Duplicate ledger Name.').duplicateRecord('name', ledgers);

                        if(parent.name == undefined) {
                            req.checkBody('parent', 'Parent name is required.').notEmpty();
                            req.checkBody('parent', 'Parent Name and ledger name should be different.').checkEquality(name, false);
                            req.checkBody('parent', 'Please select parent group from list.').noRecordFound('name', groups);            
                        } else {
                            req.checkBody('parent.name', 'Parent name is required.').notEmpty();
                            req.checkBody('parent.name', 'Parent Name and ledger name should be different.').checkEquality(name, false);
                            req.checkBody('parent.name', 'Please select parent group from list.').noRecordFound('name', groups);
                            parent = parent.name;
                        }

                        if(!(state == undefined || state.name == undefined || state.name == null || state.name == '')) {
                            req.checkBody('details.mailing.state.name', 'Please select state from list.').noRecordFound('name', states);
                            state = state.name;
                        } else {
                            state = undefined;
                        }

                        if(!(req.body.openingBalance == undefined || creditDebit == undefined || creditDebit.code == undefined || creditDebit.code == null || creditDebit == '')) {
                            req.checkBody('openingBalance.creditOrDebit.code', 'Please select Credit or Debit from list.').noRecordFound('code', creditDebits);
                            creditDebit = creditDebit.code;
                        } else {
                            creditDebit = undefined;
                        }

                        //Check for errors
                        var errors = req.validationErrors();

                        if(errors){
                            res.status(400).json({errors: errors});
                        } else {

                            Group.getGroupByName(parent, function(err, parentGroup) {

                                State.getStateByName(state == undefined ? '' : state, function(err, selectedState) {

                                    CreditDebit.getCreditDebitByCode(creditDebit == undefined ? 'Cr' : creditDebit, function(err, selectedCreditDebit) {

                                        var newLedger = new Ledger({
                                            name: name,
                                            alias: alias,
                                            parent: parentGroup[0],
                                            isSystemLedger: false,
                                            details: (req.body.details == undefined) ? undefined : {
                                                mailing: (req.body.details.mailing == undefined) ? undefined : { 
                                                    name: req.body.details.mailing.name,
                                                    address: req.body.details.mailing.address,
                                                    state: selectedState[0] || state,
                                                    pincode: req.body.details.mailing.pincode, 
                                                },
                                                contact: (req.body.details.contact == undefined) ? undefined : {
                                                    contactPerson: req.body.details.contact.contactPerson,
                                                    mobile1: req.body.details.contact.mobile1,
                                                    mobile2: req.body.details.contact.mobile2,
                                                    email: req.body.details.contact.email
                                                },
                                                bank: (req.body.details.bank == undefined) ? undefined : {
                                                    accountNumber: req.body.details.bank.accountNumber,
                                                    branchName: req.body.details.bank.branchName,
                                                    bsrCode: req.body.details.bank.bsrCode
                                                },
                                                tax: (req.body.details.tax == undefined) ? undefined : {
                                                    panOrItNumber: req.body.details.tax.panOrItNumber,
                                                    salesTaxNumber: req.body.details.tax.salesTaxNumber
                                                }
                                            },
                                            openingBalance: {
                                                amount: (req.body.openingBalance == undefined || req.body.openingBalance.amount == undefined) ? 0 : req.body.openingBalance.amount,
                                                creditOrDebit: selectedCreditDebit[0]
                                            }

                                        });

                                        Ledger.createLedger(newLedger, function(err, result){

                                            if(err) { throw(err); }
                                            else { res.status(200).json({success: {msg: 'Ledger ' + name + ' saved successfully'}}); }

                                        });

                                    });

                                });

                            });

                        }

                    });

                });

            });

        });

    });

});

router.put('/:id', function(req, res, next) {

    var id = req.params.id;
    var name = req.body.name;
    var alias = req.body.alias;
    var parent = req.body.parent == undefined ? '' : req.body.parent;
    var state = (req.body.details == undefined || req.body.details.mailing == undefined) ? undefined : req.body.details.mailing.state;
    var creditDebit = (req.body.openingBalance == undefined) ? undefined : req.body.openingBalance.creditOrDebit;
    var isSystemLedger = req.body.isSystemLedger;

    Group.getGroupByName("Stock-in-Hand", function(err, groupStockInHand) {

        Group.getGroupsOtherThanSelectedGroupAndItsDescendents(groupStockInHand[0]._id, 100).then(function(groups) {

            Ledger.getAllLedgers(function(err, ledgers) {

                State.getAllStates(function(err, states) {

                    CreditDebit.getAllCreditDebits(function(err, creditDebits) {

                        Ledger.getLedgerById(id, function(err, originalLedger) {

                            if (err) {
                                res.status(400).json(err);
                            } 

                            req.checkBody('name', 'Ledger name is required.').notEmpty();
                            req.checkBody('name', 'Duplicate ledger Name.').duplicateRecordExcludingCurrentRecord('name', ledgers, originalLedger[0].name);

                            if(parent.name == undefined) {
                                req.checkBody('parent', 'Parent name is required.').notEmpty();
                                req.checkBody('parent', 'Parent Name and ledger name should be different.').checkEquality(name, false);
                                req.checkBody('parent', 'Please select parent group from list.').noRecordFound('name', groups);            
                            } else {
                                req.checkBody('parent.name', 'Parent name is required.').notEmpty();
                                req.checkBody('parent.name', 'Parent Name and ledger name should be different.').checkEquality(name, false);
                                req.checkBody('parent.name', 'Please select parent group from list.').noRecordFound('name', groups);
                                parent = parent.name;
                            }

                            if(!(state == undefined || state.name == undefined || state.name == null || state.name == '')) {
                                req.checkBody('details.mailing.state.name', 'Please select state from list.').noRecordFound('name', states);
                                state = state.name;
                            } else {
                                console.log(state);
                                state = undefined;
                            }

                            if(!(req.body.openingBalance == undefined || creditDebit == undefined || creditDebit.code == undefined || creditDebit.code == null || creditDebit == '')) {
                                req.checkBody('openingBalance.creditOrDebit.code', 'Please select Credit or Debit from list.').noRecordFound('code', creditDebits);
                                creditDebit = creditDebit.code;
                            } else {
                                creditDebit = undefined;
                            }

                            //Check for errors
                            var errors = req.validationErrors();

                            if(errors) {
                                res.status(400).json({errors: errors});
                            } else {

                                Group.getGroupByName(parent, function(err, parentGroup) {

                                    console.log(state);

                                    State.getStateByName((state == undefined ? '' : state), function(err, selectedState) {

                                        CreditDebit.getCreditDebitByCode(creditDebit == undefined ? 'Cr' : creditDebit, function(err, selectedCreditDebit) {

                                            var newLedger = new Ledger({
                                                _id: id,
                                                name: name,
                                                alias: alias || undefined,
                                                parent: parentGroup[0],
                                                isSystemLedger: isSystemLedger,
                                                details: (req.body.details == undefined) ? undefined : {
                                                    mailing: (req.body.details.mailing == undefined) ? undefined : { 
                                                        name: req.body.details.mailing.name || undefined,
                                                        address: req.body.details.mailing.address || undefined,
                                                        state: selectedState[0],
                                                        pincode: req.body.details.mailing.pincode || undefined, 
                                                    },
                                                    contact: (req.body.details.contact == undefined) ? undefined : {
                                                        contactPerson: req.body.details.contact.contactPerson || undefined,
                                                        mobile1: req.body.details.contact.mobile1 || undefined,
                                                        mobile2: req.body.details.contact.mobile2 || undefined,
                                                        email: req.body.details.contact.email || undefined
                                                    },
                                                    bank: (req.body.details.bank == undefined) ? undefined : {
                                                        accountNumber: req.body.details.bank.accountNumber || undefined,
                                                        branchName: req.body.details.bank.branchName || undefined,
                                                        bsrCode: req.body.details.bank.bsrCode || undefined
                                                    },
                                                    tax: (req.body.details.tax == undefined) ? undefined : {
                                                        panOrItNumber: req.body.details.tax.panOrItNumber || undefined,
                                                        salesTaxNumber: req.body.details.tax.salesTaxNumber || undefined
                                                    }
                                                },
                                                openingBalance: {
                                                    amount: (req.body.openingBalance == undefined || req.body.openingBalance.amount == undefined) ? 0 : req.body.openingBalance.amount,
                                                    creditOrDebit: selectedCreditDebit[0]
                                                }

                                            });

                                            Ledger.updateLedger(newLedger, function(err, result){
                                                console.log(result);
                                                if(err) { console.log(err); throw(err); }
                                                else { res.status(200).json({success: {msg: 'Ledger ' + name + ' updated successfully'}}); }

                                            });

                                        });

                                    });

                                });

                            }

                        });

                    });

                });

            });

        });

    });

});

router.delete('/:id/:name', function(req, res, next) {

    var ledgerId = req.params.id;
        
    Ledger.deleteLedger(ledgerId, function(err, result) { 

        if(err) {
            res.status(400).json({errors: errors});
        } else {
            res.status(200).json({success: {msg: 'Ledger ' + req.params.name + ' deleted successfully.'}});
        }

    });

});

module.exports = router;