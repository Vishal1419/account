angular
    .module('unitApp')
    .config(function($routeProvider, $locationProvider) {
        $routeProvider
            .when('/units', {templateUrl: '/templates/masters/unit/unit/list.html'})
            .when('/unit/create', {templateUrl: '/templates/masters/unit/unit/create.html'})
            .when('/unit/edit/:id', {templateUrl: '/templates/masters/unit/unit/create.html'})
            .when('/unit/view/:id', {templateUrl: '/templates/masters/unit/unit/create.html'});
        $locationProvider.html5Mode(true);
    });