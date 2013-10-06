var selectHuntCategoryModule = angular.module('selectHuntCategory', []);

selectHuntCategoryModule.config(['$routeProvider', '$locationProvider', 
    function ($routeProvider, $locationProvider) {
        $routeProvider.when('/select-hunt-category/:game_instance_id', {
            templateUrl: 'src/local/views/select-hunt-category.tpl.html',
            controller: 'SelectHuntCategoryController'
        });
    }
]);

selectHuntCategoryModule.controller('SelectHuntCategoryController', [
    '$scope', 'Entity', '$q', '$routeParams', '$location',
    function ($scope, Entity, $q, $routeParams, $location) {
 
    $scope.game_categories = QR.game_categories;
    
        
}]);

