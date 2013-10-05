/*
    eas_general_config.js
    
    Store general config items to be used in an application

    It is expected that a data strucutre per application be set up prior to this code being included into an app.  That data 
    structure should contain all the project route information.
    
    Public Methods:
        hide(module) - remove a module from the page menu display
        show(module) - show a module in the page menu display
        getAppBaseUrl() - get the applications base URL
        data() - get the Config data 
        path() - path of the current module the user is on in the browser
        currentBaseModule() - the primary module of the where the user is in the browser 
        currentModule() - the current module of where the user is in the browser
        pageTitle() - title of the current module 
        hasPendingRequests() - whether there are any outstanding http requests in progress
        hasRouteAccess(route, httpMethod) - checks to see if user has access to the httpMethod for a given route
    
*/


var configModule = angular.module('services.EASConfig', ['ngResource', 'services.httpRequestTracker']);

configModule.factory('EASConfig', ['$http', '$location', 'httpRequestTracker', 'EASDisplayOptions',
    function($http, $location, httpRequestTracker, EASDisplayOptions) {

        // hard code any static data
        // non static data needs to have primary keys defined to prevent undefined errors

        // In order for the authorization to work, we are adding a dummy item to look for to have authorization NOT fire
        // off until the config has fully loaded
        var projectConfigData = {
            authorizedModules: [],
            modules: [],
            moduleMap: {},
            nav_access: {
                "_ignoreAuthorization": 1
            },
            showSiteButtons: 1,
            showLeftMenu: 1
        };

        // define our config object
        var config = {

            // ---------- Public Methods ------
            hasRouteAccess: function(route, httpMethod) {
                if (projectConfigData.accessible_app_routes.hasOwnProperty(route) &&
                    projectConfigData.accessible_app_routes[route].hasOwnProperty(httpMethod)) {
                    return 1;
                }
                return 0;
            },

            hide: function(module) {
                var item = EAS.findKey(projectConfigData.modules, {
                    "module": module
                });
                item.visible = 0;
            },

            show: function(module) {
                var item = EAS.findKey(projectConfigData.modules, {
                    "module": module
                });
                item.visible = 1;
            },

            getAppBaseUrl: function() {
                return projectConfigData.app_base_url || "";
            },

            data: function() {
                return projectConfigData;
            },

            path: function() {
                return $location.path();
            },

            currentBaseModule: function() {
                //return EAS.findKey( projectConfigData.modules, {"url": $location.path() }).parent;
                return $location.path().split("/")[1];
            },

            currentModule: function() {
                //currentModule = EAS.findKey( projectConfigData.modules, {"url": $location.path() }).module;
                //console.log("current module: " + currentModule);
                //console.log("no module: " + $location.path().split("/")[1]);
                //return currentModule ? currentModule : $location.path().split("/")[1];

                // Lookup is tricky as url for a module doesn't necessarily match the browser url
                //return $location.path().split("/").length > 2 ? $location.path().split("/")[2] : $location.path().split("/")[1];

				var _getCurrentModule = function(url) {
					// we've checked all potential substrings of the path
					// none were found
					// return a space so that any subsequent lookups fail  
					if (url.length == 0) {
						return ' ';
					}

					// try to look up config information for a module with
					// provided url	
					var item = EAS.findKey(projectConfigData.modules, {
						url: url
					});

					// if we found a module, return its name
					if (item.hasOwnProperty('module')) {
						return item.module;
					}

					// otherwise, strip a segment from the end and try again
					return _getCurrentModule(url.substring(0, url.lastIndexOf('/')));
				};

				return _getCurrentModule($location.path());
            },

            pageTitle: function() {
                // If not generic page, return the corresponding title
                return EAS.findKey(projectConfigData.modules, {
                    "module": config.currentModule()
                }).title;
            },

            // Check to see if any pending requests for our spinner display
            hasPendingRequests: function() {
                return httpRequestTracker.hasPendingRequests();
            },


            // --------- Private Methods ---------
            _setPageLayoutDefaults: function() {
                // hide left menu
                if (!projectConfigData.showLeftMenu) {
                    $('body').toggleClass('hide-menu');
                    EASDisplayOptions.toggleMenu();
                }
            },

            // Load any project specific config data into our Config object
            _setApplicationData: function(data) {
                $.extend(true, projectConfigData, data);

                // update screen for any page layout defaults
                config._setPageLayoutDefaults();
            },

      
            // If an item is authorized, but it isn't found in the module tree, then remove it.
            // This would catch child pages if the parent was turned off
            _removeInvalidAuthorized: function() {
                return; // comment out for now
                console.log("remove invalid...");
                var fullModList = [];
                fullModList.push(v.module);
                $.each(config.data().modules, function(i, v) {
                    if (v.hasOwnProperty('children')) {
                        $.each(v.children, function(y, child) {
                            fullModList.push(child.module);
                        });
                    }
                });

                var authMods = $.grep(config.data().authorizedModules, function(n, i) {
                    return $.inArray(n, fullModList) > -1;
                });

                projectConfigData.authorizedModules = authMods;
            },

            // loop over our structure and delete any key that the user isn't authorized to view
            _removeUnauthorized: function() {
                    return; // comment out for now
                // 1. remove any primary navigations
                var primaryNavModules = $.grep(config.data().modules, function(n, i) {
                    return (config.data().nav_access.hasOwnProperty(n.module) && config.data().nav_access[n.module]);
                });

                projectConfigData.modules = primaryNavModules;

                // 2. remove secondary navigations
                $.each(config.data().modules, function(i, v) {
                    if (v.hasOwnProperty('children')) {
                        var children = $.grep(v.children, function(n, i) {
                            return (config.data().nav_access.hasOwnProperty(n.module) && config.data().nav_access[n.module]);
                        });
                        // If no children, remove the hash key
                        if (children.length) {
                            v.children = children;
                        } else {
                            delete v.children;
                            // delete isn't efficient, perhaps just set to []?
                        }
                    }
                });
            },

            // grab our non server specified config data
            _setServerConfig: function() {
                // Server config no longer coming from server, but being generated right into the homepage template
                // as JS variable EAS.SERVER_CONFIG_DATA
                $.extend(true, projectConfigData, EAS.SERVER_CONFIG_DATA);

                // All our generic modules need to be added to the config data module list.  This way
                // our methods for getting page title and things of that nature will work on generic pieces.
                projectConfigData.modules.push({
                    "visible": 0,
                    "url": "/not-authorized",
                    "title": "Not Authorized",
                    "module": "not-authorized"
                });
                projectConfigData.modules.push({
                    "visible": 0,
                    "url": "/not-accessible",
                    "title": "Not Available",
                    "module": "not-accessible"
                });
                projectConfigData.modules.push({
                    "visible": 0,
                    "url": "/403",
                    "title": "Not Authorized",
                    "module": "403"
                });
                projectConfigData.modules.push({
                    "visible": 0,
                    "url": "/404",
                    "title": "Not Found",
                    "module": "404"
                });
                
                    
                
                // Handle any post loading of config steps
                config._postConfigLoadSteps();

                /*
            $http({method: 'GET', url: 'config'}).
                success(function(data, status) {
                    $.extend(true, projectConfigData, data);

                    // Handle any post loading of config steps
                    config._postConfigLoadSteps();
                }).
                error(function(data, status) {
                    // handle error...
                });    
            */

                // Add on the route prefix
                EAS.SERVER_CONFIG_DATA.route_prefix = '';
                if (!EAS.SERVER_CONFIG_DATA.app_base_url.match('acsdev')) {
                    EAS.SERVER_CONFIG_DATA.route_prefix = EAS.APPLICATION_DATA.applicationName + '/';
                }
            },

            // after the config data is fully loaded, we need to sanitize it and set up
            // some mapping for easier data access
            _postConfigLoadSteps: function() {

                // Add "/" by default as well as any other modules to allow authorization
                projectConfigData.nav_access["not-authorized"] = 1;
                projectConfigData.nav_access["not-available"] = 1;
                projectConfigData.nav_access["not-accessible"] = 1;
                projectConfigData.nav_access["404"] = 1;
                projectConfigData.nav_access[""] = 1;



                // Remove unauthorized modules
                config._removeUnauthorized();

                // Remove any invalid authorized items
                //config._removeInvalidAuthorized();

                // Build our module map
                //config._buildModuleMap();

                // remove our freebie skip of authorization
                projectConfigData.nav_access._ignoreAuthorization = 0;

            }

        };

        // Load the app specific config
        config._setApplicationData(EAS.APPLICATION_DATA);

        // Load the app config from server
        config._setServerConfig();

        return config;

    }
]);
