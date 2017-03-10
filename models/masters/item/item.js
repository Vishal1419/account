var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var itemSchema = new Schema({
    name: {type: String, required: true},
    alias: {type: String},
    parent: {type: Schema.Types.ObjectId, ref: 'Group'},
    unit: {type: Schema.Types.ObjectId, ref: 'Unit'},
    tax: {
        rate: {type: Number}
    },
    openingBalance: {
        quantity: {type: Number},
        rate: {type: Number}
    }
});

var Item = module.exports = mongoose.model('Item', itemSchema);

module.exports.getAllItems = function(callback){
  Item.find().lean().exec(function(err, items){
    if (err) return callback(err, null);
    callback(null, items);
  });
};

module.exports.getItemById = function(id, callback){
  Item.find({_id: id}).lean().exec(function(err, item){
    if(err) return callback(err, null);
    callback(null, item);
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
                                  "rate": updatedValuesOfExistingItem.openingBalance.rate}}},
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