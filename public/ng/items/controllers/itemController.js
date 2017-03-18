angular
    .module('itemApp')
    .controller("itemController", function(Flash, $scope, $http, $location, $route, itemService, localStorageService) {

        var ls = localStorageService;

        //When controller is refreshed, get necessary data back from service

        if($route.current.originalPath == '/item/create') {
            
            $scope.item = null;
            ls.remove('item');
            $scope.currentItemName == '';
            ls.remove('currentItemName');
            $scope.clearButtonText = 'Clear';
            $scope.isReadOnly = false;

        } else if($route.current.originalPath == '/item/edit/:id') {

            $scope.item = ls.get('item');
            $scope.currentItemName = ls.get('currentItemName');
            $scope.isReadOnly = false;
            $scope.clearButtonText = 'Cancel';

            var id = $route.current.params.id;
            itemService.getById(id).then(function(item) {
                if(item[0] == undefined) {
                    $location.path('/items');
                }
            });

        } else if($route.current.originalPath == '/item/view/:id') {

            $scope.item = ls.get('item');
            $scope.currentItemName = ls.get('currentItemName');
            $scope.isReadOnly = true;
            $scope.clearButtonText = 'OK';

            var id = $route.current.params.id;
            itemService.getById(id).then(function(item) {
                if(item[0] == undefined) {
                    $location.path('/items');
                }
            });

        } else {

            $scope.item = null;
            ls.remove('item');
            $scope.currentItemName == '';
            ls.remove('currentItemName');
            $scope.isReadOnly = false;
            $scope.clearButtonText = '';

        }

        var reload = function() {
            itemService.fetch()
                        .then(function(items) {
                            $scope.items = items;
                        });
            itemService.fetchStockGroups("Stock-in-Hand")
                        .then(function(groups) {
                            $scope.groups = groups;
                        });
            itemService.fetchUnits()
                        .then(function(units) {
                            $scope.units = units;
                        });
        }

        reload();

        $scope.create = function() {
            $location.path('/item/create');            
        }

        $scope.clear = function() {
            
            var item = $scope.item;
            
            $scope.currentItemName = '';
            ls.remove('currentItemName');
            $scope.item = null;
            ls.remove('item');
            
            $scope.isReadOnly = false;
            
            if(!(item == null || item._id == undefined || item._id == null)) {
                $location.path('/items');
            }
        }

        $scope.listItems = function() {
            $location.path('/items');
        }

        $scope.editItem = function(item, isReadOnly) {

            //Save data to the service because controller will get refreshed while redirecting the page
                
            $scope.currentItemName = item.name;
            ls.set('currentItemName', $scope.currentItemName);
            $scope.item = item;
            ls.set('item', $scope.item);

            if(isReadOnly) {
                $location.path('/item/view/' + item._id);
            } else {
                $location.path('/item/edit/' + item._id);
            }         
        
        }

        $scope.submit = function(item) {

            itemService.save(item, function(response) {

                if(response.status == 400) {
                    Flash.create('danger', response.data.errors[0].msg);
                }
                else {
                    Flash.create('success', response.data.success.msg);
                
                    $scope.item = null;
                    ls.remove('item');
                
                    if(!(item == null || item == undefined)) {
                        if(!(item._id == undefined || item._id == '')) {
                            $scope.currentItemName = '';                         
                            ls.remove('currentItemName');
                            $location.path('/items');
                        }
                    }

                    if($scope.itemForm) {
                        $scope.itemForm.$setPristine();
                    }

                }

            });

        }

        $scope.deleteItem = function(item) {
            itemService.remove(item, function(response) {
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
            
            var parent = (item.parent == undefined || item.parent == null) ? false : item.parent.name.toLowerCase().indexOf($scope.searchText == undefined ? '' : $scope.searchText.toLowerCase()) != -1;
            var unit = (item.unit == undefined || item.unit == null) ? false : item.unit.symbol.toLowerCase().indexOf($scope.searchText == undefined ? '' : $scope.searchText.toLowerCase()) != -1;

            if($scope.searchText == undefined || $scope.searchText == '') { return true; }
            else { if(item.name.toLowerCase().indexOf($scope.searchText.toLowerCase()) != -1 || 
                      parent || unit) { return true; }
                 }
            return false;
        }

    });