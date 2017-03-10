angular
    .module('natureApp')
    .config(function($routeProvider, $locationProvider) {
        $routeProvider
            .when('/nature', {templateUrl: '/templates/masters/group/nature/list.html'})
            .when('/nature/create', {templateUrl: '/templates/masters/group/nature/create.html'});
        $locationProvider.html5Mode(true);
    });