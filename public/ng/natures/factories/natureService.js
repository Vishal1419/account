angular
    .module('natureApp')
    .factory('natureService', function($http) {
        var factory = { fetch: fetch, save: save, remove: remove };

        return factory; 

        //Usual CRUD operations
        //---------------------------------------------------------------

        function fetch() {
            return $http.get('/api/nature')
                        .then(function(response) {
                            return response.data;
                        });
        }

        function save(nature, callback) {
            if(nature == undefined || nature._id == undefined || nature._id == '') {
                $http.post('/api/nature', nature)
                     .then(function (response) {
                         //Clear errors
                         callback(response);
                     }, function(response) {
                         //Raise errors
                         callback(response);
                     });
            } else {
                $http.put('/api/nature/' + nature._id, nature).then(function (response) {
                         //Clear errors
                         callback(response);
                     }, function(response) {
                         //Raise errors
                         callback(response);
                     });
            }
        }

        function remove(nature, callback) {
            $http.delete('/api/nature/' + nature._id + '/' + encodeURL(nature.name), nature)
                 .then(function (response) {
                     //Clear errors
                     callback(response);
                 }, function(response) {
                     //Raise errors
                     callback(response);
                 });
        }

    });