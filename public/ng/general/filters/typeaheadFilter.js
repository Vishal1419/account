angular
    .module('accountApp')
    .filter('typeaheadFilter', ['typeaheadService', function(typeaheadService) {
        return function(input, queryObj) {
            var key = Object.keys(queryObj)[0],
                query = queryObj[key];
            typeaheadService.setQueryObject(queryObj); // called once, when the viewValue changes
            if (!query) {
                return input;
            }
            var result = [];
            angular.forEach(input, function(object) {
                if (object[key].toLowerCase().indexOf(query.toLowerCase()) !== -1) {
                    result.push(object);
                }
            });
            return result;
        };
    }])
