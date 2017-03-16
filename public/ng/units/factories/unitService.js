angular
    .module('unitApp')
    .factory('unitService', function($http) {
        var factory = { fetch: fetch, getById: getById, save: save, remove: remove };

        return factory; 

        //Usual CRUD operations
        //---------------------------------------------------------------

        function fetch() {
            return $http.get('/api/unit')
                        .then(function(response) {
                            return response.data;
                        });
        }

        function getById(id) {
            return $http.get('/api/unit/' + id)
                        .then(function(unit) {
                            return unit.data;
                        });
        }

        function save(unit, callback) {
            if(unit == undefined || unit._id == undefined || unit._id == '') {
                $http.post('/api/unit', unit)
                     .then(function (response) {
                         //Clear errors
                         callback(response);
                     }, function(response) {
                         //Raise errors
                         callback(response);
                     });
            } else {
                $http.put('/api/unit/' + unit._id, unit).then(function (response) {
                         //Clear errors
                         callback(response);
                     }, function(response) {
                         //Raise errors
                         callback(response);
                     });
            }
        }

        function remove(unit, callback) {
            $http.delete('/api/unit/' + unit._id + '/' + encodeURL(unit.name), unit)
                 .then(function (response) {
                     //Clear errors
                     callback(response);
                 }, function(response) {
                     //Raise errors
                     callback(response);
                 });
        }

    });