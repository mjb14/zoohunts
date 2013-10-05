/*
    eas_important_notes.js
    
    Get/Set important notes for the application
    
    Methods:
        setGlobalNotes(notesArray): set global application notes
        getGLobalNotes(): get global application notes
        
        setRouteNotes(notesArray): set route application notes
        getRouteNotes(): get route application notes
        setRouteNotesExplicit(route, notesArray): set the route notes from outside the current route for a different route

*/

angular.module('services.easImportantNotes', []).factory('EASImportantNotes', ['$location',
    function($location) {
        var globalNotes = [];
        var routeNotes = {};

        var service = {

            setGlobalNotes: function(notesArray) {
                globalNotes = notesArray;
            },

            getGlobalNotes: function() {
                return globalNotes;
            },

            setRouteNotes: function(notesArray) {
                routeNotes[$location.path()] = notesArray;
            },

            getRouteNotes: function() {
                return routeNotes.hasOwnProperty($location.path()) ? routeNotes[$location.path()] : [];
            },

            setRouteNotesExplicit: function(route, notesArray) {
                routeNotes[route] = notesArray;
            }

        };

        return service;

    }
]);
