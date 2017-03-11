angular
    .module('stateApp')
    .config(function($routeProvider, $locationProvider) {
        $routeProvider
            .when('/states', {templateUrl: '/templates/landDivision/state/list.html'})
            .when('/state/create', {templateUrl: '/templates/landDivision/state/create.html'})
            .when('/state/edit', {templateUrl: '/templates/landDivision/state/create.html'});
        $locationProvider.html5Mode(true);
    });