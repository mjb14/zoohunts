var selectHuntCategoryModule = angular.module('selectHuntCategory', []);

selectHuntCategoryModule.config(['$routeProvider', '$locationProvider', 
    function ($routeProvider, $locationProvider) {
        $routeProvider.when('/select-hunt-category', {
            templateUrl: 'src/local/views/select-hunt-category.tpl.html',
            controller: 'SelectHuntCategoryController'
        });
    }
]);

selectHuntCategoryModule.controller('SelectHuntCategoryController', [
    '$scope', 'Entity', '$q', '$routeParams', 
    function ($scope, Entity, $q, $routeParams) {
 
        
}]);

