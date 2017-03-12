angular
    .module('accountApp')
    .directive('matchTo', function($parse) {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function(scope, elm, attrs, ctrl) {

                // var attributes = scope.$eval(attrs.matchTo);

                ctrl.$validators.matchTo = function(modelValue) {

                    var attributes = scope.$eval(attrs.matchTo);

                    if(attributes.unequal == undefined) {
                        attributes.unequal = false;
                    }

                    console.log(modelValue);
                    console.log(attributes.matchString);
                    console.log(attributes.unequal);

                    if(attributes.unequal) {
                        if(modelValue == undefined || attributes.matchString == undefined || attributes.matchString == null) {
                            return true;
                        } else {
                            return modelValue.toLowerCase() != attributes.matchString.toLowerCase();
                        }
                    } else {
                        if(modelValue == undefined || attributes.matchString == undefined || attributes.matchString == null) {
                            return false;
                        } else {
                            return modelValue.toLowerCase() == attributes.matchString.toLowerCase();
                        }                        
                    }
                }
                
                var matchTo = $parse(attrs.matchTo);
                scope.$watch(function () {
                    return matchTo(scope).matchString;
                }, function (value) {
                    ctrl.$validate();
                    console.log(value);
                });
            }
        }
    });

    //----- Plugin for checking if input a is equal to input b or not