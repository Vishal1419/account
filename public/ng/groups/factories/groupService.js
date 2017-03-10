angular
    .module('groupApp')
    .factory('groupService', function($http) {
        var factory = { fetch: fetch, save: save, remove: remove, 
                        store: store, getGroup: getGroup, getIsReadOnly: getIsReadOnly,
                        changeClearButtonText: changeClearButtonText, getClearButtonText: getClearButtonText,
                        storeCurrentGroupName: storeCurrentGroupName, getCurrentGroupName: getCurrentGroupName                      
                     };

        var savedGroup = {};
        var isReadOnlyGroup = false;
        var clearButtonTxt = "Clear";
        var currGroup = '';

        return factory; 

        //Usual CRUD operations
        //---------------------------------------------------------------

        function fetch() {
            return $http.get('/api/group')
                        .then(function(response) {
                            return response.data;
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
            $http.delete('/api/group/' + group._id + '/' + group.name.replace(/\//g,'%2F'), group)
                 .then(function (response) {
                     //Clear errors
                     callback(response);
                 }, function(response) {
                     //Raise errors
                     callback(response);
                 });
        }

        //------------------------------------------------------------------

        //These functions are used for saving temporary data 
        //if controller is refreshed, then it can get data from this service
        //-------------------------------------------------------------------

        function store(group, isReadOnly) {  
            savedGroup = group;
            isReadOnlyGroup = isReadOnly
        };

        function getGroup() {
            return savedGroup;
        };

        function getIsReadOnly() {
            return isReadOnlyGroup;
        };


        function changeClearButtonText(clearButtonText) {
            clearButtonTxt = clearButtonText;
        };

        function getClearButtonText() {
            return clearButtonTxt;
        };


        function storeCurrentGroupName(currentGroup) {
            currGroup = currentGroup;
        };

        function getCurrentGroupName() {
            return currGroup;
        };

        //----------------------------------------------------------
    });

