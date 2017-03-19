var express = require('express')
var router = express.Router();

var Unit = require('../../../models/masters/unit/unit');
var Group = require('../../../models/masters/group/group');
var Item = require('../../../models/masters/item/item');

var cs = require('../../../helpers/compareStrings');

router.get('/', function(req, res, next) {

    Item.getAllItems(function(err, items) {
        if(err) { res.status(400).json(err); }
        else { res.status(200).json(items); }
    });

});

router.get('/:id', function(req, res, next){

  var itemId = req.params.id;

  Item.getItemById(itemId, function(err, item) {
 
        if (err) { return res.status(400).json(err); } 
        else { res.status(200).json(item); }

  });

});

router.get('/:name/:currentItemName', function(req, res, next){

  var itemName = req.params.name;
  var currentItemName = req.params.currentItemName;

  Item.getItemByName(itemName, function(err, item) {
 
        if (err) {
            return res.status(400).json(err);
        } else { 
            if(!(item == undefined || item.length < 1 || cs(itemName, currentItemName, true, false))) { res.status(200).json(item); }
            else { res.status(404).json(item); }
        }

  });

});

router.get('/symbol/:symbol/:currentItemSymbol', function(req, res, next) {

  var itemSymbol = req.params.symbol;
  var currentItemSymbol = req.params.currentItemSymbol;

  Item.getItemBySymbol(itemSymbol, function(err, item) {
 
        if (err) {
            return res.status(400).json(err);
        } else { 
            if(!(item == undefined || item.length < 1 || cs(itemSymbol, currentItemSymbol, true, false))) { res.status(200).json(item); }
            else { res.status(404).json(item); }
        }

  });

});

router.post('/', function(req, res){

    var name = req.body.name;
    var alias = req.body.alias;
    var parent = req.body.parent == undefined ? '' : req.body.parent;
    var unit = req.body.unit == undefined ? '' : req.body.unit;

    Item.getAllItems(function(err, items) {
  
        Group.getGroupByName("Stock-in-Hand", function(err, group) {

            Group.getDescendentsOfSelectedGroupWithItself(group._id, 100).then(function(groups) {

                Unit.getAllUnits(function(err, units) {

                    if (err) {
                        res.status(400).json(err);
                    } 

                    req.checkBody('name', 'Item name is required.').notEmpty();
                    req.checkBody('name', 'Duplicate item Name.').duplicateRecord('name', items);

                    if(parent.name == undefined) {
                        req.checkBody('parent', 'Parent name is required.').notEmpty();
                        req.checkBody('parent', 'Please select stock group from list.').noRecordFound('name', groups);            
                    } else {
                        req.checkBody('parent.name', 'Parent name is required.').notEmpty();
                        req.checkBody('parent.name', 'Please select stock group from list.').noRecordFound('name', groups);
                        parent = parent.name;
                    }

                    if(unit == '') {
                        unit = undefined;
                    } else {
                        if(unit.symbol == undefined) {
                            req.checkBody('unit', 'Please select unit from list.').noRecordFound('symbol', units);            
                        } else {
                            req.checkBody('unit.symbol', 'Please select unit from list.').noRecordFound('symbol', units);
                            unit = unit.symbol;
                        }
                    }

                    //Check for errors
                    var errors = req.validationErrors();

                    if(errors){
                        res.status(400).json({errors: errors});
                    } else {

                        Group.getGroupByName(parent, function(err, parentGroup) {

                            Unit.getUnitBySymbol(unit == undefined ? '' : unit, function(err, selectedUnit) {

                                var newItem = new Item({
                                    name: name,
                                    alias: alias,
                                    parent: parentGroup[0],
                                    unit: selectedUnit[0],
                                    isSystemItem: false,
                                    tax: (req.body.tax == undefined) ? undefined : {
                                            rate: req.body.tax.rate
                                    },
                                    openingBalance: {
                                        quantity: (req.body.openingBalance == undefined || req.body.openingBalance.quantity == undefined) ? 0 : req.body.openingBalance.quantity,
                                        rate: (req.body.openingBalance == undefined || req.body.openingBalance.rate == undefined) ? 0 : req.body.openingBalance.rate,
                                        amount: (req.body.openingBalance == undefined || req.body.openingBalance.amount == undefined) ? 0 : req.body.openingBalance.amount
                                    }

                                });

                                Item.createItem(newItem, function(err, result){

                                    if(err) { throw(err); }
                                    else { res.status(200).json({success: {msg: 'Item ' + name + ' saved successfully'}}); }

                                });

                            });

                        });

                    }

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
    var unit = req.body.unit == undefined ? '' : req.body.unit;
    var isSystemItem = req.body.isSystemItem;

        Group.getGroupByName("Stock-in-Hand", function(err, group) {

            Group.getDescendentsOfSelectedGroupWithItself(group._id, 100).then(function(groups) {

                Item.getAllItems(function(err, items) {

                    Unit.getAllUnits(function(err, units) {

                        Item.getItemById(id, function(err, originalItem) {

                        if (err) {
                            res.status(400).json(err);
                        } 

                        req.checkBody('name', 'Item name is required.').notEmpty();
                        req.checkBody('name', 'Duplicate item Name.').duplicateRecordExcludingCurrentRecord('name', items, originalItem[0].name);

                        if(parent.name == undefined) {
                            req.checkBody('parent', 'Parent name is required.').notEmpty();
                            req.checkBody('parent', 'Please select stock group from list.').noRecordFound('name', groups);            
                        } else {
                            req.checkBody('parent.name', 'Parent name is required.').notEmpty();
                            req.checkBody('parent.name', 'Please select stock group from list.').noRecordFound('name', groups);
                            parent = parent.name;
                        }

                        if(unit == '') {
                            unit = undefined;
                        } else {
                            if(unit.symbol == undefined) {
                                req.checkBody('unit', 'Please select unit from list.').noRecordFound('symbol', units);            
                            } else {
                                req.checkBody('unit.symbol', 'Please select unit from list.').noRecordFound('symbol', units);
                                unit = unit.symbol;
                            }
                        }

                        //Check for errors
                        var errors = req.validationErrors();

                        if(errors) {
                            res.status(400).json({errors: errors});
                        } else {

                            Group.getGroupByName(parent, function(err, parentGroup) {

                                Unit.getUnitBySymbol(unit == undefined ? '' : unit, function(err, selectedUnit) {

                                    var newItem = new Item({
                                        _id: id,
                                        name: name,
                                        alias: alias || undefined,
                                        parent: parentGroup[0],
                                        unit: selectedUnit[0],
                                        isSystemItem: isSystemItem,
                                        tax: (req.body.tax == undefined) ? undefined : {
                                                rate: req.body.tax.rate
                                        },
                                        openingBalance: {
                                            quantity: (req.body.openingBalance == undefined || req.body.openingBalance.quantity == undefined) ? 0 : req.body.openingBalance.quantity,
                                            rate: (req.body.openingBalance == undefined || req.body.openingBalance.rate == undefined) ? 0 : req.body.openingBalance.rate,
                                            amount: (req.body.openingBalance == undefined || req.body.openingBalance.amount == undefined) ? 0 : req.body.openingBalance.amount
                                        }

                                    });

                                    Item.updateItem(newItem, function(err, result){
                                        console.log(result);
                                        if(err) { console.log(err); throw(err); }
                                        else { res.status(200).json({success: {msg: 'Item ' + name + ' updated successfully'}}); }

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

router.delete('/:id/:name', function(req, res, next) {

    var itemId = req.params.id;
        
    Item.deleteItem(itemId, function(err, result) { 

        if(err) {
            res.status(400).json({errors: errors});
        } else {
            res.status(200).json({success: {msg: 'Item ' + req.params.name + ' deleted successfully.'}});
        }

    });

});

module.exports = router;