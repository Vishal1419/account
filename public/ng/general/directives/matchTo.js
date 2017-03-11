angular
    .module('accountApp')
    .directive('matchTo', function() {
        return {
            restrict: 'A',
            require: 'ngModel',
            scope: {
                otherModelValue: '=matchTo'
            },
            link: function(scope, elm, attrs, ctrl) {

                ctrl.$validators.matchTo = function(modelValue) {
                    if(scope.otherModelValue == undefined || scope.otherModelValue == null) {
                        return true;
                    } else {
                        return modelValue != scope.otherModelValue;
                    }
                }

                scope.$watch('otherModelValue', function() {
                    ctrl.$validate();
                });
            }
        }
    });

    //----- Plugin for checking if input a is equal to input b or not