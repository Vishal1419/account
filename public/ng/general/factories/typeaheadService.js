angular
    .module('accountApp')
    .factory('typeaheadService', [function() {
        var typeaheadQueryObj;
        return {
            getQueryObject: function() {
                return typeaheadQueryObj;
            },
            setQueryObject: function(queryObj) {
                typeaheadQueryObj = queryObj;
            }
        };
    }])
