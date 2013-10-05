var loginModule = angular.module('login', []);

loginModule.config(['$routeProvider', '$locationProvider', 
    function ($routeProvider, $locationProvider) {
        $routeProvider.when('/login', {
            templateUrl: 'src/local/views/login.tpl.html',
            controller: 'LoginController'
        });
                
        $routeProvider.when('/manage/applications/edit/:application_id', {
            templateUrl: 'src/local/views/manage-applications-edit.tpl.html',
            controller: 'ApplicationsDataController'
        });
    }
]);

loginModule.controller('LoginController', [
    '$scope', 'Entity', '$q', '$routeParams', 
    function ($scope, Entity, $q, $routeParams) {
 
        
}]);

