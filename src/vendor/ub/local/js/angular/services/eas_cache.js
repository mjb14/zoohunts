/*

*/

angular.module('services.easCache', []).factory('EASCache', ['$location',
    function($location) {

        var cache = {};

        cache.pageCache = {};

        var service = {

            setCacheItem: function(key, value) {
                cache[key] = value;
            },

            getCacheItem: function(key) {
                return cache[key] ? cache[key] : false;
            },

            setPageCacheItem: function(data) {
                if (cache.pageCache.hasOwnProperty($location.path())) {
                    $.extend(true, cache.pageCache[$location.path()], data);
                } else {
                    cache.pageCache[$location.path()] = data;
                }
            },

            getPageCacheItem: function() {
                return cache.pageCache.hasOwnProperty($location.path()) ? cache.pageCache[$location.path()] : {};
            },

            setPageCacheItemExplicit: function(route, data) {
                if (cache.pageCache.hasOwnProperty(route)) {
                    $.extend(true, cache.pageCache[route], data);
                } else {
                    cache.pageCache[route] = data;
                }
            }

        };

        return service;

    }
]);
