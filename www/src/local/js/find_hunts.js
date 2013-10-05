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
 
        $scope.available_games = QR.available_games;
        
        // If there are in progress hunts, default to that tab
        var hasInProgressHunt = function(games) {
            var result = 0;
            angular.forEach(games, function(v,i) {
                if( v.start_date && !v.completed ) {
                    result = 1;
                }
            });
            
            return result;
        }
        
        if( hasInProgressHunt($scope.available_games) ) {
            $('#tabs a[href="#in-progress"]').tab('show');
        }
}]);

