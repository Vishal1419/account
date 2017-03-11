angular
    .module('countryApp')
    .config(function($routeProvider, $locationProvider) {
        $routeProvider
            .when('/countries', {templateUrl: '/templates/landDivision/country/list.html'})
            .when('/country/create', {templateUrl: '/templates/landDivision/country/create.html'})
            .when('/country/edit/:id', {templateUrl: '/templates/landDivision/country/create.html'})
            .when('/country/view/:id', {templateUrl: '/templates/landDivision/country/create.html'})
            .otherwise('/countries', {templateUrl: '/templates/landDivision/country/list.html'});
        $locationProvider.html5Mode(true);
    });