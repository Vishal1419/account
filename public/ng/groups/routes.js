angular
    .module('groupApp')
    .config(function($routeProvider, $locationProvider) {
        $routeProvider
            .when('/groups', {templateUrl: '/templates/masters/group/group/list.html'})
            .when('/group/create', {templateUrl: '/templates/masters/group/group/create.html'})
            .when('/group/edit', {templateUrl: '/templates/masters/group/group/create.html'});
        $locationProvider.html5Mode(true);
    });