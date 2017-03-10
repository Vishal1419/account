var Nature = require('../models/masters/group/nature');

var mongoose = require('mongoose');
mongoose.connect('localhost:27017/accountdb');

var natures = [
    new Nature({
        name: 'Assets'
    }),
    new Nature({
        name: 'Expenses'
    }),
    new Nature({
        name: 'Incomes'
    }),
    new Nature({
        name: 'Liabilities'
    })
];

var done = 0;

for(var i = 0; i < natures.length; i++)
{
    natures[i].save(function(err, result){
        done++;
        if(done == natures.length){
            exit();
        }
    });
}

function exit() {
    mongoose.disconnect();
}