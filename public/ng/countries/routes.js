angular
    .module('countryApp')
    .config(function($routeProvider, $locationProvider) {
        $routeProvider
            .when('/country', {templateUrl: '/templates/landDivision/country/list.html'})
            .when('/country/create', {templateUrl: '/templates/landDivision/country/create.html'});
        $locationProvider.html5Mode(true);
    });