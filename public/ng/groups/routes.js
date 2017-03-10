angular
    .module('groupApp')
    .config(function($routeProvider, $locationProvider) {
        $routeProvider
            .when('/group', {templateUrl: '/templates/masters/group/group/list.html'})
            .when('/group/create', {templateUrl: '/templates/masters/group/group/create.html'});
        $locationProvider.html5Mode(true);
    });