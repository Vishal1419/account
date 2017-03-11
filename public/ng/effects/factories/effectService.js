angular
    .module('effectApp')
    .factory('effectService', function($http) {
        var factory = { fetch: fetch, save: save, remove: remove };

        return factory; 

        //Usual CRUD operations
        //---------------------------------------------------------------

        function fetch() {
            return $http.get('/api/effect')
                        .then(function(response) {
                            return response.data;
                        });
        }

        function save(effect, callback) {
            if(effect == undefined || effect._id == undefined || effect._id == '') {
                $http.post('/api/effect', effect)
                     .then(function (response) {
                         //Clear errors
                         callback(response);
                     }, function(response) {
                         //Raise errors
                         callback(response);
                     });
            } else {
                $http.put('/api/effect/' + effect._id, effect).then(function (response) {
                         //Clear errors
                         callback(response);
                     }, function(response) {
                         //Raise errors
                         callback(response);
                     });
            }
        }

        function remove(effect, callback) {
            $http.delete('/api/effect/' + effect._id + '/' + encodeURL(effect.name), effect)
                 .then(function (response) {
                     //Clear errors
                     callback(response);
                 }, function(response) {
                     //Raise errors
                     callback(response);
                 });
        }

    });

