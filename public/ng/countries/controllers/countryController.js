angular
    .module('countryApp')
    .controller("countryController", function(Flash, $scope, $http, $location, countryService) {

        //When controller is refreshed, get necessary data back from service

        $scope.country = countryService.getCountry();
        $scope.currentCountryName = countryService.getCurrentCountryName();
        $scope.currentCountryCode = countryService.getCurrentCountryCode();
        $scope.isReadOnly = countryService.getIsReadOnly();
        $scope.clearButtonText = countryService.getClearButtonText();

        var reload = function() {
            countryService.fetch()
                        .then(function(countries) {
                            $scope.countries = countries;
                        });
        }

        reload();

        $scope.create = function() {
            // countryService.store(null, false);
            countryService.changeClearButtonText("Clear");
            $location.path('/country/create');            
        }

        $scope.clear = function() {
            var country = $scope.country;
            $scope.currentCountryName = "";
            $scope.currentCountryCode = "";
            countryService.storeCurrentCountry($scope.currentCountryName, $scope.currentCountryCode);
            $scope.country = null;
            $scope.isReadOnly = false;
            countryService.store($scope.country, $scope.isReadOnly);
            if(!(country == null || country._id == undefined || country._id == null)) {
                $location.path('/country');
            }
        }

        $scope.listCountries = function() {
            $location.path('/country');
        }

        $scope.editCountry = function(country, isReadOnly) {

            //Save data to the service because controller will get refreshed while redirecting the page
                
            $scope.currentCountryName = country.name;
            $scope.currentCountryCode = country.code;
            countryService.storeCurrentCountry($scope.currentCountryName, $scope.currentCountryCode);
            $scope.country = country;
            countryService.store($scope.country, isReadOnly);
            
            if(isReadOnly) {
                countryService.changeClearButtonText("OK");                            
            } else {
                countryService.changeClearButtonText("Cancel");            
            }
            
            $location.path('/country/create');
        
        }

        $scope.submit = function(country) {
            
            countryService.save(country, function(response) {

                if(response.status == 400) {
                    Flash.create('danger', response.data.errors[0].msg);
                }
                else {
                    Flash.create('success', response.data.success.msg);
                
                    $scope.country = null;
                    countryService.store($scope.country, $scope.isReadOnly);
                    if(!(country == null || country == undefined)) {
                        if(!(country._id == undefined || country._id == '')) {
                            $scope.currentCountryName = "";                         
                            $scope.currentCountryCode = "";                         
                            countryService.storeCurrentCountry($scope.currentCountryName, $scope.currentCountryCode);
                            $location.path('/country');
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