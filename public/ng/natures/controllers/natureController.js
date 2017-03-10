angular
    .module('natureApp')
    .controller("natureController", function(Flash, $scope, $http, $location, natureService) {

        //When controller is refreshed, get necessary data back from service

        $scope.nature = natureService.getNature();
        $scope.currentNatureName = natureService.getCurrentNatureName();
        $scope.isReadOnly = natureService.getIsReadOnly();
        $scope.clearButtonText = natureService.getClearButtonText();

        var reload = function() {
            natureService.fetch()
                        .then(function(natures) {
                            $scope.natures = natures;
                        });
        }

        reload();

        $scope.create = function() {
            // natureService.store(null, false);
            natureService.changeClearButtonText("Clear");
            $location.path('/nature/create');            
        }

        $scope.clear = function() {
            var nature = $scope.nature;
            $scope.currentNatureName = "";
            natureService.storeCurrentNatureName($scope.currentNatureName);
            $scope.nature = null;
            $scope.isReadOnly = false;
            natureService.store($scope.nature, $scope.isReadOnly);
            if(!(nature == null || nature._id == undefined || nature._id == null)) {
                $location.path('/nature');
            }
        }

        $scope.listNatures = function() {
            $location.path('/nature');
        }

        $scope.editNature = function(nature, isReadOnly) {

            //Save data to the service because controller will get refreshed while redirecting the page
                
            $scope.currentNatureName = nature.name;
            natureService.storeCurrentNatureName($scope.currentNatureName);
            $scope.nature = nature;
            natureService.store($scope.nature, isReadOnly);
            
            if(isReadOnly) {
                natureService.changeClearButtonText("OK");                            
            } else {
                natureService.changeClearButtonText("Cancel");            
            }
            
            $location.path('/nature/create');
        
        }

        $scope.submit = function(nature) {
            
            natureService.save(nature, function(response) {

                if(response.status == 400) {
                    Flash.create('danger', response.data.errors[0].msg);
                }
                else {
                    Flash.create('success', response.data.success.msg);
                
                    $scope.nature = null;
                    natureService.store($scope.nature, $scope.isReadOnly);
                    if(!(nature == null || nature == undefined)) {
                        if(!(nature._id == undefined || nature._id == '')) {
                            $scope.currentNatureName = "";                         
                            natureService.storeCurrentNatureName($scope.currentNatureName);
                            $location.path('/nature');
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