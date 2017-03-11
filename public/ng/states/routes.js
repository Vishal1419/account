angular
    .module('stateApp')
    .config(function($routeProvider, $locationProvider) {
        $routeProvider
            .when('/states', {templateUrl: '/templates/landDivision/state/list.html'})
            .when('/state/create', {templateUrl: '/templates/landDivision/state/create.html'})
            .when('/state/edit/:id', {templateUrl: '/templates/landDivision/state/create.html'})
            .when('/state/view/:id', {templateUrl: '/templates/landDivision/state/create.html'})
            .otherwise('/states', {templateUrl: '/templates/landDivision/state/list.html'});
        $locationProvider.html5Mode(true);
    });