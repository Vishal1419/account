angular
    .module('accountApp')
    .directive('uniqueRecord', function($q, $timeout, $http) {
        return {
            require: 'ngModel',
            link: function(scope, elm, attrs, ctrl) {

                ctrl.$asyncValidators.uniqueRecord = function(modelValue, viewValue) {

                    var attributes = scope.$eval(attrs.uniqueRecord);

                    var value = modelValue || viewValue;

                    if(value == undefined || value == '') {
                        return new Promise(function(fullfill, reject) {
                            return true;
                        });
                    } else if (typeof value === 'string' || value instanceof String) {
                        value = encodeURL(value);
                    } else if (!(attributes.propertyName == undefined)) {
                        value = encodeURL(value[attributes.propertyName]);
                    } else {
                        value = encodeURL(value.name);
                    }

                    if(attributes.selectedOnly == undefined) {
                        attributes.selectedOnly = false;
                    } else {
                        if(attributes.selectedOnly) {
                            attributes.url = attributes.url.substring(0, attributes.url.lastIndexOf('/'));
                        } else {
                            attributes.optionalPart = '';
                        }
                    }

                    if(attributes.optionalPart == undefined) {
                        attributes.optionalPart = '';
                    }

                    if(attributes.currentRecordName == undefined || attributes.currentRecordName == '') {
                        attributes.currentRecordName = '_';
                    } else {
                        attributes.currentRecordName = encodeURL(attributes.currentRecordName);
                    }

                    if(attributes.reverse == undefined) {
                        attributes.reverse = false;
                    }

                    return $http.get(attributes.url + attributes.optionalPart + '/' + value + '/' + attributes.currentRecordName)
                                .then(function resolved() {
                                    console.log('resolved');
                                    if(attributes.reverse) {
                                        return true;
                                    } else {
                                        return $q.reject('exists');
                                    }
                                }, function rejected() {
                                    console.log('rejected');
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