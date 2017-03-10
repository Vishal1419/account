var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var inventorySchema = new Schema({
    billNumber: {type: String, required: true},
    date: {type: Date, required: true},
    party: {type: Schema.Types.ObjectId, ref: 'Ledger'},
    salesPurchaseLedger: {type: Schema.Types.ObjectId, ref: 'Ledger'},
    items: [
        {
            item: {type: Schema.Types.ObjectId, ref: 'Item'},
            Quantity: {type: Number},
            rate: {type: Number}
        }
    ]
});

var Inventory = module.exports = mongoose.model('Inventory', inventorySchema);

module.exports.getAllInventories = function(callback){
  Inventory.find().lean().exec(function(err, inventories){
    if (err) return callback(err, null);
    callback(null, inventories);
  });
};

module.exports.getInventoryById = function(id, callback){
  Inventory.find({_id: id}).lean().exec(function(err, inventory){
    if(err) return callback(err, null);
    callback(null, inventory);
  });
};

module.exports.createInventory = function(newInventory, callback){
  newInventory.save(callback);
};

module.exports.updateInventory = function(updatedValuesOfExistingInventory, callback){
  Inventory.update(
    {"_id": updatedValuesOfExistingInventory.id},
    {"$set": {"billNumber": updatedValuesOfExistingInventory.billNumber, "date": updatedValuesOfExistingInventory.date,
              "party": updatedValuesOfExistingInventory.party, "salesPurchaseLedger": updatedValuesOfExistingInventory.salesPurchaseLedger,
              "items.$": {"item": updatedValuesOfExistingInventory.items.$.item,
                          "quantity": updatedValuesOfExistingInventory.items.$.quantity,
                          "rate": updatedValuesOfExistingInventory.items.$.rate}}},
    {multi: false},
    callback
  );
};

module.exports.deleteInventory = function(id, callback){
    Inventory.remove({_id: id}, function(err, inventory) {
        if(err) return callback(err, null);
        callback(null, inventory);
    });
};