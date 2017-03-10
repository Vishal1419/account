angular.module('accountApp', ['ngRoute', 'effectApp', 'natureApp', 'groupApp', 'countryApp', 'stateApp']);

angular.module('effectApp', ['ngRoute', 'jcs-autoValidate', 'ngFlash'])
       .run(function(defaultErrorMessageResolver) {
           defaultErrorMessageResolver.getErrorMessages().then(function(errorMessages) {
                errorMessages['uniqueEffect'] = "Effect Name already exists.";
                errorMessages['requiredEffect'] = "Effect name is required";
           });
       });

angular.module('natureApp', ['ngRoute', 'jcs-autoValidate', 'ngFlash'])
       .run(function(defaultErrorMessageResolver) {
           defaultErrorMessageResolver.getErrorMessages().then(function(errorMessages) {
                errorMessages['uniqueNature'] = "Nature Name already exists.";
                errorMessages['requiredNature'] = "Nature name is required";
           });
       });

angular.module('groupApp', ['ngRoute', 'jcs-autoValidate', 'ngFlash', 'ui.bootstrap'])
       .run(function(defaultErrorMessageResolver) {
           defaultErrorMessageResolver.getErrorMessages().then(function(errorMessages) {
                errorMessages['uniqueGroup'] = "Group name already exists.";
                errorMessages['requiredGroup'] = "Group name is required";
                errorMessages['requiredParentGroup'] = "Parent group is required";
                errorMessages['noGroupFound'] = "Choose group from the list";
           });
       });

angular.module('countryApp', ['ngRoute', 'jcs-autoValidate', 'ngFlash'])
       .run(function(defaultErrorMessageResolver) {
           defaultErrorMessageResolver.getErrorMessages().then(function(errorMessages) {
                errorMessages['uniqueCountry'] = "Country name already exists.";
                errorMessages['requiredCountry'] = "Country name is required";
                errorMessages['uniqueCountryCode'] = "Country code already exists.";
                errorMessages['requiredCountryCode'] = "Country code is required";
           });
       });

angular.module('stateApp', ['ngRoute', 'jcs-autoValidate', 'ngFlash', 'ui.bootstrap'])
       .run(function(defaultErrorMessageResolver) {
           defaultErrorMessageResolver.getErrorMessages().then(function(errorMessages) {
                errorMessages['uniqueState'] = "State name already exists.";
                errorMessages['requiredState'] = "State name is required";
                errorMessages['noCountryFound'] = "Choose country from list";
                errorMessages['requiredCountry'] = "Country name is required";
           });
       });
