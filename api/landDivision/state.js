var express = require('express')
var router = express.Router();

var Country = require('../../models/landDivision/country');
var State = require('../../models/landDivision/state');

var cs = require('../../helpers/compareStrings');

router.get('/', function(req, res, next) {

    //retrieve all states from State model
    State.getAllStates(function(err, states) {
        if(err) { res.status(400).json(err); }
        else { res.status(200).json(states); }
    });

});

router.get('/:id', function(req, res, next){

  var stateId = req.params.id;

  State.getStateById(stateId, function(err, state) {
 
        if (err) { return res.status(400).json(err); } 
        else { res.status(200).json(state); }

  });

});

router.get('/:name/:currentStateName', function(req, res, next){

  var stateName = req.params.name;
  var currentStateName = req.params.currentStateName;

  State.getStateByName(stateName, function(err, state) {
 
        if (err) {
            return res.status(400).json(err);
        } else { 
            if(!(state == undefined || state.length < 1 || cs(stateName, currentStateName, true, false))) { res.status(200).json(state); }
            else { res.status(404).json(state); }
        }

  });

});

router.post('/', function(req, res){

    var name = req.body.name;
    var country = (req.body.country == null || req.body.country == undefined) ? '' : req.body.country.name;

    Country.getAllCountries(function(err, countries) {

        State.getAllStates(function(err, states) {
    
            if (err) {
                res.status(400).json(err);
            } 

            req.checkBody('name', 'State name is required.').notEmpty();
            req.checkBody('name', 'Duplicate state Name.').duplicateRecord('name', states);
            req.checkBody('country.name', 'Country name is required.').notEmpty();
            req.checkBody('country.name', 'Please select country from list.').noRecordFound('name', countries);

            //Check for errors
            var errors = req.validationErrors();

            if(errors){
                res.status(400).json({errors: errors});
            } else {

                Country.getCountryByName(country, function(err, parentCountry) {

                    var newState = new State({
                        name: name,
                        country: parentCountry[0],
                        isSystemState: false
                    });

                    State.createState(newState, function(err, result){

                        if(err) { throw(err); }
                        else { res.status(200).json({success: {msg: 'State ' + name + ' saved successfully'}}); }

                    });

                });

            }

        });

    });

});

router.put('/:id', function(req, res, next) {

    var id = req.params.id;
    var name = req.body.name;
    var country = (req.body.country == null || req.body.country == undefined) ? '' : req.body.country.name;
    var isSystemState = req.body.isSystemState;

    Country.getAllCountries(function(err, countries) {

        State.getAllStates(function(err, states) {

            State.getStateById(id, function(err, originalState) {

                if (err) {
                    res.status(400).json(err);
                } 

                req.checkBody('name', 'State name is required.').notEmpty();
                req.checkBody('name', 'Duplicate state Name.').duplicateRecordExcludingCurrentRecord('name', states, originalState[0].name);
                req.checkBody('country.name', 'Country name is required.').notEmpty();
                req.checkBody('country.name', 'Please select country from list.').noRecordFound('name', countries);

                //Check for errors
                var errors = req.validationErrors();

                if(errors) {
                    res.status(400).json({errors: errors});
                } else {

                    Country.getCountryByName(country, function(err, parentCountry) {

                        var newState = new State({
                            _id: id,
                            name: name,
                            country: parentCountry[0],
                            isSystemState: isSystemState
                        });

                        State.updateState(newState, function(err, result){

                            if(err) { throw(err); }
                            else { res.status(200).json({success: {msg: 'State ' + name + ' updated successfully'}}); }

                        });

                    });

                }

            })

        });

    });

});

router.delete('/:id/:name', function(req, res, next) {

    var stateId = req.params.id;
        
    State.deleteState(stateId, function(err, result) { 

        if(err) {
            res.status(400).json({errors: errors});
        } else {
            res.status(200).json({success: {msg: 'State ' + req.params.name + ' deleted successfully.'}});
        }

    });

});

module.exports = router;