/*
    Service exists as a means to have field labels that map to database fields.  This will be used to show form error messages with a nice label.  
    
    Each app must define their own labels using this service.
*/

angular.module('services.easLabels', []).factory('EASLabels', [
    function() {

        var labels = {};

        var service = {

            setLabels: function(appLabels) {
                $.extend(true, labels, appLabels);
            },

            getLabel: function(key) {
                return labels[key] ? labels[key] : key;
            }

        };

        return service;

    }
]);
