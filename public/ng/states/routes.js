angular
    .module('stateApp')
    .config(function($routeProvider, $locationProvider) {
        $routeProvider
            .when('/state', {templateUrl: '/templates/landDivision/state/list.html'})
            .when('/state/create', {templateUrl: '/templates/landDivision/state/create.html'});
        $locationProvider.html5Mode(true);
    });