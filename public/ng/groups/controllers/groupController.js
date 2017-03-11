angular
    .module('groupApp')
    .controller("groupController", function(Flash, $scope, $http, $location, groupService, localStorageService) {

        var ls = localStorageService;

        //When controller is refreshed, get necessary data back from service

        $scope.group = ls.get('group');
        $scope.currentGroupName = ls.get('currentGroupName');
        $scope.isReadOnly = ls.get('isReadOnly');
        $scope.clearButtonText = ls.get('clearButtonText');

        var reload = function() {
            groupService.fetch()
                        .then(function(groups) {
                            $scope.groups = groups;
                        });
        }

        reload();

        $scope.create = function() {
            ls.remove('group');
            ls.set('isReadOnly', false);
            ls.set('clearButtonText', 'Clear');
            $location.path('/group/create');            
        }

        $scope.clear = function() {
            var group = $scope.group;
            $scope.currentGroupName = '';
            ls.remove('currentGroupName');
            $scope.group = null;
            $scope.isReadOnly = false;
            ls.remove('group');
            ls.set('isReadOnly', $scope.isReadOnly);
            if(!(group == null || group._id == undefined || group._id == null)) {
                $location.path('/groups');
            }
        }

        $scope.listGroups = function() {
            $location.path('/groups');
        }

        $scope.editGroup = function(group, isReadOnly) {
                
            $scope.currentGroupName = group.name;
            ls.set('currentGroupName', $scope.currentGroupName);
            $scope.group = group;
            ls.set('group', $scope.group);
            ls.set('isReadOnly', $scope.isReadOnly)
            
            if(isReadOnly) {
                ls.set('clearButtonText', 'OK');
            } else {
                ls.set('clearButtonText', 'Cancel');
            }
            
            $location.path('/group/edit');
        
        }

        $scope.submit = function(group) {
            
            groupService.save(group, function(response) {

                if(response.status == 400) {
                    Flash.create('danger', response.data.errors[0].msg);
                }
                else {
                    Flash.create('success', response.data.success.msg);
                
                    $scope.group = null;
                    ls.remove('group');
                    groupService.store($scope.group, $scope.isReadOnly);
                    if(!(group == null || group == undefined)) {
                        if(!(group._id == undefined || group._id == '')) {
                            $scope.currentGroupName = '';                         
                            ls.set('currentGroupName', $scope.currentGroupName);
                            $location.path('/groups');
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