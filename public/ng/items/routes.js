angular
    .module('itemApp')
    .config(function($routeProvider, $locationProvider) {
        $routeProvider
            .when('/items', {templateUrl: '/templates/masters/item/list.html'})
            .when('/item/create', {templateUrl: '/templates/masters/item/create.html'})
            .when('/item/edit/:id', {templateUrl: '/templates/masters/item/create.html'})
            .when('/item/view/:id', {templateUrl: '/templates/masters/item/create.html'})
            .otherwise('/items', {templateUrl: '/templates/masters/item/list.html'});
        $locationProvider.html5Mode(true);
    });