angular
    .module('groupApp')
    .controller("groupController", function(Flash, $scope, $http, $location, groupService) {

        //When controller is refreshed, get necessary data back from service

        $scope.group = groupService.getGroup();
        $scope.currentGroupName = groupService.getCurrentGroupName();
        $scope.isReadOnly = groupService.getIsReadOnly();
        $scope.clearButtonText = groupService.getClearButtonText();

        var reload = function() {
            groupService.fetch()
                        .then(function(groups) {
                            $scope.groups = groups;
                        });
        }

        reload();

        $scope.create = function() {
            // groupService.store(null, false);
            groupService.changeClearButtonText("Clear");
            $location.path('/group/create');            
        }

        $scope.clear = function() {
            var group = $scope.group;
            $scope.currentGroupName = '';
            groupService.storeCurrentGroupName($scope.currentGroupName);
            $scope.group = null;
            $scope.isReadOnly = false;
            groupService.store($scope.group, $scope.isReadOnly);
            if(!(group == null || group._id == undefined || group._id == null)) {
                $location.path('/group');
            }
        }

        $scope.listGroups = function() {
            $location.path('/group');
        }

        $scope.editGroup = function(group, isReadOnly) {

            //Save data to the service because controller will get refreshed while redirecting the page
                
            $scope.currentGroupName = group.name;
            groupService.storeCurrentGroupName($scope.currentGroupName);
            $scope.group = group;
            groupService.store($scope.group, isReadOnly);
            
            if(isReadOnly) {
                groupService.changeClearButtonText("OK");                            
            } else {
                groupService.changeClearButtonText("Cancel");            
            }
            
            $location.path('/group/create');
        
        }

        $scope.submit = function(group) {
            
            groupService.save(group, function(response) {

                if(response.status == 400) {
                    Flash.create('danger', response.data.errors[0].msg);
                }
                else {
                    Flash.create('success', response.data.success.msg);
                
                    $scope.group = null;
                    groupService.store($scope.group, $scope.isReadOnly);
                    if(!(group == null || group == undefined)) {
                        if(!(group._id == undefined || group._id == '')) {
                            $scope.currentGroupName = '';                         
                            groupService.storeCurrentGroupName($scope.currentGroupName);
                            $location.path('/group');
                        }
                    }

                    if($scope.groupForm) {
                        $scope.groupForm.$setPristine();
                    }

                }

            });

        }

        $scope.deleteGroup = function(group) {
            groupService.remove(group, function(response) {
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
            var effect = (item.effect == undefined || item.effect == null) ? false : item.effect.name.toLowerCase().indexOf($scope.searchText == undefined ? '' : $scope.searchText.toLowerCase()) != -1;
            var nature = (item.nature == undefined || item.nature == null) ? false : item.nature.name.toLowerCase().indexOf($scope.searchText == undefined ? '' : $scope.searchText.toLowerCase()) != -1;

            if($scope.searchText == undefined || $scope.searchText == '') { return true; }
            else { if(item.name.toLowerCase().indexOf($scope.searchText.toLowerCase()) != -1 || 
                      parent || effect || nature) { return true; }
                 }
            return false;
        }

    });