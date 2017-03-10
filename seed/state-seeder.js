var Country = require('../models/landDivision/country');
var State = require('../models/landDivision/state');

var mongoose = require('mongoose');
mongoose.connect('localhost:27017/accountdb');

function seedStates(stateName, countryName, callback) {
    Country.find({ name: countryName })
        .exec(function(err, country) {
            if(err) { console.log(err); }
            else {
                var state = new State({
                    name: stateName,
                    country: country != null ? country[0] : undefined,
                    isSystemState: true
                });
                state.save(function(err2, result){
                    if(err2) {console.log(err2);}
                    else { callback(); }
                });
            }
        });
}

let states = [
    ['Andhra Pradesh', 'India'],
    ['Arunachal Pradesh', 'India'],
    ['Assam', 'India'],
    ['Bihar', 'India'],
    ['Chhattisgarh', 'India'],
    ['Chandigarh', 'India'],
    ['Dadra and Nagar Haveli', 'India'],
    ['Daman and Diu', 'India'],
    ['Delhi', 'India'],
    ['Goa', 'India'],
    ['Gujarat', 'India'],
    ['Haryana', 'India'],
    ['Himachal Pradesh', 'India'],
    ['Jammu and Kashmir', 'India'],
    ['Jharkhand', 'India'],
    ['Karnataka', 'India'],
    ['Kerala', 'India'],
    ['Madhya Pradesh', 'India'],
    ['Maharashtra', 'India'],
    ['Manipur', 'India'],
    ['Meghalaya', 'India'],
    ['Mizoram', 'India'],
    ['Nagaland', 'India'],
    ['Orissa', 'India'],
    ['Punjab', 'India'],
    ['Pondicherry', 'India'],
    ['Rajasthan', 'India'],
    ['Sikkim', 'India'],
    ['Tamil Nadu', 'India'],
    ['Tripura', 'India'],
    ['Uttar Pradesh', 'India'],
    ['Uttarakhand', 'India'],
    ['West Bengal', 'India']
];

let callback = function(e,r) { 
    console.log('States Saved');
    mongoose.disconnect(); 
};

for (let i = states.length-1; i>= 0; i--) {
  let state = states[i];
  state.push( callback );
  callback = function(e,r) { seedStates.apply(this, state); }
}

callback();