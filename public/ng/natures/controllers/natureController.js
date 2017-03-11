angular
    .module('natureApp')
    .controller("natureController", function(Flash, $scope, $http, $location, $route, natureService, localStorageService) {

        var ls = localStorageService;

        //When controller is refreshed, get necessary data back from service

        if($route.current.originalPath == '/nature/create') {
            
            $scope.nature = null;
            ls.remove('nature');
            $scope.currentNatureName == '';
            ls.remove('currentNatureName');
            $scope.clearButtonText = 'Clear';
            $scope.isReadOnly = false;

        } else if($route.current.originalPath == '/nature/edit/:id') {

            $scope.nature = ls.get('nature');
            $scope.currentNatureName = ls.get('currentNatureName');
            $scope.isReadOnly = false;
            $scope.clearButtonText = 'Cancel';

            var id = $route.current.params.id;
            natureService.getById(id).then(function(nature) {
                if(nature[0] == undefined) {
                    $location.path('/natures');
                }
            });

        } else if($route.current.originalPath == '/nature/view/:id') {

            $scope.nature = ls.get('nature');
            $scope.currentNatureName = ls.get('currentNatureName');
            $scope.isReadOnly = true;
            $scope.clearButtonText = 'OK';

            var id = $route.current.params.id;
            natureService.getById(id).then(function(nature) {
                if(nature[0] == undefined) {
                    $location.path('/natures');
                }
            });

        } else {

            $scope.nature = null;
            ls.remove('nature');
            $scope.currentNatureName == '';
            ls.remove('currentNatureName');
            $scope.isReadOnly = false;
            $scope.clearButtonText = '';

        }

        var reload = function() {
            natureService.fetch()
                        .then(function(natures) {
                            $scope.natures = natures;
                        });
        }

        reload();

        $scope.create = function() {
            $location.path('/nature/create');            
        }

        $scope.clear = function() {

            var nature = $scope.nature;
            
            $scope.currentNatureName = "";
            ls.remove('currentNatureName');            
            $scope.nature = null;
            ls.remove('nature');

            $scope.isReadOnly = false;

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
            
            if(isReadOnly) {
                $location.path('/nature/view/' + nature._id);
            } else {
                $location.path('/nature/edit/' + nature._id);
            }     
        
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