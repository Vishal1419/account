var express = require('express')
var router = express.Router();

var CreditDebit = require('../../models/general/creditDebit');
var cs = require('../../helpers/compareStrings')

router.get('/', function(req, res, next) {

    //retrieve all creditDebits from CreditDebit model
    CreditDebit.getAllCreditDebits(function(err, creditDebits) {
        if(err) { return res.status(400).json(err); }
        else { res.status(200).json(creditDebits); }
    });

});

router.get('/:id', function(req, res, next){

  var creditDebitId = req.params.id;

  CreditDebit.getCreditDebitById(creditDebitId, function(err, creditDebit) {
 
        if (err) {
            return res.status(400).json(err);
        } else { res.status(200).json(creditDebit); }

  });

});

router.get('/:name/:currentCreditDebitName', function(req, res, next){

  var creditDebitName = req.params.name;
  var currentCreditDebitName = req.params.currentCreditDebitName;

  CreditDebit.getCreditDebitByName(creditDebitName, function(err, creditDebit) {
 
        if (err) {
            return res.status(400).json(err);
        } else { 
            if(!(creditDebit == undefined || creditDebit.length < 1 || cs(creditDebitName, currentCreditDebitName, true, false))) { res.status(200).json(creditDebit); }
            else { res.status(404).json(creditDebit); }
        }

  });

});

router.get('/code/:code/:currentCreditDebitCode', function(req, res, next){

  var creditDebitCode = req.params.code;
  var currentCreditDebitCode = req.params.currentCreditDebitCode;

  CreditDebit.getCreditDebitByCode(creditDebitCode, function(err, creditDebit) {
 
        if (err) {
            return res.status(400).json(err);
        } else { 
            if(!(creditDebit == undefined || creditDebit.length < 1 || cs(creditDebitCode, currentCreditDebitCode, true, false))) { res.status(200).json(creditDebit); }
            else { res.status(404).json(creditDebit); }
        }

  });

});

router.post('/', function(req, res, next){

    var name = req.body.name;
    var code = req.body.code;

    CreditDebit.find(function(err, creditDebits) {

        if(err){
            res.status(400).json(err);
        }

        req.checkBody('name', 'CreditDebit name is required.').notEmpty();
        req.checkBody('name', 'Duplicate creditDebit name.').duplicateRecord('name', creditDebits);
        req.checkBody('code', 'CreditDebit code is required.').notEmpty();
        req.checkBody('code', 'Duplicate creditDebit code.').duplicateRecord('code', creditDebits);
        var errors = req.validationErrors();

        if(errors) {
            res.status(400).json({errors: errors});
        } else {

            var creditDebit = new CreditDebit({
                name: name,
                code: code,
                isSystemCreditDebit: false
            });

            CreditDebit.createCreditDebit(creditDebit, function(err, result) {
                if(err) { throw(err) }
                else { res.status(200).json({success: {msg: 'CreditDebit ' + name + ' saved successfully'}}); }
            });

        }

    });

});

router.put('/:id', function(req, res, next) {

    var id = req.params.id;
    var name = req.body.name;
    var code = req.body.code;
    var isSystemCreditDebit = req.body.isSystemCreditDebit;

    CreditDebit.find(function(err, creditDebits) {

        CreditDebit.find({_id: id}, function(err, originalCreditDebit) {

            if(err){
                res.status(400).json(err);
            }

            req.checkBody('name', 'CreditDebit name is required.').notEmpty();
            req.checkBody('name', 'Duplicate creditDebit name.').duplicateRecordExcludingCurrentRecord('name', creditDebits, originalCreditDebit[0].name);
            req.checkBody('code', 'CreditDebit code is required.').notEmpty();
            req.checkBody('code', 'Duplicate creditDebit code.').duplicateRecordExcludingCurrentRecord('code', creditDebits, originalCreditDebit[0].code);
            var errors = req.validationErrors();

            if(errors) {
                res.status(400).json({errors: errors});
            } else {

                var creditDebit = new CreditDebit({
                    _id: id,
                    name: name,
                    code: code,
                    isSystemCreditDebit: isSystemCreditDebit
                });

                CreditDebit.updateCreditDebit(creditDebit, function(err, result) {
                    if(err) { throw(err) }
                    else { res.status(200).json({success: {msg: 'CreditDebit ' + name + ' updated successfully'}}); }
                });

            }

        })

    });

});

router.delete('/:id/:name', function(req, res, next) {

    var creditDebitId = req.params.id;

    CreditDebit.deleteCreditDebit(creditDebitId, function(err, result) { 

        if(err) {
            res.status(400).json({errors: errors});
        } else {
            res.status(200).json({success: {msg: 'CreditDebit ' + req.params.name + ' deleted successfully'}});
        }

    });

});

module.exports = router;