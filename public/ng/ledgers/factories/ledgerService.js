angular
    .module('ledgerApp')
    .factory('ledgerService', function($http) {
        var factory = { fetch: fetch, fetchGroups: fetchGroups, fetchStates: fetchStates, fetchCreditDebits: fetchCreditDebits,
                        getById: getById, save: save, remove: remove };

        return factory; 

        //Usual CRUD operations
        //---------------------------------------------------------------

        function fetch() {
            return $http.get('/api/ledger')
                        .then(function(ledgers) {
                            return ledgers.data;
                        });
        }

        function fetchGroups(groupName) {
            return $http.get('/api/group/otherThanSelectedGroupAndItsDescendents/' + groupName)
                        .then(function(groups) {
                            return groups.data;
                        });
        }

        function fetchStates() {
            return $http.get('/api/state')
                        .then(function(states) {
                            return states.data;
                        });
        }

        function fetchCreditDebits() {
            return $http.get('/api/creditDebit')
                        .then(function(creditDebits) {
                            return creditDebits.data;
                        });
        }

        function getById(id) {
            return $http.get('/api/ledger/' + id)
                        .then(function(ledger) {
                            return ledger.data;
                        });
        }

        function save(ledger, callback) {
            if(ledger == undefined || ledger._id == undefined || ledger._id == '') {
                $http.post('/api/ledger', ledger)
                     .then(function (response) {
                         //Clear errors
                         callback(response);
                     }, function(response) {
                         //Raise errors
                         callback(response);
                     });
            } else {
                $http.put('/api/ledger/' + ledger._id, ledger).then(function (response) {
                         //Clear errors
                         callback(response);
                     }, function(response) {
                         //Raise errors
                         callback(response);
                     });
            }
        }

        function remove(ledger, callback) {
            $http.delete('/api/ledger/' + ledger._id + '/' + encodeURL(ledger.name), ledger)
                 .then(function (response) {
                     //Clear errors
                     callback(response);
                 }, function(response) {
                     //Raise errors
                     callback(response);
                 });
        }

    });