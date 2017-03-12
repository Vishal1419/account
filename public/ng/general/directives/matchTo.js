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

                    if(attributes.unequal) {
                        if(modelValue == undefined || attributes.matchString == undefined || attributes.matchString == null) {
                            return true;
                        } else if(!(typeof modelValue === String || typeof modelValue === 'string')) {
                            return modelValue.name.toLowerCase() != attributes.matchString.toLowerCase();
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
                });
            }
        }
    });

    //----- Plugin for checking if input a is equal to input b or not