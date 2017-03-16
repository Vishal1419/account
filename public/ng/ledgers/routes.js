angular
    .module('ledgerApp')
    .config(function($routeProvider, $locationProvider) {
        $routeProvider
            .when('/ledgers', {templateUrl: '/templates/masters/ledger/list.html'})
            .when('/ledger/create', {templateUrl: '/templates/masters/ledger/create.html'})
            .when('/ledger/edit/:id', {templateUrl: '/templates/masters/ledger/create.html'})
            .when('/ledger/view/:id', {templateUrl: '/templates/masters/ledger/create.html'})
            .otherwise('/ledgers', {templateUrl: '/templates/masters/ledger/list.html'});
        $locationProvider.html5Mode(true);
    });