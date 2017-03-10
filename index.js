var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var expressValidator = require('express-validator');
var session = require('express-session');
var flash = require('connect-flash');
var ejs = require('ejs');

var cs = require('./helpers/compareStrings');

require('./models/db');

var effect = require('./api/masters/group/effect');
var nature = require('./api/masters/group/nature');
var group = require('./api/masters/group/group');
var country = require('./api/landDivision/country');
var state = require('./api/landDivision/state');

var app = express();

app.use(morgan('dev'));
app.use(bodyParser.json());

//Handle express sessions
app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}));


//validator
app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.'),
            root = namespace.shift(),
            formParam = root;

        while(namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }

        return {
            param: formParam,
            msg: msg,
            value: value
        };
    },
    customValidators: {
        duplicateRecord: function(input, propertyName, collection) {
            //Use this method when creating new record
            var duplicateRecordNotFound = true;
            collection.forEach(function(element) {
                if (cs(element[propertyName], input, true, false)) {
                    duplicateRecordNotFound = false;
                    return;
                }
            }, this);
            return duplicateRecordNotFound;
        }, 
        duplicateRecordExcludingCurrentRecord: function(input, propertyName, collection, currentRecordPropertyValue) {
            //Use this method when editing a record
            var duplicateRecordNotFound = true;
            collection.forEach(function(element) {
                if (input != currentRecordPropertyValue && cs(element[propertyName], input, true, false)) {
                    duplicateRecordNotFound = false;
                    return;
                }
            }, this);
            return duplicateRecordNotFound;
        },
        noRecordFound: function(input, propertyName, collection) {
            //Use this method when creating new record
            var recordFound = false;
            collection.forEach(function(element) {
                if (cs(element[propertyName], input, true, false)) {
                    recordFound = true;
                    return;
                }
            }, this);
            return recordFound;
        }
    }
}));

app.use(cookieParser());

app.use(express.static(__dirname + '/public'));
app.use('/templates', express.static(__dirname + '/views/templates'));

app.use('/auto-validate', express.static(__dirname + '/node_modules/angular-auto-validate/dist'));

//Set View-engine
app.set('views', __dirname + '/views');
app.set('view-engine', ejs)

//For flashing server side error/success messages
app.use(flash());
//For displaying flashed messages from connect-flash on the same or redirected page
app.use(function(req, res, next) {
    res.locals.messages = require('express-messages')(req, res);
    next();
})

//Map urls
app.use('/api/effect', effect);
app.use('/api/nature', nature);
app.use('/api/group', group);
app.use('/api/country', country);
app.use('/api/state', state);

app.get('*', function(req, res) {
    res.render('index.html.ejs');
});

//Create a server
var server = app.listen(process.env.PORT || 3000, function() {
    console.log('server is listening on Port: %d', server.address().port);
});