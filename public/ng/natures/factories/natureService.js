angular
    .module('natureApp')
    .factory('natureService', function($http) {
        var factory = { fetch: fetch, save: save, remove: remove, 
                        store: store, getNature: getNature, getIsReadOnly: getIsReadOnly,
                        changeClearButtonText: changeClearButtonText, getClearButtonText: getClearButtonText,
                        storeCurrentNatureName: storeCurrentNatureName, getCurrentNatureName: getCurrentNatureName                        
                     };

        var savedNature = {};
        var isReadOnlyNature = false;
        var clearButtonTxt = "Clear";
        var currNature = "";

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
            $http.delete('/api/nature/' + nature._id + '/' + nature.name.replace(/\//g,'%2F'), nature)
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

        function store(nature, isReadOnly) {  
            savedNature = nature;
            isReadOnlyNature = isReadOnly
        };

        function changeClearButtonText(clearButtonText) {
            clearButtonTxt = clearButtonText;
        };

        function storeCurrentNatureName(currentNature) {
            currNature = currentNature;
        };

        function getNature() {
            return savedNature;
        };

        function getIsReadOnly() {
            return isReadOnlyNature;
        };

        function getClearButtonText() {
            return clearButtonTxt;
        };

        function getCurrentNatureName() {
            return currNature;
        };

        //----------------------------------------------------------
    });

