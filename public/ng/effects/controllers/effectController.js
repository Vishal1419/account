angular
    .module('effectApp')
    .controller("effectController", function(Flash, $scope, $http, $location, effectService) {

        //When controller is refreshed, get necessary data back from service

        $scope.effect = effectService.getEffect();
        $scope.currentEffectName = effectService.getCurrentEffectName();
        $scope.isReadOnly = effectService.getIsReadOnly();
        $scope.clearButtonText = effectService.getClearButtonText();

        var reload = function() {
            effectService.fetch()
                        .then(function(effects) {
                            $scope.effects = effects;
                        });
        }

        reload();

        $scope.create = function() {
            // effectService.store(null, false);
            effectService.changeClearButtonText("Clear");
            $location.path('/effect/create');            
        }

        $scope.clear = function() {
            var effect = $scope.effect;
            $scope.currentEffectName = "";
            effectService.storeCurrentEffectName($scope.currentEffectName);
            $scope.effect = null;
            $scope.isReadOnly = false;
            effectService.store($scope.effect, $scope.isReadOnly);
            if(!(effect == null || effect._id == undefined || effect._id == null)) {
                $location.path('/effect');
            }
        }

        $scope.listEffects = function() {
            $location.path('/effect');
        }

        $scope.editEffect = function(effect, isReadOnly) {

            //Save data to the service because controller will get refreshed while redirecting the page
                
            $scope.currentEffectName = effect.name;
            effectService.storeCurrentEffectName($scope.currentEffectName);
            $scope.effect = effect;
            effectService.store($scope.effect, isReadOnly);
            
            if(isReadOnly) {
                effectService.changeClearButtonText("OK");                            
            } else {
                effectService.changeClearButtonText("Cancel");            
            }
            
            $location.path('/effect/create');
        
        }

        $scope.submit = function(effect) {
            
            effectService.save(effect, function(response) {

                if(response.status == 400) {
                    Flash.create('danger', response.data.errors[0].msg);
                }
                else {
                    Flash.create('success', response.data.success.msg);
                
                    $scope.effect = null;
                    effectService.store($scope.effect, $scope.isReadOnly);
                    if(!(effect == null || effect == undefined)) {
                        if(!(effect._id == undefined || effect._id == '')) {
                            $scope.currentEffectName = "";                         
                            effectService.storeCurrentEffectName($scope.currentEffectName);
                            $location.path('/effect');
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