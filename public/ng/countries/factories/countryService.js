angular
    .module('countryApp')
    .factory('countryService', function($http) {
        var factory = { fetch: fetch, save: save, remove: remove };

        return factory; 

        //Usual CRUD operations
        //---------------------------------------------------------------

        function fetch() {
            return $http.get('/api/country')
                        .then(function(response) {
                            return response.data;
                        });
        }

        function save(country, callback) {
            if(country == undefined || country._id == undefined || country._id == '') {
                $http.post('/api/country', country)
                     .then(function (response) {
                         //Clear errors
                         callback(response);
                     }, function(response) {
                         //Raise errors
                         callback(response);
                     });
            } else {
                $http.put('/api/country/' + country._id, country).then(function (response) {
                         //Clear errors
                         callback(response);
                     }, function(response) {
                         //Raise errors
                         callback(response);
                     });
            }
        }

        function remove(country, callback) {
            $http.delete('/api/country/' + country._id + '/' + encodeURL(country.name), country)
                 .then(function (response) {
                     //Clear errors
                     callback(response);
                 }, function(response) {
                     //Raise errors
                     callback(response);
                 });
        }

    });