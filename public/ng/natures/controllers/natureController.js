angular
    .module('natureApp')
    .controller("natureController", function(Flash, $scope, $http, $location, natureService, localStorageService) {

        var ls = localStorageService;

        //When controller is refreshed, get necessary data back from service

        $scope.nature = ls.get('nature');
        $scope.currentNatureName = ls.get('currentNatureName');
        $scope.isReadOnly = ls.get('isReadOnly');
        $scope.clearButtonText = ls.get('clearButtonText');

        var reload = function() {
            natureService.fetch()
                        .then(function(natures) {
                            $scope.natures = natures;
                        });
        }

        reload();

        $scope.create = function() {
            ls.remove('nature');
            ls.set('isReadOnly', false);
            ls.set('clearButtonText', 'Clear');
            $location.path('/nature/create');            
        }

        $scope.clear = function() {
            var nature = $scope.nature;
            $scope.currentNatureName = "";
            ls.remove('currentNatureName');
            $scope.nature = null;
            $scope.isReadOnly = false;
            ls.remove('nature');
            ls.set('isReadOnly', false);
            if(!(nature == null || nature._id == undefined || nature._id == null)) {
                $location.path('/natures');
            }
        }

        $scope.listNatures = function() {
            $location.path('/natures');
        }

        $scope.editNature = function(nature, isReadOnly) {

            //Save data to the service because controller will get refreshed while redirecting the page
                
            $scope.currentNatureName = nature.name;
            ls.set('currentNatureName', $scope.currentNatureName);
            $scope.nature = nature;
            ls.set('nature', $scope.nature);
            ls.set('isReadOnly', $scope.isReadOnly);
            
            if(isReadOnly) {
                ls.set('clearButtonText', 'OK');
            } else {
                ls.set('clearButtonText', 'Cancel');
            }
            
            $location.path('/nature/edit');
        
        }

        $scope.submit = function(nature) {
            
            natureService.save(nature, function(response) {

                if(response.status == 400) {
                    Flash.create('danger', response.data.errors[0].msg);
                }
                else {
                    Flash.create('success', response.data.success.msg);
                
                    $scope.nature = null;
                    ls.remove('nature');
                    ls.set('isReadOnly', $scope.isReadOnly);
                    if(!(nature == null || nature == undefined)) {
                        if(!(nature._id == undefined || nature._id == '')) {
                            $scope.currentNatureName = "";                         
                            ls.remove('currentNatureName');
                            $location.path('/natures');
                        }
                    }

                    if($scope.natureForm) {
                        $scope.natureForm.$setPristine();
                    }

                }

            });

        }

        $scope.deleteNature = function(nature) {
            natureService.remove(nature, function(response) {
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