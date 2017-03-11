angular
    .module('countryApp')
    .controller("countryController", function(Flash, $scope, $http, $location, countryService, localStorageService) {

        var ls = localStorageService;

        //When controller is refreshed, get necessary data back from service

        $scope.country = ls.get('country');
        $scope.currentCountryName = ls.get('currentCountryName');
        $scope.currentCountryCode = ls.get('currentCountryCode');
        $scope.isReadOnly = ls.get('isReadOnly');
        $scope.clearButtonText = ls.get('clearButtonText');

        var reload = function() {
            countryService.fetch()
                        .then(function(countries) {
                            $scope.countries = countries;
                        });
        }

        reload();

        $scope.create = function() {
            ls.remove('country');
            ls.set('isReadOnly', false);
            ls.set('clearButtonText', 'Clear');
            $location.path('/country/create');            
        }

        $scope.clear = function() {
            var country = $scope.country;
            $scope.currentCountryName = "";
            $scope.currentCountryCode = "";
            ls.remove('currentCountryName');
            ls.remove('currentCountryCode');
            $scope.country = null;
            $scope.isReadOnly = false;
            ls.remove('country');
            ls.set('isReadOnly', $scope.isReadOnly);
            if(!(country == null || country._id == undefined || country._id == null)) {
                $location.path('/countries');
            }
        }

        $scope.listCountries = function() {
            $location.path('/countries');
        }

        $scope.editCountry = function(country, isReadOnly) {

            $scope.currentCountryName = country.name;
            $scope.currentCountryCode = country.code;
            ls.set('currentCountryName', $scope.currentCountryName);
            ls.set('currentCountryCode', $scope.currentCountryCode);
            $scope.country = country;
            ls.set('country', $scope.country);
            ls.set('isReadOnly', $scope.isReadOnly);
            
            if(isReadOnly) {
                ls.set('clearButtonText', 'OK');
            } else {
                ls.set('clearButtonText', 'Cancel');            
            }
            
            $location.path('/country/edit');
        
        }

        $scope.submit = function(country) {
            
            countryService.save(country, function(response) {

                if(response.status == 400) {
                    Flash.create('danger', response.data.errors[0].msg);
                }
                else {
                    Flash.create('success', response.data.success.msg);
                
                    $scope.country = null;
                    ls.remove('country');
                    ls.set('isReadOnly', $scope.isReadOnly);
                    if(!(country == null || country == undefined)) {
                        if(!(country._id == undefined || country._id == '')) {
                            $scope.currentCountryName = "";                         
                            $scope.currentCountryCode = "";                         
                            ls.remove('currentCountryName');
                            ls.remove('currentCountryCode');
                            $location.path('/countries');
                        }
                    }

                    if($scope.countryForm) {
                        $scope.countryForm.$setPristine();
                    }

                }

            });

        }

        $scope.deleteCountry = function(country) {
            countryService.remove(country, function(response) {
                if(response.status == 400) {
                    Flash.create('danger', response.data.errors[0].msg);
                }
                else {
                    Flash.create('success', response.data.success.msg);
                }
            });
            reload();
        }

        //For sorting data

        $scope.sortColumn = "name";
        $scope.reverseSort = false;

        $scope.sortData = function(column) {
            $scope.reverseSort = ($scope.sortColumn == column) ? !$scope.reverseSort : false;
            $scope.sortColumn = column;
        };

        $scope.getSortClass = function(column) {
            if($scope.sortColumn == column) {
                return $scope.reverseSort ? 'arrow-down' : 'arrow-up';
            }

            return '';
        };

        //For filtering data across columns

        $scope.searchItem = function(item) {
            
            if($scope.searchText == undefined || $scope.searchText == '') { return true; }
            else { if(item.name.toLowerCase().indexOf($scope.searchText.toLowerCase()) != -1 || 
                      item.code.toLowerCase().indexOf($scope.searchText.toLowerCase()) != -1) { return true; }
                 }
            return false;
        }


    });