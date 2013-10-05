var findHuntsModule = angular.module('findHunts', []);

findHuntsModule.config(['$routeProvider', '$locationProvider', 
    function ($routeProvider, $locationProvider) {
        $routeProvider.when('/find-hunts', {
            templateUrl: 'src/local/views/find-hunts.tpl.html',
            controller: 'FindHuntsController'
        });
    }
]);

findHuntsModule.controller('FindHuntsController', [
    '$scope', 'Entity', '$q', '$routeParams', 
    function ($scope, Entity, $q, $routeParams) {
 
        
}]);

