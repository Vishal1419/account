angular
    .module('effectApp')
    .controller("effectController", function(Flash, $scope, $http, $location, effectService, localStorageService) {

        var ls = localStorageService;

        //When controller is refreshed, get necessary data back from service

        if($route.current.originalPath == '/effect/create') {
            
            $scope.effect = null;
            ls.remove('effect');
            $scope.currentEffectName == '';
            ls.remove('currentEffectName');
            $scope.clearButtonText = 'Clear';
            $scope.isReadOnly = false;

        } else if($route.current.originalPath == '/effect/edit/:id') {

            $scope.effect = ls.get('effect');
            $scope.currentEffectName = ls.get('currentEffectName');
            $scope.isReadOnly = false;
            $scope.clearButtonText = 'Cancel';

            var id = $route.current.params.id;
            effectService.getById(id).then(function(effect) {
                if(effect[0] == undefined) {
                    $location.path('/effects');
                }
            });

        } else if($route.current.originalPath == '/effect/view/:id') {

            $scope.effect = ls.get('effect');
            $scope.currentEffectName = ls.get('currentEffectName');
            $scope.isReadOnly = true;
            $scope.clearButtonText = 'OK';

            var id = $route.current.params.id;
            effectService.getById(id).then(function(effect) {
                if(effect[0] == undefined) {
                    $location.path('/effects');
                }
            });

        } else {

            $scope.effect = null;
            ls.remove('effect');
            $scope.currentEffectName == '';
            ls.remove('currentEffectName');
            $scope.isReadOnly = false;
            $scope.clearButtonText = '';

        }

        var reload = function() {
            effectService.fetch()
                        .then(function(effects) {
                            $scope.effects = effects;
                        });
        }

        reload();

        $scope.create = function() {
            $location.path('/effect/create');            
        }

        $scope.clear = function() {

            var effect = $scope.effect;
            
            $scope.currentEffectName = "";
            ls.remove('currentEffectName');            
            $scope.effect = null;
            ls.remove('effect');

            $scope.isReadOnly = false;

            if(!(effect == null || effect._id == undefined || effect._id == null)) {
                $location.path('/effects');
            }
        }

        $scope.listEffects = function() {
            $location.path('/effects');
        }

        $scope.editEffect = function(effect, isReadOnly) {

            //Save data to the service because controller will get refreshed while redirecting the page
                
            $scope.currentEffectName = effect.name;
            ls.set('currentEffectName', $scope.currentEffectName);
            $scope.effect = effect;
            ls.set('effect', $scope.effect);
            
            if(isReadOnly) {
                $location.path('/effect/view/' + effect._id);
            } else {
                $location.path('/effect/edit/' + effect._id);
            }     
        
        }

        $scope.submit = function(effect) {
            
            effectService.save(effect, function(response) {

                if(response.status == 400) {
                    Flash.create('danger', response.data.errors[0].msg);
                }
                else {
                    Flash.create('success', response.data.success.msg);
                
                    $scope.effect = null;
                    ls.remove('effect');

                    if(!(effect == null || effect == undefined)) {
                        if(!(effect._id == undefined || effect._id == '')) {
                            $scope.currentEffectName = "";                         
                            ls.remove('currentEffectName');
                            $location.path('/effects');
                        }
                    }

                    if($scope.effectForm) {
                        $scope.effectForm.$setPristine();
                    }

                }

            });

        }

        $scope.deleteEffect = function(effect) {
            effectService.remove(effect, function(response) {
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