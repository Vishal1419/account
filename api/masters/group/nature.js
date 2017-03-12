var express = require('express')
var router = express.Router();

var Nature = require('../../../models/masters/group/nature');
var cs = require('../../../helpers/compareStrings')

router.get('/', function(req, res, next) {

    //retrieve all natures from Nature model
    Nature.getAllNatures(function(err, natures) {
        if(err) { return res.status(400).json(err); }
        else { res.status(200).json(natures); }
    });

});

router.get('/:id', function(req, res, next){

  var natureId = req.params.id;

  Nature.getNatureById(natureId, function(err, nature) {
 
        if (err) {
            return res.status(400).json(err);
        } else { res.status(200).json(nature); }

  });

});

router.get('/:name/:currentNatureName', function(req, res, next){

  var natureName = req.params.name;
  var currentNatureName = req.params.currentNatureName;

  Nature.getNatureByName(natureName, function(err, nature) {
 
        if (err) {
            return res.status(400).json(err);
        } else { 
            if(!(nature == undefined || nature.length < 1 || cs(natureName, currentNatureName, true, false))) { res.status(200).json(nature); }
            else { res.status(404).json(nature); }
        }

  });

});

router.post('/', function(req, res, next){

    var name = req.body.name;

    Nature.find(function(err, natures) {

        if(err){
            res.status(400).json(err);
        }

        req.checkBody('name', 'Nature name is required.').notEmpty();
        req.checkBody('name', 'Duplicate nature name.').duplicateRecord('name', natures);
        var errors = req.validationErrors();

        if(errors) {
            res.status(400).json({errors: errors});
        } else {

            var nature = new Nature({
                name: name,
                isSystemNature: false
            });

            Nature.createNature(nature, function(err, result) {
                if(err) { throw(err) }
                else { res.status(200).json({success: {msg: 'Nature ' + name + ' saved successfully'}}); }
            });

        }

    });

});

router.put('/:id', function(req, res, next) {

    var id = req.params.id;
    var name = req.body.name;
    var isSystemNature = req.body.isSystemNature;

    Nature.find(function(err, natures) {

        Nature.find({_id: id}, function(err, originalNature) {

            if(err){
                res.status(400).json(err);
            }

            req.checkBody('name', 'Nature name is required.').notEmpty();
            req.checkBody('name', 'Duplicate nature name.').duplicateRecordExcludingCurrentRecord('name', natures, originalNature[0].name);
            var errors = req.validationErrors();

            if(errors) {
                res.status(400).json({errors: errors});
            } else {

                var nature = new Nature({
                    _id: id,
                    name: name,
                    isSystemNature: isSystemNature
                });

                Nature.updateNature(nature, function(err, result) {
                    if(err) { throw(err) }
                    else { res.status(200).json({success: {msg: 'Nature ' + name + ' updated successfully'}}); }
                });

            }

        })

    });

});

router.delete('/:id/:name', function(req, res, next) {

    var natureId = req.params.id;

    Nature.deleteNature(natureId, function(err, result) { 

        if(err) {
            res.status(400).json({errors: errors});
        } else {
            res.status(200).json({success: {msg: 'Nature ' + req.params.name + ' deleted successfully'}});
        }

    });

});

module.exports = router;