angular
    .module('stateApp')
    .factory('stateService', function($http) {
        var factory = { fetch: fetch, fetchCountries: fetchCountries, save: save, remove: remove, 
                        store: store, getState: getState, getIsReadOnly: getIsReadOnly,
                        changeClearButtonText: changeClearButtonText, getClearButtonText: getClearButtonText,
                        storeCurrentStateName: storeCurrentStateName, getCurrentStateName: getCurrentStateName                      
                     };

        var savedState = {};
        var isReadOnlyState = false;
        var clearButtonTxt = "Clear";
        var currState = '';

        return factory; 

        //Usual CRUD operations
        //---------------------------------------------------------------

        function fetch() {
            return $http.get('/api/state')
                        .then(function(states) {
                            return states.data;
                        });
        }

        function fetchCountries() {
            return $http.get('/api/country')
                        .then(function(countries) {
                            return countries.data;
                        });
        }

        function save(state, callback) {
            if(state == undefined || state._id == undefined || state._id == '') {
                $http.post('/api/state', state)
                     .then(function (response) {
                         //Clear errors
                         callback(response);
                     }, function(response) {
                         //Raise errors
                         callback(response);
                     });
            } else {
                $http.put('/api/state/' + state._id, state).then(function (response) {
                         //Clear errors
                         callback(response);
                     }, function(response) {
                         //Raise errors
                         callback(response);
                     });
            }
        }

        function remove(state, callback) {
            $http.delete('/api/state/' + state._id + '/' + encodeURL(state.name), state)
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

        function store(state, isReadOnly) {  
            savedState = state;
            isReadOnlyState = isReadOnly
        };

        function getState() {
            return savedState;
        };

        function getIsReadOnly() {
            return isReadOnlyState;
        };


        function changeClearButtonText(clearButtonText) {
            clearButtonTxt = clearButtonText;
        };

        function getClearButtonText() {
            return clearButtonTxt;
        };


        function storeCurrentStateName(currentState) {
            currState = currentState;
        };

        function getCurrentStateName() {
            return currState;
        };

        //----------------------------------------------------------
    });

