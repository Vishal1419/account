angular
    .module('stateApp')
    .controller("stateController", function(Flash, $scope, $http, $location, $route, stateService, localStorageService) {

        var ls = localStorageService;

        //When controller is refreshed, get necessary data back from service

        if($route.current.originalPath == '/state/create') {
            
            $scope.state = null;
            ls.remove('state');
            $scope.currentStateName == '';
            ls.remove('currentStateName');
            $scope.clearButtonText = 'Clear';
            $scope.isReadOnly = false;

        } else if($route.current.originalPath == '/state/edit/:id') {

            $scope.state = ls.get('state');
            $scope.currentStateName = ls.get('currentStateName');
            $scope.isReadOnly = false;
            $scope.clearButtonText = 'Cancel';

            var id = $route.current.params.id;
            stateService.getById(id).then(function(state) {
                if(state[0] == undefined) {
                    $location.path('/states');
                }
            });

        } else if($route.current.originalPath == '/state/view/:id') {

            $scope.state = ls.get('state');
            $scope.currentStateName = ls.get('currentStateName');
            $scope.isReadOnly = true;
            $scope.clearButtonText = 'OK';

            var id = $route.current.params.id;
            stateService.getById(id).then(function(state) {
                if(state[0] == undefined) {
                    $location.path('/states');
                }
            });

        } else {

            $scope.state = null;
            ls.remove('state');
            $scope.currentStateName == '';
            ls.remove('currentStateName');
            $scope.isReadOnly = false;
            $scope.clearButtonText = '';

        }


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
            $location.path('/state/create');            
        }

        $scope.clear = function() {
            
            var state = $scope.state;
            
            $scope.currentStateName = '';
            ls.remove('currentStateName');
            $scope.state = null;
            ls.remove('state');
            
            $scope.isReadOnly = false;
            
            if(!(state == null || state._id == undefined || state._id == null)) {
                $location.path('/states');
            }
        }

        $scope.listStates = function() {
            $location.path('/states');
        }

        $scope.editState = function(state, isReadOnly) {

            //Save data to the service because controller will get refreshed while redirecting the page
                
            $scope.currentStateName = state.name;
            ls.set('currentStateName', $scope.currentStateName);
            $scope.state = state;
            ls.set('state', $scope.state);

            if(isReadOnly) {
                $location.path('/state/view/' + state._id);
            } else {
                $location.path('/state/edit/' + state._id);
            }         
        
        }

        $scope.submit = function(state) {
            
            stateService.save(state, function(response) {

                if(response.status == 400) {
                    Flash.create('danger', response.data.errors[0].msg);
                }
                else {
                    Flash.create('success', response.data.success.msg);
                
                    $scope.state = null;
                    ls.remove('state');
                
                    if(!(state == null || state == undefined)) {
                        if(!(state._id == undefined || state._id == '')) {
                            $scope.currentStateName = '';                         
                            ls.remove('currentStateName');
                            $location.path('/states');
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