'use strict';

/**
 * @ngdoc overview
 * @name neurofenApp
 * @description
 * # neurofenApp
 *
 * Main module of the application.
 */
angular.module('app', ['ngRoute'])
    .config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {


        $routeProvider
            .when("/", {
                templateUrl: 'views/main.html',
                controller: 'homeCtrl'
            })
            .when("/mvrc", {
                templateUrl: 'views/mvrc.html',
                controller: 'mvrcCtrl'
            })
            .otherwise({
                redirectTo: '/'
            });

        //$locationProvider.html5Mode(true);
  }]);
