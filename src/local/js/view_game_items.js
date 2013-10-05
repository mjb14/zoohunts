var viewGameItemsModule = angular.module('viewGameItems', []);

viewGameItemsModule.config(['$routeProvider', '$locationProvider', 
    function ($routeProvider, $locationProvider) {
        
        $routeProvider.when('/view-game-items', {
            templateUrl: 'src/local/views/view-game-items.tpl.html',
            controller: 'ViewGameItemsController'
        });
        
        $routeProvider.when('/view-game-items/:item_id', {
            templateUrl: 'src/local/views/view-game-item.tpl.html',
            controller: 'ViewGameItemsController'
        });
        
    }
]);

viewGameItemsModule.controller('ViewGameItemsController', [
    '$scope', 'Entity', '$q', '$routeParams', 
    function ($scope, Entity, $q, $routeParams) {
 
        
}]);

