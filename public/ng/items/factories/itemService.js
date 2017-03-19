angular
    .module('itemApp')
    .factory('itemService', function($http) {
        var factory = { fetch: fetch, fetchStockGroups: fetchStockGroups, fetchUnits: fetchUnits,
                        getById: getById, save: save, remove: remove };

        return factory; 

        //Usual CRUD operations
        //---------------------------------------------------------------

        function fetch() {
            return $http.get('/api/item')
                        .then(function(items) {
                            return items.data;
                        });
        }

        function fetchStockGroups(groupName) {
            return $http.get('/api/group/selectedGroupAndItsDescendents/' + groupName)
                        .then(function(groups) {
                            return groups.data;
                        });
        }

        function fetchUnits() {
            return $http.get('/api/unit')
                        .then(function(units) {
                            return units.data;
                        });
        }

        function getById(id) {
            return $http.get('/api/item/' + id)
                        .then(function(item) {
                            return item.data;
                        });
        }

        function save(item, callback) {
            if(item == undefined || item._id == undefined || item._id == '') {
                $http.post('/api/item', item)
                     .then(function (response) {
                         //Clear errors
                         callback(response);
                     }, function(response) {
                         //Raise errors
                         callback(response);
                     });
            } else {
                $http.put('/api/item/' + item._id, item).then(function (response) {
                         //Clear errors
                         callback(response);
                     }, function(response) {
                         //Raise errors
                         callback(response);
                     });
            }
        }

        function remove(item, callback) {
            $http.delete('/api/item/' + item._id + '/' + encodeURL(item.name), item)
                 .then(function (response) {
                     //Clear errors
                     callback(response);
                 }, function(response) {
                     //Raise errors
                     callback(response);
                 });
        }

    });