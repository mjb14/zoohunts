/*    eas_unsaved_data.js    Service to check for unsaved data on a page.    Each page should have its own method to check its status - it should pass that in via the below as an example:        $scope.app.pageSaveState().setUnsavedDataMethod( $scope.pageHasUnsavedData );*/
angular.module('services.easUnsavedData', []).factory('EASUnsavedData', [
    function() {
        'use strict';
        var data = { // method to return status of a page
            hasUnsavedData: function() {
                return 0;
            }, // our default unsaved method to swap back to
            hasUnsavedDataDefault: function() {
                return 0;
            }
        };
        return { // method to return status of a page
            hasUnsavedData: function() {
                return data.hasUnsavedData();
            }, // method to swap our unsaved method on a page by page basis
            setUnsavedDataMethod: function(method) {
                data.hasUnsavedData = method;
            }, // reset our unsaved method
            resetAppSavedStatus: function() {
                data.hasUnsavedData = data.hasUnsavedDataDefault;
            }
        };
    }
]);
