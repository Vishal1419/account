angular
    .module('stateApp')
    .factory('stateService', function($http) {
        var factory = { fetch: fetch, fetchCountries: fetchCountries, getById: getById, save: save, remove: remove };

        return factory; 

        //Usual CRUD operations
        //---------------------------------------------------------------

        function fetch() {
            return $http.get('/api/state')
                        .then(function(states) {
                            return states.data;
                        });
        }

        function fetchCountries() {
            return $http.get('/api/country')
                        .then(function(countries) {
                            return countries.data;
                        });
        }

        function getById(id) {
            return $http.get('/api/state/' + id)
                        .then(function(state) {
                            return state.data;
                        });
        }

        function save(state, callback) {
            if(state == undefined || state._id == undefined || state._id == '') {
                $http.post('/api/state', state)
                     .then(function (response) {
                         //Clear errors
                         callback(response);
                     }, function(response) {
                         //Raise errors
                         callback(response);
                     });
            } else {
                $http.put('/api/state/' + state._id, state).then(function (response) {
                         //Clear errors
                         callback(response);
                     }, function(response) {
                         //Raise errors
                         callback(response);
                     });
            }
        }

        function remove(state, callback) {
            $http.delete('/api/state/' + state._id + '/' + encodeURL(state.name), state)
                 .then(function (response) {
                     //Clear errors
                     callback(response);
                 }, function(response) {
                     //Raise errors
                     callback(response);
                 });
        }

    });