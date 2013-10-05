var viewMyBadgesModule = angular.module('viewMyBadges', []);

viewMyBadgesModule.config(['$routeProvider', '$locationProvider', 
    function ($routeProvider, $locationProvider) {
        $routeProvider.when('/view-my-badges', {
            templateUrl: 'src/local/views/view-my-badges.tpl.html',
            controller: 'ViewMyBadgesController'
        });
    }
]);

viewMyBadgesModule.controller('ViewMyBadgesController', [
    '$scope', 'Entity', '$q', '$routeParams', 
    function ($scope, Entity, $q, $routeParams) {
 
        
}]);

