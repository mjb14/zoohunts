/**
 * This service is a wrapper for other services that make up a general application.  Rather than make users include them individually, this
 * is a wrapper that includes them for ease of use.
 */

/**
 * @module services.appSetup
 */
angular.module('services.appSetup', ['EASServices', 'EASDirectives', 'EASFilters', 'EASValidation']);

/**
 * @factory AppSetup
 * Returns:
 *  AppSetup.config():  EASgrepConfig
 *  AppSetup.authorized(): EASAuthorization.checkAuth()
 *  AppSetup.visible() : EASAuthorization.checkVisible()
 *  AppSetup.navigation(): EASNavigation
 *  AppSetup.pageSaveState(): EASUnsavedData
 *       
 * Global services included not returning methods:
 *  - EASDefaultRouting - default routing that all apps should account for - 403s, 404s, etc
 *  - services.easHttp - overrides all ajax calls so that we can inspect http status codes and act on them 
 */
angular.module('services.appSetup').factory('AppSetup', ['EASDisplayOptions', 'EASCache', 'EASCrud', 'EASImportantNotes', 'EASUnsavedData', 'EASConfig', 'EASAuthorization', 'EASNavigation',
    function(EASDisplayOptions, EASCache, EASCrud, EASImportantNotes, EASUnsavedData, EASConfig, EASAuthorization, EASNavigation) {

        'use strict';

        return {
            config: function() {
                return EASConfig;
            },
            authorized: function() {
                return EASAuthorization.checkAuth();
            },
            visible: function() {
                return EASAuthorization.checkVisible();
            },
            navigation: function() {
                return EASNavigation;
            },
            pageSaveState: function() {
                return EASUnsavedData;
            },
            notes: function() {
                return EASImportantNotes;
            },
            crud: function() {
                return EASCrud;
            },
            cache: function() {
                return EASCache;
            },
            displayOptions: function() {
                return EASDisplayOptions;
            }
        };
    }
]);
