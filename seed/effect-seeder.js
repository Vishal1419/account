var Effect = require('../models/masters/group/effect');

var mongoose = require('mongoose');
mongoose.connect('localhost:27017/accountdb');

var effects = [
    new Effect({
        name: 'Balance Sheet',
        isSystemEffect: true
    }),
    new Effect({
        name: 'Profit & Loss A/c',
        isSystemEffect: true
    }),
    new Effect({
        name: 'Trading Account',
        isSystemEffect: true
    })
];

var done = 0;

for(var i = 0; i < effects.length; i++)
{
    effects[i].save(function(err, result){
        done++;
        if(done == effects.length){
            exit();
        }
    });
}

function exit() {
    mongoose.disconnect();
}