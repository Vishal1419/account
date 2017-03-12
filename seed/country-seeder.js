var Country = require('../models/landDivision/country');

var mongoose = require('mongoose');
mongoose.connect('localhost:27017/accountdb');

var countries = [
    new Country({name: "India", code: "IN", isSystemCountry: true})
];

var done = 0;

for(var i = 0; i < countries.length; i++)
{
    countries[i].save(function(err, result){
        done++;
        if(done == countries.length){
            exit();
        }
    });
}

function exit() {
    mongoose.disconnect();
}