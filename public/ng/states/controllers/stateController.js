angular
    .module('stateApp')
    .controller("stateController", function(Flash, $scope, $http, $location, stateService) {

        //When controller is refreshed, get necessary data back from service

        $scope.state = stateService.getState();
        $scope.currentStateName = stateService.getCurrentStateName();
        $scope.isReadOnly = stateService.getIsReadOnly();
        $scope.clearButtonText = stateService.getClearButtonText();

        var reload = function() {
            stateService.fetch()
                        .then(function(states) {
                            $scope.states = states;
                        });
            stateService.fetchCountries()
                        .then(function(countries) {
                            $scope.countries = countries;
                        });
        }

        reload();

        $scope.create = function() {
            // stateService.store(null, false);
            stateService.changeClearButtonText("Clear");
            $location.path('/state/create');            
        }

        $scope.clear = function() {
            var state = $scope.state;
            $scope.currentStateName = '';
            stateService.storeCurrentStateName($scope.currentStateName);
            $scope.state = null;
            $scope.isReadOnly = false;
            stateService.store($scope.state, $scope.isReadOnly);
            if(!(state == null || state._id == undefined || state._id == null)) {
                $location.path('/state');
            }
        }

        $scope.listStates = function() {
            $location.path('/state');
        }

        $scope.editState = function(state, isReadOnly) {

            //Save data to the service because controller will get refreshed while redirecting the page
                
            $scope.currentStateName = state.name;
            stateService.storeCurrentStateName($scope.currentStateName);
            $scope.state = state;
            stateService.store($scope.state, isReadOnly);
            
            if(isReadOnly) {
                stateService.changeClearButtonText("OK");                            
            } else {
                stateService.changeClearButtonText("Cancel");            
            }
            
            $location.path('/state/create');
        
        }

        $scope.submit = function(state) {
            
            stateService.save(state, function(response) {

                if(response.status == 400) {
                    Flash.create('danger', response.data.errors[0].msg);
                }
                else {
                    Flash.create('success', response.data.success.msg);
                
                    $scope.state = null;
                    stateService.store($scope.state, $scope.isReadOnly);
                    if(!(state == null || state == undefined)) {
                        if(!(state._id == undefined || state._id == '')) {
                            $scope.currentStateName = '';                         
                            stateService.storeCurrentStateName($scope.currentStateName);
                            $location.path('/state');
                        }
                    }

                    if($scope.stateForm) {
                        $scope.stateForm.$setPristine();
                    }

                }

            });

        }

        $scope.deleteState = function(state) {
            stateService.remove(state, function(response) {
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
            
            var country = (item.country == undefined || item.country == null) ? false : item.country.name.toLowerCase().indexOf($scope.searchText == undefined ? '' : $scope.searchText.toLowerCase()) != -1;

            if($scope.searchText == undefined || $scope.searchText == '') { return true; }
            else { if(item.name.toLowerCase().indexOf($scope.searchText.toLowerCase()) != -1 || country) { return true; } }
            return false;
        }

    });