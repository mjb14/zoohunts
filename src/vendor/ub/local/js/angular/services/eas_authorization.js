/*
    eas_authorization.js
    
    Determine if a request 1) authorized, and 2) should be visible
    
    A request could be authorized, but should not be visible based on business rules.  If a request is not authorized
    the request gets kicked to #/not-authorized.  
    
    TO DO - decide what to do when a request is made on something that shouldn't be visible (perhaps from bookmark, back button, etc)

*/

angular.module('services.EASAuthorization', ['services.EASConfig']).factory('EASAuthorization', ['$route', '$location', 'EASConfig',
    function($route, $location, Config) {
        'use strict';

        return {
            checkAuth: function() {

                return 1;
            
                var isAuthorized = Config.data().nav_access.hasOwnProperty(Config.currentModule()) && Config.data().nav_access[Config.currentModule()] ? 1 : 0,
                    ignoreAuthorization = Config.data().nav_access._ignoreAuthorization;

                // 1. See if module is authorized
                // 2. Make sure our auth array has data, as if it hasn't been inited yet, we don't want to do the re-direct
                // 3. Make sure that the route exists, otherwise let this fall through and it'll redirect automatically to a 404
                //if( !isAuthorized && Config.data().authorizedModules.length && $route.routes.hasOwnProperty(Config.path()) ) { 
                if (!isAuthorized && !ignoreAuthorization) {
                    //console.log("Access denied for module: " + Config.currentModule() );
                    $location.path('not-authorized');
                }

                return isAuthorized;
            },

            // Check to see if module is visible, if not, they shouldn't be hitting this page.  This is different than
            // not authorized, as they are technically allowed to hit it, but for business rules reasons, we do not want
            // them to hit it.  This is to prevent a back button click and stumble upon page type of behavior.
            checkVisible: function() {

                return 1;
            
                var isVisible = 1, // default to 1, so we can just check for not visible to act, else we'll have many false positives
                    currentModule = Config.currentModule(),
                    item;
                if (currentModule !== 'not-accessible' && currentModule !== 'not-authorized' && currentModule !== 'not-available' && currentModule !== '404' && currentModule !== '') {
                    item = EAS.findKey(Config.data().modules, {
                        "module": Config.currentModule()
                    });
                    isVisible = item.visible;
                }

                if (!isVisible) {
                    //console.log("A page has been hit that should not be visible.  Place a redirect here. " + "[" + Config.currentModule() +  "]");
                    $location.path('not-accessible');
                }

                return isVisible;
            }
        };

    }
]);
