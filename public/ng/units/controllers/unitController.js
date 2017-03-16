angular
    .module('unitApp')
    .controller("unitController", function(Flash, $scope, $http, $location, $route, unitService, localStorageService) {

        var ls = localStorageService;

        //When controller is refreshed, get necessary data back from service

        if($route.current.originalPath == '/unit/create') {
            
            $scope.unit = null;
            ls.remove('unit');
            $scope.currentUnitName == '';
            ls.remove('currentUnitName');
            $scope.currentUnitSymbol == '';
            ls.remove('currentUnitSymbol');
            $scope.clearButtonText = 'Clear';
            $scope.isReadOnly = false;

        } else if($route.current.originalPath == '/unit/edit/:id') {

            $scope.unit = ls.get('unit');
            $scope.currentUnitName = ls.get('currentUnitName');
            $scope.currentUnitSymbol = ls.get('currentUnitSymbol');
            $scope.isReadOnly = false;
            $scope.clearButtonText = 'Cancel';

            var id = $route.current.params.id;
            unitService.getById(id).then(function(unit) {
                if(unit[0] == undefined) {
                    $location.path('/units');
                }
            });

        } else if($route.current.originalPath == '/unit/view/:id') {

            $scope.unit = ls.get('unit');
            $scope.currentUnitName = ls.get('currentUnitName');
            $scope.currentUnitSymbol = ls.get('currentUnitSymbol');
            $scope.isReadOnly = true;
            $scope.clearButtonText = 'OK';

            var id = $route.current.params.id;
            unitService.getById(id).then(function(unit) {
                if(unit[0] == undefined) {
                    $location.path('/units');
                }
            });

        } else {

            $scope.unit = null;
            ls.remove('unit');
            $scope.currentUnitName == '';
            ls.remove('currentUnitName');
            $scope.currentUnitSymbol == '';
            ls.remove('currentUnitSymbol');
            $scope.isReadOnly = false;
            $scope.clearButtonText = '';

        }

        var reload = function() {
            unitService.fetch()
                        .then(function(units) {
                            $scope.units = units;
                        });
        }

        reload();

        $scope.create = function() {
            $location.path('/unit/create');            
        }

        $scope.clear = function() {

            var unit = $scope.unit;
            
            $scope.currentUnitName = "";
            ls.remove('currentUnitName');            
            $scope.currentUnitSymbol = "";
            ls.remove('currentUnitSymbol');            
            $scope.unit = null;
            ls.remove('unit');

            $scope.isReadOnly = false;

            if(!(unit == null || unit._id == undefined || unit._id == null)) {
                $location.path('/units');
            }
        }

        $scope.listUnits = function() {
            $location.path('/units');
        }

        $scope.editUnit = function(unit, isReadOnly) {

            //Save data to the service because controller will get refreshed while redirecting the page
                
            $scope.currentUnitName = unit.name;
            ls.set('currentUnitName', $scope.currentUnitName);
            $scope.currentUnitSymbol = unit.symbol;
            ls.set('currentUnitSymbol', $scope.currentUnitSymbol);
            $scope.unit = unit;
            ls.set('unit', $scope.unit);
            
            if(isReadOnly) {
                $location.path('/unit/view/' + unit._id);
            } else {
                $location.path('/unit/edit/' + unit._id);
            }     
        
        }

        $scope.submit = function(unit) {
            
            unitService.save(unit, function(response) {

                if(response.status == 400) {
                    Flash.create('danger', response.data.errors[0].msg);
                }
                else {
                    Flash.create('success', response.data.success.msg);
                
                    $scope.unit = null;
                    ls.remove('unit');

                    if(!(unit == null || unit == undefined)) {
                        if(!(unit._id == undefined || unit._id == '')) {
                            $scope.currentUnitName = "";                         
                            ls.remove('currentUnitName');
                            $scope.currentUnitSymbol = "";                         
                            ls.remove('currentUnitSymbol');
                            $location.path('/units');
                        }
                    }

                    if($scope.unitForm) {
                        $scope.unitForm.$setPristine();
                    }

                }

            });

        }

        $scope.deleteUnit = function(unit) {
            unitService.remove(unit, function(response) {
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

    });