angular
    .module('creditDebitApp')
    .factory('creditDebitService', function($http) {
        var factory = { fetch: fetch, getById: getById, save: save, remove: remove };

        return factory; 

        //Usual CRUD operations
        //---------------------------------------------------------------

        function fetch() {
            return $http.get('/api/creditDebit')
                        .then(function(response) {
                            return response.data;
                        });
        }

        function getById(id) {
            return $http.get('/api/creditDebit/' + id)
                        .then(function(creditDebit) {
                            return creditDebit.data;
                        });
        }

        function save(creditDebit, callback) {
            if(creditDebit == undefined || creditDebit._id == undefined || creditDebit._id == '') {
                $http.post('/api/creditDebit', creditDebit)
                     .then(function (response) {
                         //Clear errors
                         callback(response);
                     }, function(response) {
                         //Raise errors
                         callback(response);
                     });
            } else {
                $http.put('/api/creditDebit/' + creditDebit._id, creditDebit).then(function (response) {
                         //Clear errors
                         callback(response);
                     }, function(response) {
                         //Raise errors
                         callback(response);
                     });
            }
        }

        function remove(creditDebit, callback) {
            $http.delete('/api/creditDebit/' + creditDebit._id + '/' + encodeURL(creditDebit.name), creditDebit)
                 .then(function (response) {
                     //Clear errors
                     callback(response);
                 }, function(response) {
                     //Raise errors
                     callback(response);
                 });
        }

    });