var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var encodeURL = require("../../../helpers/encodeURL");
var { wrap } = require("co");

var groupSchema = new Schema({
    name: {type: String, required: true},
    alias: {type: String},
    parent: {type: Schema.Types.ObjectId, ref: 'Group'},
    effect: {type: Schema.Types.ObjectId, ref: 'Effect'},
    nature: {type: Schema.Types.ObjectId, ref: 'Nature'},
    isSystemGroup: {type: Boolean},
    details: {
        mailing: {type: Boolean},
        contact: {type: Boolean},
        bank: {type: Boolean},
        tax: {type: Boolean}
    }
});

var Group = module.exports = mongoose.model('Group', groupSchema);

module.exports.getAllGroups = function(callback){
  Group.find().sort('name').populate('parent').populate('effect').populate('nature').exec(function(err, groups){
    if (err) return callback(err, null);
    callback(null, groups);
  });
};

module.exports.getDescendentsOfSelectedGroupWithItself = wrap(function*(topGroupId, generations) {
  
  const topGroup = yield Group.find({_id: topGroupId}).populate('parent').populate('effect').populate('nature');
  
  let groups = [];
  let ids = [topGroupId];

  for(let i = 0; i < generations; i++) {
    const thisLevelGroups = yield Group.find({ parent : { $in : ids } }).populate('parent').populate('effect').populate('nature');
    ids = thisLevelGroups.map(group => group._id);
    groups = groups.concat(thisLevelGroups);
  }

  groups.push(topGroup[0]);

  return groups;

});

module.exports.getGroupsOtherThanSelectedGroupAndItsDescendents = wrap(function*(topGroupId, generations) {
  
  const topGroup = yield Group.find({_id: topGroupId}).populate('parent').populate('effect').populate('nature');
  
  console.log(topGroup);

  let groups = [];
  let ids = [topGroupId];

  for(let i = 0; i < generations; i++) {
    const thisLevelGroups = yield Group.find({ parent : { $in : ids } }).populate('parent').populate('effect').populate('nature');
    ids = thisLevelGroups.map(group => group._id);
    groups = groups.concat(thisLevelGroups);
  }

  groups.push(topGroup[0]);

  var allGroups = yield Group.find().populate('parent').populate('effect').populate('nature');

  return allGroups.filter(thisGroup => !groups.some(group => thisGroup.name === group.name));

});

module.exports.getGroupById = function(id, callback){
  Group.find({_id: id}).sort('name').populate('parent').populate('effect').populate('nature').exec(function(err, group){
    if(err) return callback(err, null);
    callback(null, group);
  });
};

module.exports.getGroupByName = function(name, callback){
  name = encodeURL(name);
  Group.find({name: new RegExp('^'+name+'$', "i")}).sort('name').populate('parent').populate('effect').populate('nature').exec(function(err, group){
    if(err) return callback(err, null);
    callback(null, group);
  });
};

module.exports.createGroup = function(newGroup, callback){
  newGroup.save(callback);
};

module.exports.updateGroup = function(updatedValuesOfExistingGroup, callback){
  Group.update(
    {"_id": updatedValuesOfExistingGroup.id},
    {"$set": {"name": updatedValuesOfExistingGroup.name, "alias": updatedValuesOfExistingGroup.alias, 
              "parent": updatedValuesOfExistingGroup.parent, "effect": updatedValuesOfExistingGroup.effect,
              "nature": updatedValuesOfExistingGroup.nature, "isSystemGroup": updatedValuesOfExistingGroup.isSystemGroup,
              "details":{ "mailing": updatedValuesOfExistingGroup.details.mailing,
                          "contact": updatedValuesOfExistingGroup.details.contact,
                          "bank": updatedValuesOfExistingGroup.details.bank,
                          "tax": updatedValuesOfExistingGroup.details.tax}}},
    {multi: false},
    callback
  );
};

module.exports.deleteGroup = function(id, callback){
    Group.remove({_id: id}, function(err, group) {
        if(err) return callback(err, null);
        callback(null, group);
    });
};