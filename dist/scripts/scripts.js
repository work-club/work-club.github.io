"use strict";angular.module("app",["ngRoute"]).config(["$routeProvider","$locationProvider",function(r,e){r.when("/",{templateUrl:"views/main.html",controller:"homeCtrl"}).when("/mvrc",{templateUrl:"views/mvrc.html",controller:"mvrcCtrl"}).otherwise({redirectTo:"/"})}]),angular.module("app").controller("homeCtrl",function(){}),angular.module("app").controller("mvrcCtrl",function(){});