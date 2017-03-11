var express = require('express')
var router = express.Router();

var Country = require('../../models/landDivision/Country');
var cs = require('../../helpers/compareStrings')

router.get('/', function(req, res, next) {

    //retrieve all countries from Country model
    Country.getAllCountries(function(err, countries) {
        if(err) { return res.status(400).json(err); }
        else { res.status(200).json(countries); }
    });

});

router.get('/:id', function(req, res, next){

  var countryId = req.params.id;

  Country.getCountryById(countryId, function(err, country) {
 
        if (err) {
            return res.status(400).json(err);
        } else { res.status(200).json(country); }

  });

});

router.get('/:name/:currentCountryName', function(req, res, next){

  var countryName = req.params.name;
  var currentCountryName = req.params.currentCountryName;

  Country.getCountryByName(countryName, function(err, country) {
 
        if (err) {
            return res.status(400).json(err);
        } else { 
            if(!(country == undefined || country.length < 1 || cs(countryName, currentCountryName, true, false))) { res.status(200).json(country); }
            else { res.status(404).json(country); }
        }

  });

});

router.get('/code/:code/:currentCountryCode', function(req, res, next){

  var countryCode = req.params.code;
  var currentCountryCode = req.params.currentCountryCode;

  Country.getCountryByCode(countryCode, function(err, country) {
 
        if (err) {
            return res.status(400).json(err);
        } else { 
            if(!(country == undefined || country.length < 1 || cs(countryCode, currentCountryCode, true, false))) { res.status(200).json(country); }
            else { res.status(404).json(country); }
        }

  });

});

router.post('/', function(req, res, next){

    var name = req.body.name;
    var code = req.body.code;

    Country.find(function(err, countries) {

        if(err){
            res.status(400).json(err);
        }

        req.checkBody('name', 'Country name is required.').notEmpty();
        req.checkBody('name', 'Duplicate country name.').duplicateRecord('name', countries);
        req.checkBody('code', 'Country code is required.').notEmpty();
        req.checkBody('code', 'Duplicate country code.').duplicateRecord('code', countries);
        var errors = req.validationErrors();

        if(errors) {
            res.status(400).json({errors: errors});
        } else {

            var country = new Country({
                name: name,
                code: code
            });

            Country.createCountry(country, function(err, result) {
                if(err) { throw(err) }
                else { res.status(200).json({success: {msg: 'Country ' + name + ' saved successfully'}}); }
            });

        }

    });

});

router.put('/:id', function(req, res, next) {

    var id = req.params.id;
    var name = req.body.name;
    var code = req.body.code;

    Country.find(function(err, countries) {

        Country.find({_id: id}, function(err, originalCountry) {

            if(err){
                res.status(400).json(err);
            }

            req.checkBody('name', 'Country name is required.').notEmpty();
            req.checkBody('name', 'Duplicate country name.').duplicateRecordExcludingCurrentRecord('name', countries, originalCountry[0].name);
            req.checkBody('code', 'Country code is required.').notEmpty();
            req.checkBody('code', 'Duplicate country code.').duplicateRecordExcludingCurrentRecord('code', countries, originalCountry[0].code);
            var errors = req.validationErrors();

            if(errors) {
                res.status(400).json({errors: errors});
            } else {

                var country = new Country({
                    _id: id,
                    name: name,
                    code: code
                });

                Country.updateCountry(country, function(err, result) {
                    if(err) { throw(err) }
                    else { res.status(200).json({success: {msg: 'Country ' + name + ' updated successfully'}}); }
                });

            }

        })

    });

});

router.delete('/:id/:name', function(req, res, next) {

    var countryId = req.params.id;

    Country.deleteCountry(countryId, function(err, result) { 

        if(err) {
            res.status(400).json({errors: errors});
        } else {
            res.status(200).json({success: {msg: 'Country ' + req.params.name + ' deleted successfully'}});
        }

    });

});

module.exports = router;