angular
    .module('ledgerApp')
    .controller("ledgerController", function(Flash, $scope, $http, $location, $route, ledgerService, localStorageService) {

        var ls = localStorageService;

        //When controller is refreshed, get necessary data back from service

        if($route.current.originalPath == '/ledger/create') {
            
            $scope.ledger = null;
            ls.remove('ledger');
            $scope.currentLedgerName == '';
            ls.remove('currentLedgerName');
            $scope.clearButtonText = 'Clear';
            $scope.isReadOnly = false;

        } else if($route.current.originalPath == '/ledger/edit/:id') {

            $scope.ledger = ls.get('ledger');
            $scope.currentLedgerName = ls.get('currentLedgerName');
            $scope.isReadOnly = false;
            $scope.clearButtonText = 'Cancel';

            var id = $route.current.params.id;
            ledgerService.getById(id).then(function(ledger) {
                if(ledger[0] == undefined) {
                    $location.path('/ledgers');
                }
            });

        } else if($route.current.originalPath == '/ledger/view/:id') {

            $scope.ledger = ls.get('ledger');
            $scope.currentLedgerName = ls.get('currentLedgerName');
            $scope.isReadOnly = true;
            $scope.clearButtonText = 'OK';

            var id = $route.current.params.id;
            ledgerService.getById(id).then(function(ledger) {
                if(ledger[0] == undefined) {
                    $location.path('/ledgers');
                }
            });

        } else {

            $scope.ledger = null;
            ls.remove('ledger');
            $scope.currentLedgerName == '';
            ls.remove('currentLedgerName');
            $scope.isReadOnly = false;
            $scope.clearButtonText = '';

        }

        var reload = function() {
            ledgerService.fetch()
                        .then(function(ledgers) {
                            $scope.ledgers = ledgers;
                        });
            ledgerService.fetchGroups("Stock-in-Hand")
                        .then(function(groups) {
                            $scope.groups = groups;
                        });
            ledgerService.fetchStates()
                        .then(function(states) {
                            $scope.states = states;
                        });
            ledgerService.fetchCreditDebits()
                        .then(function(creditDebits) {
                            $scope.creditDebits = creditDebits;
                        });
        }

        reload();

        $scope.create = function() {
            $location.path('/ledger/create');            
        }

        $scope.clear = function() {
            
            var ledger = $scope.ledger;
            
            $scope.currentLedgerName = '';
            ls.remove('currentLedgerName');
            $scope.ledger = null;
            ls.remove('ledger');
            
            $scope.isReadOnly = false;
            
            if(!(ledger == null || ledger._id == undefined || ledger._id == null)) {
                $location.path('/ledgers');
            }
        }

        $scope.listLedgers = function() {
            $location.path('/ledgers');
        }

        $scope.editLedger = function(ledger, isReadOnly) {

            //Save data to the service because controller will get refreshed while redirecting the page
                
            $scope.currentLedgerName = ledger.name;
            ls.set('currentLedgerName', $scope.currentLedgerName);
            $scope.ledger = ledger;
            ls.set('ledger', $scope.ledger);

            if(isReadOnly) {
                $location.path('/ledger/view/' + ledger._id);
            } else {
                $location.path('/ledger/edit/' + ledger._id);
            }         
        
        }

        $scope.submit = function(ledger) {

            ledgerService.save(ledger, function(response) {

                if(response.status == 400) {
                    Flash.create('danger', response.data.errors[0].msg);
                }
                else {
                    Flash.create('success', response.data.success.msg);
                
                    $scope.ledger = null;
                    ls.remove('ledger');
                
                    if(!(ledger == null || ledger == undefined)) {
                        if(!(ledger._id == undefined || ledger._id == '')) {
                            $scope.currentLedgerName = '';                         
                            ls.remove('currentLedgerName');
                            $location.path('/ledgers');
                        }
                    }

                    if($scope.ledgerForm) {
                        $scope.ledgerForm.$setPristine();
                    }

                }

            });

        }

        $scope.deleteLedger = function(ledger) {
            ledgerService.remove(ledger, function(response) {
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