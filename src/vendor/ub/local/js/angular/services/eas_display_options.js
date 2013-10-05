/*
    eas_display_options.js
    
    Get/Set display for the app
    
    Methods:


*/

angular.module('services.easDisplayOptions', []).factory('EASDisplayOptions', ['EASImportantNotes',
    function(EASImportantNotes) {

        var service = {

            _menuOn: 1,

            hasMenu: function() {
                return service._menuOn;
            },

            toggleMenu: function() {
                service._menuOn = service._menuOn ? 0 : 1;
            },

            hasNotes: function() {
                return EASImportantNotes.getGlobalNotes().length || EASImportantNotes.getRouteNotes().length
            }

        };

        return service;

    }
]);
