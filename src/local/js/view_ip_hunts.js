var viewIpHuntsModule = angular.module('viewIpHunts', []);

viewMyBadgesModule.config(['$routeProvider', '$locationProvider', 
    function ($routeProvider, $locationProvider) {
        $routeProvider.when('/view-ip-hunts', {
            templateUrl: 'src/local/views/view-ip-hunts.tpl.html',
            controller: 'ViewIpHuntsController'
        });
    }
]);

viewMyBadgesModule.controller('ViewIpHuntsController', [
    '$scope', 'Entity', '$q', '$routeParams', 
    function ($scope, Entity, $q, $routeParams) {
 
        
}]);

