angular
    .module('effectApp')
    .config(function($routeProvider, $locationProvider) {
        $routeProvider
            .when('/effect', {templateUrl: '/templates/masters/group/effect/list.html'})
            .when('/effect/create', {templateUrl: '/templates/masters/group/effect/create.html'});
        $locationProvider.html5Mode(true);
    });