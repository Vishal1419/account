angular
    .module('groupApp')
    .config(function($routeProvider, $locationProvider) {
        $routeProvider
            .when('/groups', {templateUrl: '/templates/masters/group/group/list.html'})
            .when('/group/create', {templateUrl: '/templates/masters/group/group/create.html'})
            .when('/group/edit/:id', {templateUrl: '/templates/masters/group/group/create.html'})
            .when('/group/view/:id', {templateUrl: '/templates/masters/group/group/create.html'})
            .when('/stockgroups', {templateUrl: '/templates/masters/group/group/list.html'})
            .when('/stockgroup/create', {templateUrl: '/templates/masters/group/group/create.html'})
            .when('/stockgroup/edit/:id', {templateUrl: '/templates/masters/group/group/create.html'})
            .when('/stockgroup/view/:id', {templateUrl: '/templates/masters/group/group/create.html'});
        $locationProvider.html5Mode(true);
    });