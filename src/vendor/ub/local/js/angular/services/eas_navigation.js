/*
    eas_navigation.js
    
    Methods:
        get2LevelNavigation - build a 2 level left menu
        isPrimaryNavActive - check to see if a given module is the active module
*/

angular.module('services.easNavigation', ['services.EASConfig']).factory('EASNavigation', ['EASConfig', '$location',
    function(Config, $location) {

        var service = {

            // Default the active tab to the current base module
            // This gets things looking properly on a deep link or page refresh
            activeNav: Config.currentBaseModule(),

            getCurrentObject: function() {
                return EAS.findKey(Config.data().modules, {
                    "url": $location.path()
                });
            },

            toggleMenu: function() {
                //$(".navbar-collapse").collapse('hide');
                $('.row-offcanvas').toggleClass('active');
            },
            
            getCurrentModule: function() {
                var currentModule = service.getCurrentObject().module;
                return currentModule ? currentModule : 0;
            },

            getCurrentParent: function() {
                var currentParent = service.getCurrentObject().parent;
                return currentParent ? currentParent : 0;
            },

            isNavigationActive: function(module) {
                return module == service.getCurrentModule() ? 1 : 0;
            },

            getCurrentBaseModule: function() {
                return service.getCurrentParent() ? service.getCurrentParent() : service.getCurrentModule();
            },

            getModule: function(m) {
                return EAS.findKey(Config.data().modules, {
                    "module": m
                });
            },

            getModuleUrl: function(m) {
                return EAS.findKey(Config.data().modules, {
                    "module": m
                }).url;
            },

            getModuleParent: function(m) {
                var module = service.getModule(m);
                return module.hasOwnProperty('parent') ? module.parent : 0;
            },

            isLevel0Module: function(m) {
                // If no parent, then its level 0
                return !service.getModuleParent(m);
            },

            moduleHasChildren: function(m) {
                var module = service.getModule(m);
                return module.hasOwnProperty('children') ? 1 : 0;
            },

            moduleHasParent: function(m) {
                var module = service.getModule(m);
                if (module.hasOwnProperty('parent') && module.parent) {
                    return 1;
                }
                return 0;
            },

            setActiveNav: function(module) {
                service.activeNav = module;
            },

            getActiveNav: function() {
                return service.activeNav;
            },

            expandNavigationItem: function(module) {
                if (service.getActiveNav() == module) {
                    return 1;
                }

                return 0;
            },

            handleNavigationClick: function(module) {

                //console.log("handle nav click for: " + module);

                // If no children, load item
                if (!service.moduleHasChildren(module)) {
                    //console.log("go to location for module w/o children: " + module);
                      //$(".navbar-collapse").collapse('hide');
                      $('.row-offcanvas').toggleClass('active');
                    $location.path(service.getModuleUrl(module));
                    return;
                }

                // If item has a parent, load item
                if (service.moduleHasParent(module)) {
                    //console.log("go to location since i have a parent: " + module);
                      //$(".navbar-collapse").collapse('hide');
                      $('.row-offcanvas').toggleClass('active');
                    $location.path(service.getModuleUrl(module));
                    return;
                }

                // If item has children, toggle their display
                if (service.getActiveNav() == module) {
                    service.setActiveNav("");
                } else {
                    service.setActiveNav(module);
                }

            },


            isChildNavigationActive: function(module) {
                var currentModule = EAS.findKey(Config.data().modules, {
                    "url": $location.path()
                });

                console.log("current parent: " + currentModule.parent + " - " + currentModule.module + " - " + module);

                if (currentModule.hasOwnProperty('parent')) {
                    return currentModule.parent == module;
                }
                return 0;
            },

            isPrimaryNavActive: function(module) {
                if (module == service.getCurrentModule()) {
                    return 1;
                }
                return 0;
            },

            handleMainTabClick: function(item) {

                if (service.getCurrentModule() == item.module) {
                    // toggle it
                    activeTab = -1;
                } else {

                    activeTab = item.parent;

                    //console.log("[" + item.module + "] [" + item.parent + "]");

                    if (item.parent == item.module) {
                        if (item.hasOwnProperty('children') && item.children.length) {
                            // If doesn't have children, load the page, else toggle the menu
                            // $('#collapse' + item.module).collapse('toggle');
                        } else {
                            // Go to the location
                            $location.path(item.url);
                        }
                    } else {
                        $location.path(item.url);
                    }
                }
            },

            get2LevelNavigation: function() {
                // flatten first 2 levels into an array as we need to loop over <li> tag
                var menuItems = [];

                var divider = {
                    'menuDividerRow': 1,
                    module: 'module',
                    title: 'title',
                    children: []
                };


                moduleData = $.grep(Config.data().modules, function(n, i) {
                    return (n.visible);
                });

                $.each(moduleData, function(i, v) {
                    //v.level0 = 1;
                    //v.parent = v.module;
                    menuItems.push(v);

                    if (v.hasOwnProperty('children')) {
                        $.each(v.children, function(j, child) {
                            if (child.visible) {
                                //child.parent = v.module;
                                menuItems.push(child)
                            };
                        });
                    } else {

                    }
                });

                return menuItems;
            },

            goToLocation: function(url) {
                $location.path(url);
            },

            goTo: function(location, id) {
                id = id || "";
                $location.path(location + id);
            },

            setMenuItemBadge: function(module, badge) {
                var item = EAS.findKey(Config.data().modules, {
                    "module": module
                });
                item.badge = badge;
            },

            getMenuItemBadge: function(module) {
                var item = EAS.findKey(Config.data().modules, {
                    "module": module
                });
                return item.badge ? item.badge : 0;
            }


        };

        return service;

    }
]);
