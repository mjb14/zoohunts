angular.module('services.httpRequestTracker', []).factory('httpRequestTracker', ['$http',
    function($http) {
        var httpRequestTracker = {};
        httpRequestTracker.hasPendingRequests = function() {

            // In order to not have the loading bar popup on a typeahead, we need to inspect
            // the url params on the request.  The presence of _suppressloadingbar indicates that the 
            // loading bar shouldn't show.

            var re = /_suppressloadingbar/g;
            var typeaheadUrls = $.grep($http.pendingRequests, function(n, i) {
                return (n.url.search(re) != -1);
            });

            return ($http.pendingRequests.length > 0 && !typeaheadUrls.length);
        };

        return httpRequestTracker;
    }
]);
