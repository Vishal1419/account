angular
    .module('creditDebitApp')
    .controller("creditDebitController", function(Flash, $scope, $http, $location, $route, creditDebitService, localStorageService) {

        var ls = localStorageService;

        //When controller is refreshed, get necessary data back from service

        if($route.current.originalPath == '/creditDebit/create') {
            
            $scope.creditDebit = null;
            ls.remove('creditDebit');
            $scope.currentCreditDebitName == '';
            ls.remove('currentCreditDebitName');
            $scope.currentCreditDebitCode == '';
            ls.remove('currentCreditDebitCode');
            $scope.clearButtonText = 'Clear';
            $scope.isReadOnly = false;

        } else if($route.current.originalPath == '/creditDebit/edit/:id') {

            $scope.creditDebit = ls.get('creditDebit');
            $scope.currentCreditDebitName = ls.get('currentCreditDebitName');
            $scope.currentCreditDebitCode = ls.get('currentCreditDebitCode');
            $scope.isReadOnly = false;
            $scope.clearButtonText = 'Cancel';

            var id = $route.current.params.id;
            creditDebitService.getById(id).then(function(creditDebit) {
                if(creditDebit[0] == undefined) {
                    $location.path('/creditDebits');
                }
            });

        } else if($route.current.originalPath == '/creditDebit/view/:id') {

            $scope.creditDebit = ls.get('creditDebit');
            $scope.currentCreditDebitName = ls.get('currentCreditDebitName');
            $scope.currentCreditDebitCode = ls.get('currentCreditDebitCode');
            $scope.isReadOnly = true;
            $scope.clearButtonText = 'OK';

            var id = $route.current.params.id;
            creditDebitService.getById(id).then(function(creditDebit) {
                if(creditDebit[0] == undefined) {
                    $location.path('/creditDebits');
                }
            });

        } else {

            $scope.creditDebit = null;
            ls.remove('creditDebit');
            $scope.currentCreditDebitName == '';
            ls.remove('currentCreditDebitName');
            $scope.currentCreditDebitCode == '';
            ls.remove('currentCreditDebitCode');
            $scope.isReadOnly = false;
            $scope.clearButtonText = '';

        }

        var reload = function() {
            creditDebitService.fetch()
                        .then(function(creditDebits) {
                            $scope.creditDebits = creditDebits;
                        });
        }

        reload();

        $scope.create = function() {
            $location.path('/creditDebit/create');            
        }

        $scope.clear = function() {

            var creditDebit = $scope.creditDebit;

            $scope.currentCreditDebitName = "";
            $scope.currentCreditDebitCode = "";
            ls.remove('currentCreditDebitName');
            ls.remove('currentCreditDebitCode');
            $scope.creditDebit = null;
            ls.remove('creditDebit');

            $scope.isReadOnly = false;

            if(!(creditDebit == null || creditDebit._id == undefined || creditDebit._id == null)) {
                $location.path('/creditDebits');
            }
        }

        $scope.listCreditDebits = function() {
            $location.path('/creditDebits');
        }

        $scope.editCreditDebit = function(creditDebit, isReadOnly) {

            $scope.currentCreditDebitName = creditDebit.name;
            $scope.currentCreditDebitCode = creditDebit.code;
            ls.set('currentCreditDebitName', $scope.currentCreditDebitName);
            ls.set('currentCreditDebitCode', $scope.currentCreditDebitCode);
            $scope.creditDebit = creditDebit;
            ls.set('creditDebit', $scope.creditDebit);
            
            if(isReadOnly) {
                $location.path('/creditDebit/view/' + creditDebit._id);
            } else {
                $location.path('/creditDebit/edit/' + creditDebit._id);
            }  
        }

        $scope.submit = function(creditDebit) {
            
            creditDebitService.save(creditDebit, function(response) {

                if(response.status == 400) {
                    Flash.create('danger', response.data.errors[0].msg);
                }
                else {
                    Flash.create('success', response.data.success.msg);
                
                    $scope.creditDebit = null;
                    ls.remove('creditDebit');

                    if(!(creditDebit == null || creditDebit == undefined)) {
                        if(!(creditDebit._id == undefined || creditDebit._id == '')) {
                            $scope.currentCreditDebitName = "";                         
                            $scope.currentCreditDebitCode = "";                         
                            ls.remove('currentCreditDebitName');
                            ls.remove('currentCreditDebitCode');
                            $location.path('/creditDebits');
                        }
                    }

                    if($scope.creditDebitForm) {
                        $scope.creditDebitForm.$setPristine();
                    }

                }

            });

        }

        $scope.deleteCreditDebit = function(creditDebit) {
            creditDebitService.remove(creditDebit, function(response) {
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