
	/*
	1. Create our primary app module
		- Should inject services.appSetup to get the EAS freebies
		- Should inject any app specific app weide filters/services
		- Should inject application main tabs
		
	2. Disable html5Mode so that our URLs have the #/ in them	
	*/

	angular.module('app', [ 'services.appSetup', 'services.crud',  
        'login', 
        'findHunts',
        'viewMyBadges',
        'viewIpHunts',
        'selectHuntCategory',
        'viewGameItems',
        'viewGameItem',
        'viewScoreBoard',
        ]).config(['$locationProvider', function ($locationProvider) {
		$locationProvider.html5Mode(false);
	}]);

	/*
	3. Create our primarty controller
		- Set the AppSetup service to this scope to pull in the freebies
		- Set up any app wide methods
	*/
	angular.module('app').controller('AppCtrl', ['$scope', 'AppSetup', '$window', 'EASLabels', '$location', function($scope, AppSetup, $window, EASLabels, $location) {
		$scope.app = AppSetup;

        $scope.isLoginPage = function() {
            return ( ($location.path() === '/' || $location.path() === '/login') ? 1 : 0 );
        }
        
        
        var appLabels = {
            application_name: 'Application'
        };
        
        EASLabels.setLabels(appLabels);
        
		$scope.testMethod = function(module, value) {
			$scope.app.config().data().nav_access[module] = value;
		}
			
		$scope.checkRoute = function(route, method) {
			return $scope.app.config().hasRouteAccess(route, method);
		}
		
		$scope.hidePage = function(module) {
			$scope.app.config().hide(module);
		}
						
		$scope.showPage = function(module) {
			$scope.app.config().show(module);
		}

		
		// show the message if messing with the browser location bar
		$window.onbeforeunload = function(){
			if($scope.app.pageSaveState().hasUnsavedData()) {
					return EAS.globalMessages.leavingPageText;
			}
		}

		// show message when changing route
		$scope.$on('$locationChangeStart', function(event, next, current) {
			if($scope.app.pageSaveState().hasUnsavedData() && !confirm(EAS.globalMessages.leavingPageText)) {
					event.preventDefault();
			} else {
					$scope.app.pageSaveState().resetAppSavedStatus();
			}
		});


	}]);
	
