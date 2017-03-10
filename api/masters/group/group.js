var express = require('express')
var router = express.Router();

var Effect = require('../../../models/masters/group/Effect');
var Nature = require('../../../models/masters/group/Nature');
var Group = require('../../../models/masters/group/Group');

var cs = require('../../../helpers/compareStrings');

router.get('/', function(req, res, next) {

    //retrieve all groups from Group model
    Group.getAllGroups(function(err, groups) {
        if(err) { console.error(err); }
        else { res.json(groups); }
    });

});

router.get('/:id', function(req, res, next){

  var groupId = req.params.id;

  Group.getGroupById(groupId, function(err, group) {
 
        if (err) { return console.error(err); } 
        else { res.json(group); }

  });

});

router.get('/:name/:currentGroupName', function(req, res, next){

  var groupName = req.params.name;
  var currentGroupName = req.params.currentGroupName;

  Group.getGroupByName(groupName, function(err, group) {
 
        if (err) {
            return console.error(err);
        } else { 
            if(!(group == undefined || group.length < 1 || cs(groupName, currentGroupName, true, false))) { res.status(200).json(group); }
            else { res.status(404).json(group); }
        }

  });

});

router.post('/', function(req, res){

    var name = req.body.name;
    var alias = req.body.alias;
    var parent = (req.body.parent == null || req.body.parent == undefined) ? '' : req.body.parent.name;

    Group.getAllGroups(function(err, groups) {
  
        if (err) {
            next(err);
        } 

        req.checkBody('name', 'Group name is required.').notEmpty();
        req.checkBody('name', 'Duplicate group Name.').duplicateRecord('name', groups);
        req.checkBody('parent.name', 'Parent name is required.').notEmpty();
        req.checkBody('parent.name', 'Please select parent group from list.').noRecordFound('name', groups);

        //Check for errors
        var errors = req.validationErrors();

        if(errors){
            res.status(400).json({errors: errors});
        } else {

            Group.getGroupByName(parent, function(err, parentGroup) {

                var newGroup = new Group({
                    name: name,
                    alias: alias,
                    parent: parentGroup[0],
                    effect: parentGroup[0].effect,
                    nature: parentGroup[0].nature,
                    isSystemGroup: false,
                    details: {
                        mailing: parentGroup[0].details.mailing,
                        contact: parentGroup[0].details.contact,
                        bank: parentGroup[0].details.bank,
                        tax: parentGroup[0].details.tax
                    }
                });

                Group.createGroup(newGroup, function(err, result){

                    if(err) { throw(err); }
                    else { res.status(200).json({success: {msg: 'Group ' + name + ' saved successfully'}}); }

                });

            });

        }

    });

});

router.put('/:id', function(req, res, next) {

    var id = req.params.id;
    var name = req.body.name;
    var alias = req.body.alias;
    var parent = (req.body.parent == null || req.body.parent == undefined) ? '' : req.body.parent.name;

    console.log(parent);

    Group.getAllGroups(function(err, groups) {

        Group.getGroupById(id, function(err, originalGroup) {

            if (err) {
                next(err);
            } 

            req.checkBody('name', 'Group name is required.').notEmpty();
            req.checkBody('name', 'Duplicate group Name.').duplicateRecordExcludingCurrentRecord('name', groups, originalGroup[0].name);
            req.checkBody('parent.name', 'Parent name is required.').notEmpty();
            req.checkBody('parent.name', 'Please select parent group from list.').noRecordFound('name', groups);

            //Check for errors
            var errors = req.validationErrors();

            if(errors) {
                res.status(400).json({errors: errors});
            } else {

                Group.getGroupByName(parent, function(err, parentGroup) {

                    var newGroup = new Group({
                        _id: id,
                        name: name,
                        alias: alias,
                        parent: parentGroup[0],
                        effect: parentGroup[0].effect,
                        nature: parentGroup[0].nature,
                        isSystemGroup: false,
                        details: {
                            mailing: parentGroup[0].details.mailing,
                            contact: parentGroup[0].details.contact,
                            bank: parentGroup[0].details.bank,
                            tax: parentGroup[0].details.tax
                        }
                    });

                    Group.updateGroup(newGroup, function(err, result){

                        if(err) { throw(err); }
                        else { res.status(200).json({success: {msg: 'Group ' + name + ' updated successfully'}}); }

                    });

                });

            }

        })

    });

});

router.delete('/:id/:name', function(req, res, next) {

    var groupId = req.params.id;
        
    Group.deleteGroup(groupId, function(err, result) { 

        if(err) {
            res.status(400).json({errors: errors});
        } else {
            res.status(200).json({success: {msg: 'Group ' + req.params.name + ' deleted successfully.'}});
        }

    });

});

module.exports = router;