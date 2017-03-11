var express = require('express')
var router = express.Router();

var Effect = require('../../../models/masters/group/Effect');
var cs = require('../../../helpers/compareStrings')

router.get('/', function(req, res, next) {

    //retrieve all effects from Effect model
    Effect.getAllEffects(function(err, effects) {
        if(err) { return res.status(400).json(err); }
        else { res.status(200).json(effects); }
    });

});

router.get('/:id', function(req, res, next){

  var effectId = req.params.id;

  Effect.getEffectById(effectId, function(err, effect) {
 
        if (err) {
            return res.status(400).json(err);
        } else { res.status(200).json(effect); }

  });

});

router.get('/:name/:currentEffectName', function(req, res, next){

  var effectName = req.params.name;
  var currentEffectName = req.params.currentEffectName;

  Effect.getEffectByName(effectName, function(err, effect) {
 
        if (err) {
            return res.status(400).json(err);
        } else { 
            if(!(effect == undefined || effect.length < 1 || cs(effectName, currentEffectName, true, false))) { res.status(200).json(effect); }
            else { res.status(404).json(effect); }
        }

  });

});

router.post('/', function(req, res, next){

    var name = req.body.name;

    Effect.find(function(err, effects) {

        if(err){
            res.status(400).json(err);
        }

        req.checkBody('name', 'Effect name is required.').notEmpty();
        req.checkBody('name', 'Duplicate effect name.').duplicateRecord('name', effects);
        var errors = req.validationErrors();

        if(errors) {
            res.status(400).json({errors: errors});
        } else {

            var effect = new Effect({
                name: name
            });

            Effect.createEffect(effect, function(err, result) {
                if(err) { throw(err) }
                else { res.status(200).json({success: {msg: 'Effect ' + name + ' saved successfully'}}); }
            });

        }

    });

});

router.put('/:id', function(req, res, next) {

    var id = req.params.id;
    var name = req.body.name;

    Effect.find(function(err, effects) {

        Effect.find({_id: id}, function(err, originalEffect) {

            if(err){
                res.status(400).json(err);
            }

            req.checkBody('name', 'Effect name is required.').notEmpty();
            req.checkBody('name', 'Duplicate effect name.').duplicateRecordExcludingCurrentRecord('name', effects, originalEffect[0].name);
            var errors = req.validationErrors();

            if(errors) {
                res.status(400).json({errors: errors});
            } else {

                var effect = new Effect({
                    _id: id,
                    name: name
                });

                Effect.updateEffect(effect, function(err, result) {
                    if(err) { throw(err) }
                    else { res.status(200).json({success: {msg: 'Effect ' + name + ' updated successfully'}}); }
                });

            }

        })

    });

});

router.delete('/:id/:name', function(req, res, next) {

    var effectId = req.params.id;

    Effect.deleteEffect(effectId, function(err, result) { 

        if(err) {
            res.status(400).json({errors: errors});
        } else {
            res.status(200).json({success: {msg: 'Effect ' + req.params.name + ' deleted successfully'}});
        }

    });

});

module.exports = router;