angular
    .module('effectApp')
    .controller("effectController", function(Flash, $scope, $http, $location, effectService, localStorageService) {

        var ls = localStorageService;

        //When controller is refreshed, get necessary data back from service

        $scope.effect = ls.get('effect');
        $scope.currentEffectName = ls.get('currentEffectName');
        $scope.isReadOnly = ls.get('isReadOnly');
        $scope.clearButtonText = ls.get('clearButtonText');

        var reload = function() {
            effectService.fetch()
                        .then(function(effects) {
                            $scope.effects = effects;
                        });
        }

        reload();

        $scope.create = function() {
            ls.remove('effect');
            ls.set('isReadOnly', false);
            ls.set('clearButtonText', 'Clear');
            $location.path('/effect/create');            
        }

        $scope.clear = function() {
            var effect = $scope.effect;
            $scope.currentEffectName = "";
            ls.remove('currentEffectName');
            $scope.effect = null;
            ls.remove('effect');
            $scope.isReadOnly = false;
            ls.set('isReadOnly', $scope.isReadOnly);
            if(!(effect == null || effect._id == undefined || effect._id == null)) {
                $location.path('/effects');
            }
        }

        $scope.listEffects = function() {
            $location.path('/effects');
        }

        $scope.editEffect = function(effect, isReadOnly) {

            $scope.currentEffectName = effect.name;
            ls.set('currentEffectName', $scope.currentEffectName);
            $scope.effect = effect;
            ls.set('effect', $scope.effect);
            ls.set('isReadOnly', isReadOnly);
            
            if(isReadOnly) {
                ls.set('clearButtonText', 'OK');
            } else {
                ls.set('clearButtonText', 'Cancel');
            }
            
            $location.path('/effect/edit');
        
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
                    ls.set('isReadOnly', $scope.isReadOnly);
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