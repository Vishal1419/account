var CreditDebit = require('../models/general/creditDebit');

var mongoose = require('mongoose');
mongoose.connect('localhost:27017/accountdb');

var creditDebits = [
    new CreditDebit({
        name: 'Credit'
    }),
    new CreditDebit({
        name: 'Debit'
    })
];

var done = 0;

for(var i = 0; i < creditDebits.length; i++)
{
    creditDebits[i].save(function(err, result){
        if(err) {
            console.log(err);
        } else {
            done++;
            if(done == creditDebits.length){
                exit();
            }
        }
    });
}

function exit() {
    mongoose.disconnect();
}