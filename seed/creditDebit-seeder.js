var CreditDebit = require('../models/general/creditDebit');

var mongoose = require('mongoose');
mongoose.connect('localhost:27017/accountdb');

var creditDebits = [
    new CreditDebit({
        name: 'Credit',
        code: 'Cr',
        isSystemCreditDebit: true
    }),
    new CreditDebit({
        name: 'Debit',
        code: 'Dr',
        isSystemCreditDebit: true
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