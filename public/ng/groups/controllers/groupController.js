angular
    .module('groupApp')
    .controller("groupController", function(Flash, $scope, $http, $location, groupService, localStorageService) {

        var ls = localStorageService;

        //When controller is refreshed, get necessary data back from service

        if($route.current.originalPath == '/group/create') {
            
            $scope.group = null;
            ls.remove('group');
            $scope.currentGroupName == '';
            ls.remove('currentGroupName');
            $scope.clearButtonText = 'Clear';
            $scope.isReadOnly = false;

        } else if($route.current.originalPath == '/group/edit/:id') {

            $scope.group = ls.get('group');
            $scope.currentGroupName = ls.get('currentGroupName');
            $scope.isReadOnly = false;
            $scope.clearButtonText = 'Cancel';

            var id = $route.current.params.id;
            groupService.getById(id).then(function(group) {
                console.log(group);
                if(group[0] == undefined) {
                    $location.path('/groups');
                }
            });

        } else if($route.current.originalPath == '/group/view/:id') {

            $scope.group = ls.get('group');
            $scope.currentGroupName = ls.get('currentGroupName');
            $scope.isReadOnly = true;
            $scope.clearButtonText = 'OK';

            var id = $route.current.params.id;
            groupService.getById(id).then(function(group) {
                console.log(group);
                if(group[0] == undefined) {
                    $location.path('/groups');
                }
            });

        } else {

            $scope.group = null;
            ls.remove('group');
            $scope.currentGroupName == '';
            ls.remove('currentGroupName');
            $scope.isReadOnly = false;
            $scope.clearButtonText = '';

        }

        var reload = function() {
            groupService.fetch()
                        .then(function(groups) {
                            $scope.groups = groups;
                        });
        }

        reload();

        $scope.create = function() {
            $location.path('/group/create');            
        }

        $scope.clear = function() {
            
            var group = $scope.group;
            
            $scope.currentGroupName = '';
            ls.remove('currentGroupName');
            $scope.group = null;
            ls.remove('group');

            $scope.isReadOnly = false;
            
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
            
            if(isReadOnly) {
                $location.path('/group/view/' + group._id);
            } else {
                $location.path('/group/edit/' + group._id);
            }     
        
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

                    if(!(group == null || group == undefined)) {
                        if(!(group._id == undefined || group._id == '')) {
                            $scope.currentGroupName = '';                         
                            ls.remove('currentGroupName');
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