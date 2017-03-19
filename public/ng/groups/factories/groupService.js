angular
    .module('groupApp')
    .factory('groupService', function($http) {
        var factory = { fetch: fetch, getById: getById, getStockGroupById: getStockGroupById,
                        save: save, remove: remove };

        return factory; 

        //Usual CRUD operations
        //---------------------------------------------------------------

        function fetch(isStockGroup, groupName) {
            if(isStockGroup) {
                return $http.get('/api/group/selectedGroupAndItsDescendents/' + groupName)
                            .then(function(response) {
                                return response.data;
                            });
            } else {
                return $http.get('/api/group/otherThanSelectedGroupAndItsDescendents/' + groupName)
                            .then(function(response) {
                                return response.data;
                            });                
            }
        }

        function getById(id) {
            return $http.get('/api/group/' + id)
                        .then(function(group) {
                            return group.data;
                        });
        }

        function getStockGroupById(groupName, id) {
            return $http.get('/api/group/selectedGroupAndItsDescendents/' + groupName)
                        .then(function(groups) {
                            groups.forEach(function(group) {
                                if(group._id == id) {
                                    return group.data;
                                }
                            }, this);
                            return;
                        });
        }

        function save(group, isStockGroup, callback) {
            if(group == undefined || group._id == undefined || group._id == '') {
                $http.post('/api/group/' + isStockGroup, group)
                     .then(function (response) {
                         //Clear errors
                         callback(response);
                     }, function(response) {
                         //Raise errors
                         callback(response);
                     });
            } else {
                $http.put('/api/group/' + group._id + '/' + isStockGroup, group).then(function (response) {
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

