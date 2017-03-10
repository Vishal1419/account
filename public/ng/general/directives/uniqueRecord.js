angular
    .module('accountApp')
    .directive('uniqueRecord', function($q, $timeout, $http) {
        return {
            require: 'ngModel',
            link: function(scope, elm, attrs, ctrl) {

                ctrl.$asyncValidators.uniqueRecord = function(modelValue, viewValue) {

                    var value = modelValue || viewValue;

                    if (typeof value === 'string' || value instanceof String) {
                        value = value.replace(/\//g,'%2F').replace(/\(/g,'%28').replace(/\)/g,'%29');
                    } else {
                        value = value.name.replace(/\//g,'%2F').replace(/\(/g,'%28').replace(/\)/g,'%29');
                    }

                    var attributes = scope.$eval(attrs.uniqueRecord);

                    if(attributes.optionalPart == undefined) {
                        attributes.optionalPart = '';
                    }

                    if(attributes.currentRecordName == undefined || attributes.currentRecordName == '') {
                        attributes.currentRecordName = '_';
                    } else {
                        attributes.currentRecordName = attributes.currentRecordName.replace(/\//g,'%2F').replace(/\(/g,'%28').replace(/\)/g,'%29');
                    }

                    if(attributes.reverse == undefined) {
                        attributes.reverse = false;
                    }

                    return $http.get(attributes.url + attributes.optionalPart + '/' + value + '/' + attributes.currentRecordName)
                                .then(function resolved() {
                                    if(attributes.reverse) {
                                        return true;
                                    } else {
                                        return $q.reject('exists');
                                    }
                                }, function rejected() {
                                    if(attributes.reverse) {
                                        return $q.reject('exists');
                                    } else {
                                        return true;
                                    }
                                });
                };
            }
        }
    });

    //----- Plugin for checking if a record is unique or not