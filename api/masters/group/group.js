var express = require('express')
var router = express.Router();

var Effect = require('../../../models/masters/group/effect');
var Nature = require('../../../models/masters/group/nature');
var Group = require('../../../models/masters/group/group');

var cs = require('../../../helpers/compareStrings');

router.get('/', function(req, res, next) {
    Group.getAllGroups(function(err, groups) {
        if(err) { return res.status(400).json(err); }
        else { res.status(200).json(groups); }
    });
});

router.get('/otherThanSelectedGroupAndItsDescendents/:name', function(req, res, next) {

    var groupName = req.params.name;

    Group.getGroupByName(groupName, function(err, group) {
        if(err) { res.status(400).json(err) }
        else {
            var groupId = group[0]._id;
            Group.getGroupsOtherThanSelectedGroupAndItsDescendents(groupId, 100).then( function(groups) {
                    return res.status(200).json(groups);
                }
            );
        }
    });

});

router.get('/descendents/:name', function(req, res, next) {

    var groupName = req.params.name;

    Group.getGroupByName(groupName, function(err, group) {
        if(err) { res.status(400).json(err); }
        else {
            var groupId = group[0]._id;
            Group.getDescendentsOfSelectedGroupWithItself(groupId, 100).then( function(groups) {
                    res.status(200).json(groups);
                }
            );
        }
    });

});

router.get('/:id', function(req, res, next){

  var groupId = req.params.id;

  Group.getGroupById(groupId, function(err, group) {
 
        if (err) { return res.status(400).json(err); } 
        else { res.status(200).json(group); }

  });

});

router.get('/:name/:currentGroupName', function(req, res, next){

  var groupName = req.params.name;
  var currentGroupName = req.params.currentGroupName;

  Group.getGroupByName(groupName, function(err, group) {
 
        if (err) {
            return res.status(400).json(err);
        } else { 
            if(!(group == undefined || group.length < 1 || cs(groupName, currentGroupName, true, false))) { res.status(200).json(group); }
            else { res.status(404).json(group); }
        }

  });

});

router.get('/otherThanSelectedGroupAndItsDescendents/:name/:currentGroupName', function(req, res, next) {

    var groupName = req.params.name;
    var currentGroupName = req.params.currentGroupName;

    Group.getGroupByName(currentGroupName, function(err, group) {
        if(err) { res.status(400).json(err) }
        var groupId = group[0]._id;
        Group.getGroupsOtherThanSelectedGroupAndItsDescendents(groupId, 100).then( function(groups) {
                groups.forEach(function(thisGroup) {
                    if(cs(thisGroup.name, groupName, true, false)) {
                        return res.status(200).json(thisGroup);
                    }
                }, this);
                return res.status(404).json({});
            }
        );
    });
});

router.get('/descendents/:name/:currentGroupName', function(req, res, next){

    var groupName = req.params.name;
    var currentGroupName = req.params.currentGroupName;

    Group.getGroupByName(currentGroupName, function(err, group) {
        var groupId = group[0]._id;
        Group.getDescendentsOfSelectedGroupWithItself(groupId, 100).then( function(groups) {
                groups.forEach(function(thisGroup) {
                    if(cs(thisGroup.name, groupName, true, false)) {
                        return res.status(200).json(thisGroup);
                    }
                }, this);
                return res.status(404).json({});
            }
        );
    });

});

router.post('/', function(req, res){

    var name = req.body.name;
    var alias = req.body.alias;
    var parent = req.body.parent;

    Group.getAllGroups(function(err, groups) {
  
      Group.getGroupByName("Stock-in-Hand", function(err, stockInHandGroup) {

            groupId = stockInHandGroup[0]._id;

            Group.getGroupsOtherThanSelectedGroupAndItsDescendents(groupId, 100).then(function(selectedGroups) {

                if (err) {
                    res.status(400).json(err);
                } 

                req.checkBody('name', 'Group name is required.').notEmpty();
                req.checkBody('name', 'Duplicate group Name.').duplicateRecord('name', groups);

                if(parent.name == undefined) {
                    req.checkBody('parent', 'Parent name is required.').notEmpty();
                    req.checkBody('parent', 'Parent Name and group name should be different.').checkEquality(name, false);
                    req.checkBody('parent', 'Please select parent group from list.').noRecordFound('name', selectedGroups);            
                } else {
                    req.checkBody('parent.name', 'Parent name is required.').notEmpty();
                    req.checkBody('parent.name', 'Parent Name and group name should be different.').checkEquality(name, false);
                    req.checkBody('parent.name', 'Please select parent group from list.').noRecordFound('name', selectedGroups);
                    parent = parent.name;
                }

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

    });

});

router.put('/:id', function(req, res, next) {

    var id = req.params.id;
    var name = req.body.name;
    var alias = req.body.alias;
    var parent = req.body.parent;
    var isSystemGroup = req.body.isSystemGroup;

    //Here parent is actually parent.name

    Group.getAllGroups(function(err, groups) {

        Group.getGroupById(id, function(err, originalGroup) {

            Group.getGroupByName("Stock-in-Hand", function(err, groupStockInHand) {

                Group.getGroupsOtherThanSelectedGroupAndItsDescendents(groupStockInHand._id, 100).then(function(selectedGroups) {

                    if (err) {
                        res.status(400).json(err);
                    } 

                    req.checkBody('name', 'Group name is required.').notEmpty();
                    req.checkBody('name', 'Duplicate group Name.').duplicateRecordExcludingCurrentRecord('name', groups, originalGroup[0].name);

                    if(parent.name == undefined) {
                        req.checkBody('parent', 'Parent name is required.').notEmpty();
                        req.checkBody('parent', 'Parent Name and group name should be different.').checkEquality(name, false);
                        req.checkBody('parent', 'Please select parent group from list.').noRecordFound('name', selectedGroups);            
                    } else {
                        req.checkBody('parent.name', 'Parent name is required.').notEmpty();
                        req.checkBody('parent.name', 'Parent Name and group name should be different.').checkEquality(name, false);
                        req.checkBody('parent.name', 'Please select parent group from list.').noRecordFound('name', selectedGroups);
                        parent = parent.name;
                    }

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
                                isSystemGroup: isSystemGroup,
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

                });
        
            });
    
        });

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