var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var encodeURL = require("../../../helpers/encodeURL");

var itemSchema = new Schema({
    name: {type: String, required: true},
    alias: {type: String},
    parent: {type: Schema.Types.ObjectId, ref: 'Group'},
    unit: {type: Schema.Types.ObjectId, ref: 'Unit'},
    isSystemItem: {type: Boolean},
    tax: {
        rate: {type: Number}
    },
    openingBalance: {
        quantity: {type: Number},
        rate: {type: Number},
        amount: {type: Number}
    }
});

var Item = module.exports = mongoose.model('Item', itemSchema);

module.exports.getAllItems = function(callback){
  Item.find().sort('name').populate('parent').populate('unit').exec(function(err, items){
    if (err) return callback(err, null);
    callback(null, items);
  });
};

module.exports.getItemById = function(id, callback){
  Item.find({_id: id}).sort('name').populate('parent').populate('unit').exec(function(err, item){
    if(err) return callback(err, null);
    callback(null, item);
  });
};

module.exports.getItemByName = function(name, callback){
    name = encodeURL(name);
    Item.find({name: new RegExp('^'+name+'$', "i")}).sort('name').populate('parent').populate('unit').exec(function(err, ledger){
        if(err) return callback(err, null);
        callback(null, ledger);
    });
};

module.exports.getItemBySymbol = function(symbol, callback){
    symbol = encodeURL(symbol);
    Item.find({symbol: new RegExp('^'+symbol+'$', "i")}).sort('symbol').populate('parent').populate('unit').exec(function(err, ledger){
        if(err) return callback(err, null);
        callback(null, ledger);
    });
};

module.exports.createItem = function(newItem, callback){
  newItem.save(callback);
};

module.exports.updateItem = function(updatedValuesOfExistingItem, callback){
  Item.update(
    {"_id": updatedValuesOfExistingItem.id},
    {"$set": {"name": updatedValuesOfExistingItem.name, "alias": updatedValuesOfExistingItem.alias, 
              "parent": updatedValuesOfExistingItem.parent, "unit": updatedValuesOfExistingItem.unit,
              "tax": { "rate": updatedValuesOfExistingItem.tax.rate},
              "openingBalance": { "quantity": updatedValuesOfExistingItem.openingBalance.quantity, 
                                  "rate": updatedValuesOfExistingItem.openingBalance.rate,
                                  "amount": updatedValuesOfExistingItem.openingBalance.amount}}},
    {multi: false},
    callback
  );
};

module.exports.deleteItem = function(id, callback){
    Item.remove({_id: id}, function(err, item) {
        if(err) return callback(err, null);
        callback(null, item);
    });
};