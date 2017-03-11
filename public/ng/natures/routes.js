angular
    .module('natureApp')
    .config(function($routeProvider, $locationProvider) {
        $routeProvider
            .when('/natures', {templateUrl: '/templates/masters/group/nature/list.html'})
            .when('/nature/create', {templateUrl: '/templates/masters/group/nature/create.html'})
            .when('/nature/edit/:id', {templateUrl: '/templates/masters/group/nature/create.html'})
            .when('/nature/view/:id', {templateUrl: '/templates/masters/group/nature/create.html'});
        $locationProvider.html5Mode(true);
    });