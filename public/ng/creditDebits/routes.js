angular
    .module('creditDebitApp')
    .config(function($routeProvider, $locationProvider) {
        $routeProvider
            .when('/creditDebits', {templateUrl: '/templates/general/creditDebit/list.html'})
            .when('/creditDebit/create', {templateUrl: '/templates/general/creditDebit/create.html'})
            .when('/creditDebit/edit/:id', {templateUrl: '/templates/general/creditDebit/create.html'})
            .when('/creditDebit/view/:id', {templateUrl: '/templates/general/creditDebit/create.html'})
            .otherwise('/creditDebits', {templateUrl: '/templates/general/creditDebit/list.html'});
        $locationProvider.html5Mode(true);
    });