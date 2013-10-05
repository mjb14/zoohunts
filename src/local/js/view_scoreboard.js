var viewScoreBoardModule = angular.module('viewScoreBoard', []);

viewScoreBoardModule.config(['$routeProvider', '$locationProvider', 
    function ($routeProvider, $locationProvider) {
        $routeProvider.when('/view-score-board', {
            templateUrl: 'src/local/views/view-score-board.tpl.html',
            controller: 'ViewScoreBoardController'
        });
    }
]);

viewScoreBoardModule.controller('ViewScoreBoardController', [
    '$scope', 'Entity', '$q', '$routeParams', 
    function ($scope, Entity, $q, $routeParams) {
 
        
}]);

