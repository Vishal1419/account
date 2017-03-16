var express = require('express')
var router = express.Router();

var Unit = require('../../../models/masters/unit/unit');
var cs = require('../../../helpers/compareStrings')

router.get('/', function(req, res, next) {

    //retrieve all units from Unit model
    Unit.getAllUnits(function(err, units) {
        if(err) { return res.status(400).json(err); }
        else { res.status(200).json(units); }
    });

});

router.get('/:id', function(req, res, next){

  var unitId = req.params.id;

  Unit.getUnitById(unitId, function(err, unit) {
 
        if (err) {
            return res.status(400).json(err);
        } else { res.status(200).json(unit); }

  });

});

router.get('/:name/:currentUnitName', function(req, res, next){

  var unitName = req.params.name;
  var currentUnitName = req.params.currentUnitName;

  Unit.getUnitByName(unitName, function(err, unit) {
 
        if (err) {
            return res.status(400).json(err);
        } else { 
            if(!(unit == undefined || unit.length < 1 || cs(unitName, currentUnitName, true, false))) { res.status(200).json(unit); }
            else { res.status(404).json(unit); }
        }

  });

});

router.get('/symbol/:symbol/:currentUnitSymbol', function(req, res, next){

  var unitSymbol = req.params.symbol;
  var currentUnitSymbol = req.params.currentUnitSymbol;

  Unit.getUnitBySymbol(unitSymbol, function(err, unit) {
 
        if (err) {
            return res.status(400).json(err);
        } else { 
            if(!(unit == undefined || unit.length < 1 || cs(unitSymbol, currentUnitSymbol, true, false))) { res.status(200).json(unit); }
            else { res.status(404).json(unit); }
        }

  });

});


router.post('/', function(req, res, next){

    var name = req.body.name;
    var symbol = req.body.symbol;
    var numberOfDecimalPlaces = req.body.numberOfDecimalPlaces;

    Unit.find(function(err, units) {

        if(err){
            res.status(400).json(err);
        }

        req.checkBody('name', 'Unit name is required.').notEmpty();
        req.checkBody('name', 'Duplicate unit name.').duplicateRecord('name', units);
        req.checkBody('symbol', 'Unit symbol is required.').notEmpty();
        req.checkBody('symbol', 'Duplicate unit symbol.').duplicateRecord('symbol', units);
        req.checkBody('numberOfDecimalPlaces', 'Please enter number of decimal places.').notEmpty();
        var errors = req.validationErrors();

        if(errors) {
            res.status(400).json({errors: errors});
        } else {

            var unit = new Unit({
                name: name,
                symbol: symbol,
                numberOfDecimalPlaces: numberOfDecimalPlaces,
                isSystemUnit: false
            });

            Unit.createUnit(unit, function(err, result) {
                if(err) { throw(err) }
                else { res.status(200).json({success: {msg: 'Unit ' + name + ' saved successfully'}}); }
            });

        }

    });

});

router.put('/:id', function(req, res, next) {

    var id = req.params.id;
    var name = req.body.name;
    var symbol = req.body.symbol;
    var numberOfDecimalPlaces = req.body.numberOfDecimalPlaces;
    var isSystemUnit = req.body.isSystemUnit;

    Unit.find(function(err, units) {

        Unit.find({_id: id}, function(err, originalUnit) {

            if(err){
                res.status(400).json(err);
            }

            req.checkBody('name', 'Unit name is required.').notEmpty();
            req.checkBody('name', 'Duplicate unit name.').duplicateRecordExcludingCurrentRecord('name', units, originalUnit[0].name);
            req.checkBody('symbol', 'Unit symbol is required.').notEmpty();
            req.checkBody('symbol', 'Duplicate unit symbol.').duplicateRecordExcludingCurrentRecord('symbol', units, originalUnit[0].symbol);
            req.checkBody('numberOfDecimalPlaces', 'Please enter number of decimal places.').notEmpty();
            var errors = req.validationErrors();

            if(errors) {
                res.status(400).json({errors: errors});
            } else {

                var unit = new Unit({
                    _id: id,
                    name: name,
                    symbol: symbol,
                    numberOfDecimalPlaces: numberOfDecimalPlaces,
                    isSystemUnit: isSystemUnit
                });

                Unit.updateUnit(unit, function(err, result) {
                    if(err) { throw(err) }
                    else { res.status(200).json({success: {msg: 'Unit ' + name + ' updated successfully'}}); }
                });

            }

        })

    });

});

router.delete('/:id/:name', function(req, res, next) {

    var unitId = req.params.id;

    Unit.deleteUnit(unitId, function(err, result) { 

        if(err) {
            res.status(400).json({errors: errors});
        } else {
            res.status(200).json({success: {msg: 'Unit ' + req.params.name + ' deleted successfully'}});
        }

    });

});

module.exports = router;