angular
    .module('countryApp')
    .factory('countryService', function($http) {
        var factory = { fetch: fetch, save: save, remove: remove, 
                        store: store, getCountry: getCountry, getIsReadOnly: getIsReadOnly,
                        changeClearButtonText: changeClearButtonText, getClearButtonText: getClearButtonText,
                        storeCurrentCountry: storeCurrentCountry, getCurrentCountryName: getCurrentCountryName, getCurrentCountryCode: getCurrentCountryCode                        
                     };

        var savedCountry = {};
        var isReadOnlyCountry = false;
        var clearButtonTxt = "Clear";
        var currCountry = "";
        var currCountryCode = "";

        return factory; 

        //Usual CRUD operations
        //---------------------------------------------------------------

        function fetch() {
            return $http.get('/api/country')
                        .then(function(response) {
                            return response.data;
                        });
        }

        function save(country, callback) {
            if(country == undefined || country._id == undefined || country._id == '') {
                $http.post('/api/country', country)
                     .then(function (response) {
                         //Clear errors
                         callback(response);
                     }, function(response) {
                         //Raise errors
                         callback(response);
                     });
            } else {
                $http.put('/api/country/' + country._id, country).then(function (response) {
                         //Clear errors
                         callback(response);
                     }, function(response) {
                         //Raise errors
                         callback(response);
                     });
            }
        }

        function remove(country, callback) {
            $http.delete('/api/country/' + country._id + '/' + country.name.replace(/\//g,'%2F'), country)
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

        function store(country, isReadOnly) {  
            savedCountry = country;
            isReadOnlyCountry = isReadOnly
        };

        function changeClearButtonText(clearButtonText) {
            clearButtonTxt = clearButtonText;
        };

        function storeCurrentCountry(currentCountry, currentCountryCode) {
            currCountry = currentCountry;
            currCountryCode = currentCountryCode;
        };

        function getCountry() {
            return savedCountry;
        };

        function getIsReadOnly() {
            return isReadOnlyCountry;
        };

        function getClearButtonText() {
            return clearButtonTxt;
        };

        function getCurrentCountryName() {
            return currCountry;
        };

        function getCurrentCountryCode() {
            return currCountryCode;
        };

        //----------------------------------------------------------
    });

