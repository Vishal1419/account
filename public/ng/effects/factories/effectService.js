angular
    .module('effectApp')
    .factory('effectService', function($http) {
        var factory = { fetch: fetch, save: save, remove: remove, 
                        store: store, getEffect: getEffect, getIsReadOnly: getIsReadOnly,
                        changeClearButtonText: changeClearButtonText, getClearButtonText: getClearButtonText,
                        storeCurrentEffectName: storeCurrentEffectName, getCurrentEffectName: getCurrentEffectName                        
                     };

        var savedEffect = {};
        var isReadOnlyEffect = false;
        var clearButtonTxt = "Clear";
        var currEffect = "";

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

        //------------------------------------------------------------------

        //These functions are used for saving temporary data 
        //if controller is refreshed, then it can get data from this service
        //-------------------------------------------------------------------

        function store(effect, isReadOnly) {  
            savedEffect = effect;
            isReadOnlyEffect = isReadOnly
        };

        function changeClearButtonText(clearButtonText) {
            clearButtonTxt = clearButtonText;
        };

        function storeCurrentEffectName(currentEffect) {
            currEffect = currentEffect;
        };

        function getEffect() {
            return savedEffect;
        };

        function getIsReadOnly() {
            return isReadOnlyEffect;
        };

        function getClearButtonText() {
            return clearButtonTxt;
        };

        function getCurrentEffectName() {
            return currEffect;
        };

        //----------------------------------------------------------
    });

