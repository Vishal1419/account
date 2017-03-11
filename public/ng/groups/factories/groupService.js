angular
    .module('groupApp')
    .factory('groupService', function($http) {
        var factory = { fetch: fetch, getById: getById, save: save, remove: remove };

        return factory; 

        //Usual CRUD operations
        //---------------------------------------------------------------

        function fetch() {
            return $http.get('/api/group')
                        .then(function(response) {
                            return response.data;
                        });
        }

        function getById(id) {
            return $http.get('/api/group/' + id)
                        .then(function(group) {
                            return group.data;
                        });
        }

        function save(group, callback) {
            if(group == undefined || group._id == undefined || group._id == '') {
                $http.post('/api/group', group)
                     .then(function (response) {
                         //Clear errors
                         callback(response);
                     }, function(response) {
                         //Raise errors
                         callback(response);
                     });
            } else {
                $http.put('/api/group/' + group._id, group).then(function (response) {
                         //Clear errors
                         callback(response);
                     }, function(response) {
                         //Raise errors
                         callback(response);
                     });
            }
        }

        function remove(group, callback) {
            $http.delete('/api/group/' + group._id + '/' + encodeURL(group.name), group)
                 .then(function (response) {
                     //Clear errors
                     callback(response);
                 }, function(response) {
                     //Raise errors
                     callback(response);
                 });
        }

    });

