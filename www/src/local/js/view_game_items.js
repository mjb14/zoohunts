var viewGameItemsModule = angular.module('viewGameItems', []);

viewGameItemsModule.config(['$routeProvider', '$locationProvider', 
    function ($routeProvider, $locationProvider) {
                
        $routeProvider.when('/view-game-items/:game_instance_id', {
            templateUrl: 'src/local/views/view-game-items.tpl.html',
            controller: 'ViewGameItemsController'
        });
        
    }
]);

viewGameItemsModule.controller('ViewGameItemsController', [
    '$scope', 'Entity', '$q', '$routeParams', '$location',
    function ($scope, Entity, $q, $routeParams, $location) {
 
        $scope.game_instance = QR.game_instance;
        
        $scope.getPoiClues = function(poi_id) {
            $location.path('/view-game-item/' + poi_id);
        }
        
        $scope.userScore = function() {
            var totalScore = 0;
            angular.forEach( $scope.game_instance.pois, function(v,i) {
                if( v.is_completed ) {
                    totalScore += v.points;
                }
            });
            
            return totalScore;
        }
        
        $scope.isGameCompleted = function() {
            var isCompleted = 1;
            angular.forEach( $scope.game_instance.pois, function(v,i) {
                if( !v.is_completed ) {
                    isCompleted = 0;
                }
            });
            
            return isCompleted;
        }
        
}]);

