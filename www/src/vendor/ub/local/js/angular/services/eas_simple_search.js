/*
        simple search: for a simple search page, simplify common tasks

        EASSimpleSearch.search
        params:
            searchFormData: optional, if not passed in, will look for method named 'searchFormData' on the scope
            searchCallback: optional, can just place a function on scope with name 'searchCallback', or if 
                            you leave off altogether from both params and scope, the scope will just set values for the entity object on the scope
            entity: required, name of entity service
            searchForm: required, name of the form on your page
            scope: $scope
            
        EASSimpleSearch.init
        params:
            search: required, the search method
            scope: $scope
            
        ---------------  example #1: simple case w/o a callback method -----------------------------------------
        
        manageApplicationsModule.controller('ApplicationsListController', [ '$scope', 'EASSearchFormQuery', 'EASSimpleSearch',
            function ($scope, EASSearchFormQuery,  EASSimpleSearch) {

                // search form model
                $scope.searchFormData = {};

                // search method
                $scope.searchApplications = function() {
                    EASSimpleSearch.search({
                        searchForm:     'applications-search-form',
                        entity:         'applications',
                        scope:  $scope
                        });
                }
                
                // init on page load - will perform search if search data is cached
                EASSimpleSearch.init({scope: $scope, search: $scope.searchApplications});
            
                // If we want a clear button on search form
                $scope.resetSearchFormData = function() {
                    $scope.searchFormData = {};
                }
            }
        ]);

        
        --------------- example #2: complex case with a callback --------------------------------------------------
        
        manageApplicationsModule.controller('ApplicationsListController', ['$scope', 'EASSearchFormQuery', 'EASSimpleSearch',
            function ($scope, EASSearchFormQuery,  EASSimpleSearch) {

                // search form model
                $scope.searchFormData = {};

                // callback method (must take results as param)
                $scope.searchCallback = function(results) {
                    $scope.applications_meta = results[0].data;
                    $scope.applications = results[1].data;          
                    $scope.onlyShowingXMessage = EAS.getGlobalMessage('onlyShowingFirstXRecords', [$scope.applications_meta.max_fetch_count]);
                }
                
                // search method
                $scope.searchApplications = function() {
                    EASSimpleSearch.search({
                        searchForm:     'applications-search-form',
                        entity:         'applications',
                        scope:  $scope
                        });
                }
                
                // init on page load - will perform search if search data is cached
                EASSimpleSearch.init({scope: $scope, search: $scope.searchApplications});
            
                // If we want a clear button on search form
                $scope.resetSearchFormData = function() {
                    $scope.searchFormData = {};
                }
            }
        ]);

*/

angular.module('services.easSimpleSearch', []).factory('EASSimpleSearch', ['EASSearchFormQuery', 'EASCache', '$q', 'Entity', 
    function(EASSearchFormQuery, EASCache, $q, Entity ) {

        var service = {

            init: function(params) {
                // check to see if there is cached data, if there is, then fire off the search method
                var cacheData = EASCache.getPageCacheItem();
        
                if( cacheData.hasOwnProperty('searchFormData') ) {
                    params.scope.searchFormData = cacheData.searchFormData;
                    params.search();
                }
            },
        
            search: function(params) {
                
                // scope is required, if not passed in, alert as this is an error
                if( !params.hasOwnProperty('scope') ) { alert('ERROR: [eas_simple_search service] scope not passed in to simple search service');  return; }
                
                // entity is required, if not passed in, alert as this is an error
                if( !params.hasOwnProperty('entity') ) { alert('ERROR: [eas_simple_search service] entity not passed in to simple search service'); return;}
                
                // searchForm is required, if not passed in, alert as this is an error
                if( !params.hasOwnProperty('searchForm') ) { alert('ERROR: [eas_simple_search service] searchForm not passed in to simple search service'); return;}
                
                
                // format the search form data into its proper form
                var searchFormData = {};

                if( params.hasOwnProperty('searchFormData') ) {
                    searchFormData = params.searchFormData;
                } else {
                    searchFormData = params.scope.searchFormData;
                }

                // format our search data so that it is more useful query string
                var searchFormDataFormatted = EASSearchFormQuery.formatSearchQuery( searchFormData, params.searchForm ); 
                
                //cache the search form data
                EASCache.setPageCacheItem({"searchFormData": searchFormData});
                
                //fetch the data
                $q.all([
                    Entity[params.entity + '_meta'].query().$q,
                    Entity[params.entity].query(searchFormDataFormatted).$q
                ]).then(function(results) {
                    // if there is a call back, use it, otherwise assume simple case and just set variables
                    // allow for override in the params
                    if( params.hasOwnProperty('searchCallback') ) {
                        //console.log('using params.searchCallback method');
                        params.searchCallback(results);
                    } else if( params.scope.hasOwnProperty('searchCallback') ) {
                        //console.log('using scope.searchCallback method');
                        params.scope.searchCallback(results);
                    } else {
                        //console.log('setting scope data directly');
                        params.scope[params.entity + '_meta'] = results[0].data;
                        params.scope[params.entity] = results[1].data;
                        params.scope.onlyShowingXMessage = EAS.getGlobalMessage('onlyShowingFirstXRecords', [results[0].data.max_fetch_count]);
                    }
                    
                });
                
            }
            

        };

        return service;

    }
]);
