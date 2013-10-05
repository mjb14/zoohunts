/*
    eas_default_routing.js
    
    Default routes thata all applications have out of the gate, these should cover all possible status codes
    that we are currently inspecting for
        - 403 - forbidden
        - 404 - not found
            
*/


var easDefaultRoutingModule = angular.module('EASDefaultRouting', []);

easDefaultRoutingModule.config(['$routeProvider', '$locationProvider',
    function($routeProvider, $locationProvider) {
        $routeProvider.when('/not-authorized', {
            templateUrl: 'src/local/views/403.tpl.html'
        });
        $routeProvider.when('/not-accessible', {
            templateUrl: 'src/local/views/not-accessible.tpl.html'
        });
        $routeProvider.when('/404', {
            templateUrl: 'src/local/views/404.tpl.html'
        });
        $routeProvider.when('/', {
            templateUrl: 'src/local/views/welcome.tpl.html'
        });
        $routeProvider.when('/not-available', {
            templateUrl: 'src/local/views/not-available.tpl.html',
            conroller: 'serviceUnavailable'
        });

        $routeProvider.otherwise({
            redirectTo: '/404'
        });

        //$locationProvider.html5Mode(false);

    }
]);

easDefaultRoutingModule.controller('serviceUnavailable', ['$scope', '$http',
    function($scope, $http) {

        // In order to get the service avail hours and info, make a secondary hit to server
        $http({
            method: 'GET',
            url: $scope.app.config().getAppBaseUrl() + '/?format=json'
        })
            .success(function(data, status, headers, config) {
                console.log("success for service avail");
                $scope.message = data;
            }).error(function(data, status, headers, config) {
                $scope.message = data;
            });

    }
]);
