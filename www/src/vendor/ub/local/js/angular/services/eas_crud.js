var EAS = EAS || {};
EAS.crud = EAS.crud || angular.module('services.crud', ['ngResource']);

EAS.crud.factory('EASCrud', ['$location', 'Entity', 'EASLabels',
    function($location, Entity, EASLabels) {
        'use strict';

        var service = {

            /* ------------------------------- start: crudSave -----------------------------------
         Used to invoke a PUT or POST on a service.  It is expected that an item being passed
         in to the service to be acted on has a parameter of _crudAction.  This will default to
         a PUT if it is not provided.  Allowable values are: 'PUT' or 'POST' where PUT = update
         and POST = add new.
         
         $scope is required to be passed into the service. Example usage:
            $scope.app.crud().crudSave($scope, {});
         
         Additional parameters:
            entity:     The entity to which the crud action should be performed on
            item:       The item being added, updated, or deleted 
            parent:     The collection the item belongs to - optional
            master:     The master copy of the item - this is a string version as scope will be used to grab the real value
            relatedData:        Data structure of related data, this is a stirng version as scope will be used to grab the real value. 
                                Look at expanded example below to see structure - .data and .entity must be used
            successRedirect:    Upon completion of the crud action, page to redirect to.  
                                Often after an add new, you will jump to the update screen.  This is a method that is passed in that takes
                                item as a parameter.
            pre:    Function to be run as a pre-processor - will pass the item to the post method
            post:   Function to be run as a post-processor - will pass the item to the post method
            meta:   Name of meta service, defaults to entity_meta  
            btnToDisable:   ID of button to disable when request starts and to enable when request ends
            
         
         As a note, all params should be passed in as a single object, ie, this could be called like:
            crudSave($scope, {entity: 'service1', item: 'myItem'})
            
         Expanded Example:

            $scope.app_access_point_master = {};
            $scope.app_access_point = {};
            
            $scope.related_data = {
                access_cntl_groups: {},
                access_cntl_affils: {}
            };
            
            $scope.related_data.access_cntl_groups.data = [];
            $scope.related_data.access_cntl_groups.entity = 'access_cntl_groups';
            $scope.related_data.access_cntl_affils.data = [];
            $scope.related_data.access_cntl_affils.entity = 'access_cntl_affils';

                
            $scope.accessPointRedirect = function(item) {
                return '/manage/access-points/edit/' + item.app_access_point_id;
            }
         
            $scope.saveAccessPoint = function() {
                $scope.app.crud().crudSave($scope, {
                    entity:             'app_access_points',
                    item:               'app_access_point',
                    master:             'app_access_point_master',
                    successRedirect:    $scope.accessPointRedirect,
                    relatedData:        'related_data'
                });
            }         
            
            In HTML, this might be called as:
            <button data-ng-click="saveAccessPoint()" data-ng-class="{'btn-warning': pageHasUnsavedData()}">Save</button>
            
        */

            crudSave: function(params) {

                // Ensure we have some params
                if (!params || typeof params != "object") {
                    alert("crudSave error: params is not defined or not an object");
                    return;
                }

                // Ensure that we have an entity and item as these are required
                if (!params.hasOwnProperty('entity') || !params.hasOwnProperty('item')) {
                    alert("crudSave error: item and entity are required params.");
                    return;
                }

                // Ensure that the entity service has been defined
                if (!Entity.hasOwnProperty(params.entity)) {
                    alert("crudSave error: entity has not been defined: " + params.entity);
                    return;
                }

                // Default our meta service if not provided
                var meta = params.entity + '_meta';
                if (params.hasOwnProperty('meta')) {
                    meta = params.meta;
                };

                // Ensure that a _meta service exists - this is required to determine the columns
                if (!Entity.hasOwnProperty(meta)) {
                    alert("crudSave error: No meta service defined for: " + meta);
                    return;
                }

                // Update item so that it has a flag that it is in an active transaction
                params.item._transaction_in_progress = 1;

                // Set a button as disabled if it was passed in
                if (params.hasOwnProperty('btnToDisable')) {
                    $('#' + params.btnToDisable).attr('disabled', 'disabled');
                };

                // If there is a pre-processor, execute it
                if (params.hasOwnProperty('pre')) {
                    params.pre(params.item)
                };


                // use metadata to get list of keys and list of columns
                var primary_columns,
                    columns;
                Entity[meta].query(function(data) {
                    primary_columns = data.primary_columns;
                    columns = data.columns;

                    // on stand-alone (i.e., not table/list)
                    // edit pages, $scope.item can be undefined
                    // if no fields are provided.
                    // if that's the case, initialize it as an empty
                    // object so it can be run through the column
                    // checks like a regular item
                    params.item = params.item || {
                        '_crudAction': 'POST'
                    };

                    // angular's $resource will encode undefined
                    // parameters as the literal 'undefined' --
                    // this is undesirable, so for each non-key
                    // field which is undefined, set it to the
                    // empty string, which is encoded correctly
                    // and triggers server-side errors as expected
                    // (note: we don't want to reset key columns,
                    // since an undefined key denotes an update
                    // operation. since key fields are in the $resource
                    // url, undefined values are encoded properly
                    // (because google said so))
                    // TODO should we blank undefined key columns too
                    // TODO now that _new attribute determins create/update?
                    for (var i = 0; i < columns.length; i++) {
                        var column = columns[i];
                        if ((params.item[column] === undefined ||
                                params.item[column] === null) &&
                            (primary_columns.indexOf(column) == -1)) {
                            params.item[column] = '';
                        }
                    }

                    //console.log( params.item2 );
                    //return;

                    // If its a new items, _new must be an attribute of the item
                    if (params.item.hasOwnProperty('_crudAction') && params.item._crudAction == 'POST') {
                        Entity[params.entity].create(
                            params.item,
                            function(data) {
                                success(data, collectionCreate, growlCreate);
                            },
                            function(data) {
                                // There is global error handling in place, but also stick all validation messages into
                                // item._serverErrorMessage
                                var message = data.data.message + ': ';
                                angular.forEach(data.data.validation_messages, function(k, v) {
                                    message += EASLabels.getLabel(v) + ': ' + k + ' ';
                                });
                                params.item._serverErrorMessage = message;

                                if (params.hasOwnProperty('btnToDisable')) {
                                    $('#' + params.btnToDisable).removeAttr('disabled');
                                };
                            }
                        );
                        // otherwise, we're updating an existing one
                    } else {
                        Entity[params.entity].update(
                            params.item,
                            function(data) {
                                success(data, collectionUpdate, growlUpdate);
                            },
                            function(data) {
                                //console.log("Error...");
                                var message = data.data.message + ': ';
                                angular.forEach(data.data.validation_messages, function(k, v) {
                                    message += EASLabels.getLabel(v) + ': ' + k + ' ';
                                });
                                params.item._serverErrorMessage = message;

                                if (params.hasOwnProperty('btnToDisable')) {
                                    $('#' + params.btnToDisable).removeAttr('disabled');
                                };
                            }
                        );
                    }

                    // ----------- helper methods for the adds/updates --------------

                    // callback for CRUD success

                    function success(
                        data, collectionCallback, growlCallback) {

                        // get item from the response
                        var item = data.row;
                        angular.copy(item, params.item);

                        // Needs to happen before redirect, else the redirect could cause a prompt about unsaved data
                        // since unsaved data comparisons are against the master
                        if (params.hasOwnProperty('master')) {
                            angular.copy(item, params.master);
                        }

                        if (params.hasOwnProperty('successRedirect')) {
                            $location.path(params.successRedirect(item));
                        }

                        // if there's a collection, update it
                        if (params.hasOwnProperty('parent')) {
                            var collection = params.parent;
                            collectionCallback(collection, item, params.item);
                        }

                        if (params.hasOwnProperty('relatedData')) {
                            for (var relatedEntity in params.relatedData) {
                                if (params.relatedData.hasOwnProperty(relatedEntity)) {
                                    var relatedItems = params.relatedData[relatedEntity].data;
                                    for (var i = 0; i < relatedItems.length; i++) {
                                        var relatedItem = relatedItems[i];
                                        var collection = params.relatedData[relatedEntity].data;
                                        switch (relatedItem._crudAction) {
                                            case 'POST':
                                                createRelatedItem(
                                                    relatedItem, params.relatedData[relatedEntity].entity, collection
                                                );
                                                break;
                                            case 'PUT':
                                                updateRelatedItem(
                                                    relatedItem, params.relatedData[relatedEntity].entity, collection
                                                );
                                                break;
                                            case 'DELETE':
                                                deleteRelatedItem(
                                                    relatedItem, params.relatedData[relatedEntity].entity, collection
                                                );
                                                break;
                                        }
                                    }
                                }
                            }
                        }

                        // throw up a success message
                        growlCallback();

                        // do post-processing
                        if (params.hasOwnProperty('post')) {
                            params.post(params.item);
                        }

                        // update the item with the one from the response
                        // this is by reference so that we maintain
                        // 2-way binding
                        //return item;
                        if (params.hasOwnProperty('btnToDisable')) {
                            $('#' + params.btnToDisable).removeAttr('disabled');
                        };
                    }

                    // callback to update collection when
                    // an item is updated
                    var collectionUpdate = function(collection, newItem, oldItem) {
                        var index = collection.indexOf(oldItem);
                        collection[index] = newItem;
                    };

                    // callback to update collection when
                    // an item is created
                    var collectionCreate = function(collection, item) {
                        collection.unshift(item);
                    };

                    // callback to growl when an item is updated
                    var growlUpdate = function() {
                        $.msgGrowl({
                            type: 'success',
                            title: 'Item Updated',
                            text: 'Item has been updated.'
                        });
                    };

                    // callback to growl when an item is created
                    var growlCreate = function() {
                        $.msgGrowl({
                            type: 'success',
                            title: 'Item Added',
                            text: 'Item has been added.'
                        });
                    };

                    // create a related item and update the collection

                    function createRelatedItem(relatedItem, relatedEntity, collection) {
                        var index;
                        Entity[relatedEntity].create(
                            relatedItem,
                            function(success) {
                                index = collection.indexOf(relatedItem);
                                collection[index] = success.row;
                            },
                            function(failure) {
                                index = collection.indexOf(relatedItem);
                                collection[index]._serverErrorMessage = failure.data.message;
                            }
                        );
                    }

                    // update a related item and update the collection

                    function updateRelatedItem(relatedItem, relatedEntity, collection) {
                        var index;
                        Entity[relatedEntity].update(
                            relatedItem,
                            function(data) {
                                index = collection.indexOf(relatedItem);
                                collection[index] = data.row;
                            },
                            function(failure) {
                                index = collection.indexOf(relatedItem);
                                collection[index]._serverErrorMessage = failure.data.message;
                            }
                        );
                    }

                    // delete a related item and update the collection

                    function deleteRelatedItem(relatedItem, relatedEntity, collection) {
                        var index;
                        Entity[relatedEntity].obliterate(
                            relatedItem,
                            function(data) {
                                index = collection.indexOf(relatedItem);
                                collection.splice(index, 1);
                            },
                            function(failure) {
                                index = collection.indexOf(relatedItem);
                                collection[index]._serverErrorMessage = failure.data.message;
                            }
                        );
                    }
                });
            },


            // ------------------------------- end: crudSave -----------------------------------

            /* ------------------------------- start: crudDelete -----------------------------------
        $scope is required to be passed into the service. Example usage:
            $scope.app.crud().crudDelete({});
         
         Additional parameters:
            entity:     The entity to which the crud action should be performed on
            item:       The item being added, updated, or deleted  
            parent:     The collection the item belongs to - optional
            pre:    Function to be run as a pre-processor
            post:   Function to be run as a post-processor
            meta:   meta service to use for column lookups - will default to entity_meta if not provided
         
         As a note, all params should be passed in as a single object, ie, this could be called like:
            crudDelete({entity: 'service1', item: 'myItem'})
            
         Expanded Example:
        
            // Check for changes across all tabs
            $scope.pageHasUnsavedData = function() {
                return ( $scope.app.crud().itemHasChanged($scope.access_point_function, $scope.access_point_function_master) );
            }
    
            // Set our unsaved method at the global level
            $scope.app.pageSaveState().setUnsavedDataMethod( $scope.pageHasUnsavedData );
        
            $scope.deleteRedirect = function(item) {
                return '/manage/access-point-functions';
            }
        
            $scope.deleteData = function() {
                $scope.app.crud().crudDelete( {
                    entity:             'access_point_functions',
                    item:               $scope.access_point_function,
                    successRedirect:    $scope.deleteRedirect
                });
            }            

            In HTML, this might be called as:
                <button 
                    class           = "btn btn-danger" 
                    data-ng-click   = "deleteData()">
                    <i class="icon-trash"></i> Delete Access Point Function
                </button>
                
            */

            crudDelete: function(params) {
                // Ensure we have some params
                if (!params || typeof params != "object") {
                    alert("crudSave error: params is not defined or not an object");
                    return;
                }

                // Ensure that we have an entity and item as these are required
                if (!params.hasOwnProperty('entity') || !params.hasOwnProperty('item')) {
                    alert("crudSave error: item and entity are required params.");
                    return;
                }

                // Ensure that the entity service has been defined
                if (!Entity.hasOwnProperty(params.entity)) {
                    alert("crudSave error: entity has not been defined: " + params.entity);
                    return;
                }

                // If there is a pre-processor, execute it
                if (params.hasOwnProperty('pre')) {
                    params.pre();
                };

                // Default our meta service if not provided
                var meta = params.entity + '_meta';
                if (params.hasOwnProperty('meta')) {
                    meta = params.meta;
                };

                // Ensure that a _meta service exists - this is required to determine the columns
                if (!Entity.hasOwnProperty(meta)) {
                    alert("crudSave error: No meta service defined for: " + meta);
                    return;
                }


                var primary_columns,
                    columns;

                Entity[meta].query(function(data) {
                    primary_columns = data.primary_columns;
                    columns = data.columns;
                    // angular's $resource will encode undefined
                    // parameters as the literal 'undefined' --
                    // this is undesirable, so for each non-key
                    // field which is undefined, set it to the
                    // empty string, which is encoded correctly
                    // and triggers server-side errors as expected
                    // (note: we don't want to reset key columns,
                    // since an undefined key denotes an update
                    // operation. since key fields are in the $resource
                    // url, undefined values are encoded properly
                    // (because google said so))
                    // TODO should we blank undefined key columns too
                    // TODO now that _new attribute determins create/update?
                    for (var i = 0; i < columns.length; i++) {
                        var column = columns[i];
                        if ((params.item[column] === undefined ||
                                params.item[column] === null) &&
                            (primary_columns.indexOf(column) == -1)) {
                            params.item[column] = '';
                        }
                    }


                    Entity[params.entity].obliterate(
                        params.item,
                        function() {
                            // if the item was successfully deleted,
                            // handle redirect if one was specified
                            // note: observe the attribute in case it contains
                            // an interpolated value 
                            if (params.hasOwnProperty('successRedirect')) {
                                $location.path(params.successRedirect());
                            }

                            // remove it from the parent's collection
                            // can pass collection in as it is or as an object that has a .rows attribute
                            if (params.hasOwnProperty('parent')) {

                                if (params.parent.hasOwnProperty('rows')) {
                                    var index = params.parent.rows.indexOf(params.item);
                                    if (index > -1) {
                                        params.parent.rows.splice(index, 1);
                                    }
                                } else {
                                    var index = params.parent.indexOf(params.item);
                                    if (index > -1) {
                                        params.parent.splice(index, 1);
                                    }
                                }
                            }

                            // throw up a success box
                            $.msgGrowl({
                                type: 'success',
                                title: 'Item Deleted',
                                text: 'Item has been deleted.'
                            });

                            // do post-processing
                            if (params.hasOwnProperty('post')) {
                                params.post();
                            }
                        },
                        function(failure) {
                            params.item._serverErrorMessage = failure.data.message;
                        }
                    );

                });
            },
            /* ------------------------------- end: crudDelete ----------------------------------- */


            goTo: function(location, id) {
                id = id || "";
                $location.path(location + id);
            },

            /* ------------------ deleteSelected ----------------
        This is used to delete rows out of a collection that have a check mark indicating they should be deleted.
        
        TODO: use Entity instead of having user pass in a crudService
        */
            deleteSelected: function(crudService, collection, collectionName, key, meta) {

                var meta = meta || collectionName + '_meta';

                var itemsToDelete = [];
                angular.forEach(collection, function(v, i) {
                    if (v.hasOwnProperty('_toBeDeleted') && v._toBeDeleted) {

                        var deleteKey = {};
                        deleteKey[key] = v[key];
                        if (v.hasOwnProperty('_crudAction') && v._crudAction == 'POST') {
                            var index = collection.indexOf(v);
                            itemsToDelete.push(index);
                        } else {
                            //Entity[collectionName].obliterate(deleteKey,

                            var index = collection.indexOf(v);
                            itemsToDelete.push(index);
                            var primary_columns,
                                columns;

                            Entity[meta].query(function(data) {
                                primary_columns = data.primary_columns;
                                columns = data.columns;
                                // angular's $resource will encode undefined
                                // parameters as the literal 'undefined' --
                                // this is undesirable, so for each non-key
                                // field which is undefined, set it to the
                                // empty string, which is encoded correctly
                                // and triggers server-side errors as expected
                                // (note: we don't want to reset key columns,
                                // since an undefined key denotes an update
                                // operation. since key fields are in the $resource
                                // url, undefined values are encoded properly
                                // (because google said so))
                                // TODO should we blank undefined key columns too
                                // TODO now that _new attribute determins create/update?
                                for (var i = 0; i < columns.length; i++) {
                                    var column = columns[i];
                                    if ((v[column] === undefined ||
                                            v[column] === null) &&
                                        (primary_columns.indexOf(column) == -1)) {
                                        v[column] = '';
                                    }
                                }

                                Entity[collectionName].obliterate(v,
                                    function() {
                                        $.msgGrowl({
                                            type: 'success',
                                            title: 'Item Deleted',
                                            text: 'Item has been deleted.'
                                        });
                                    },
                                    function(data) {
                                        var message = data.data.message + ': ';
                                        angular.forEach(data.data.validation_messages, function(k, v) {
                                            message += k;
                                        });
                                        v._serverErrorMessage = message;
                                        // pop off item to delete since there was an error
                                        itemsToDelete.pop();
                                    });

                            });


                        }

                    }
                });

                // remove items from the actual collection
                // Doing this above would remove the wrong items as the size of the collection would 
                // be changing underneath itself while its being looped over
                itemsToDelete.sort();
                itemsToDelete.reverse();
                angular.forEach(itemsToDelete, function(v, i) {
                    collection.splice(v, 1);
                });


            },


            // Check to see if an item (less the validation message) is same as another
            itemHasChanged: function(item, master) {

                if (item && master) {
                    var itemWithoutMessage = angular.copy(item);
                    itemWithoutMessage._serverErrorMessage = "";
                    master._serverErrorMessage = "";
                    return !angular.equals(itemWithoutMessage, master);
                }

                return 0;
            },

            // Add an empty item to a collection
            addRelatedDataBlankGroup: function(collection, extraKeys) {
                extraKeys = extraKeys || {};
                var emptyGroup = {
                    "_crudAction": "POST" // new items are set to Add by default
                };
                $.extend(true, emptyGroup, extraKeys);
                collection.splice(0, 0, emptyGroup);
            },

            // Flag item for delete in a collection
            deleteRelatedDataItem: function(collection, item) {
                if (item._crudAction === 'POST') {
                    // If item status = POST (Add), then just delete it out of the collection
                    $.each(collection, function(i, v) {
                        if (v === item) {
                            collection.splice(i, 1);
                        }
                    });
                } else {
                    // set our delete indicator on the row
                    item._prevAction = item._crudAction;
                    if (item._crudAction !== 'DELETE') {
                        item._crudAction = 'DELETE';
                    }
                }
            },

            // Cancel the pending delete of an item in a collection
            cancelPendingRelatedDataItemDelete: function(collection, item) {
                $.each(collection, function(i, v) {
                    if (v === item) {
                        v._crudAction = v._prevAction;
                    }
                });
            },

            // Return number of unsaved items in the collection
            collectionHasUnsavedData: function(collection) {
                var unSavedGroups = $.grep(collection, function(n) {
                    return (n._crudAction === 'DELETE' || n._crudAction === 'PUT' || n._crudAction === 'POST');
                });
                return unSavedGroups.length;
            }
        };
        return service;
    }
]);

EAS.crud.directive('easDelete', function() {
    'use strict';
    return {
        restrict: 'A',
        replace: true,
        transclude: true,
        template: '<span ng-click="obliterate()">' + '<span ng-transclude></span>' + '</span>',
        scope: {
            entity: '@',
            item: '=',
            ngClass: '&',
            ngDisabled: '&',
            successRedirect: '@',
            pre: '&',
            post: '&'
        },
        controller: function deleteController($scope, $attrs, $location, Entity) {
            // get ng-class attribute from transcluded element --
            // since it's bound with &, it will be evaluated in parent
            // scope (the scope of where the directive is used)
            $attrs.$set('ngClass', $scope.ngClass);

            $attrs.$set('ngDisabled', $scope.ngDisabled);

            $scope.obliterate = function() {

                if (!$scope.ngDisabled()) {

                    // do pre-processing
                    $scope.pre();

                    Entity[$scope.entity].obliterate(
                        $scope.item,
                        function() {
                            // if the item was successfully deleted,
                            // handle redirect if one was specified
                            // note: observe the attribute in case it contains
                            // an interpolated value 
                            $attrs.$observe('successRedirect', function(value) {
                                $scope.successRedirect = value;
                                $location.path($scope.successRedirect);
                            });

                            // remove it from the parent's collection
                            // (if there is one)
                            var entities = $scope.$parent[$scope.entity];
                            if (entities) {
                                var collection = entities.rows,
                                    index = collection.indexOf($scope.item);
                                collection.splice(index, 1);
                            }

                            // throw up a success box
                            $.msgGrowl({
                                type: 'success',
                                title: 'Item Deleted',
                                text: 'Item has been deleted.'
                            });

                            // do post-processing
                            $scope.post();
                        },
                        function(failure) {
                            $scope.item._serverErrorMessage = failure.data.message;
                        }
                    );
                }
            }
        }
    };
});

EAS.crud.directive('easSave', function() {
    'use strict';
    return {
        restrict: 'A',
        replace: true,
        transclude: true,
        template: '<div ng-transclude ng-click="save()"></div>',
        scope: {
            entity: '@',
            item: '=',
            master: '=',
            relatedData: '=',
            ngClass: '&',
            ngDisabled: '&',
            successRedirect: '@',
            pre: '&',
            post: '&'
        },
        controller: function saveController($scope, $attrs, $location, Entity) {
            var primary_columns,
                columns;

            // get ng-class attribute from transcluded element --
            // since it's bound with &, it will be evaluated in parent
            // scope (the scope of where the directive is used)
            $attrs.$set('ngClass', $scope.ngClass);

            $attrs.$set('ngDisabled', $scope.ngDisabled);

            $scope.save = function() {

                if (!$scope.ngDisabled()) {

                    // do pre-processing
                    $scope.pre();

                    // Verify that the meta service exists
                    if (!Entity.hasOwnProperty($scope.entity + '_meta')) {
                        alert("No meta service defined in the crud.js file for: " + $scope.entity + '_meta');
                    } else {

                        // use metadata to get list of keys and list of columns
                        Entity[$scope.entity + '_meta'].query(function(data) {
                            primary_columns = data.primary_columns;
                            columns = data.columns;

                            // on stand-alone (i.e., not table/list)
                            // edit pages, $scope.item can be undefined
                            // if no fields are provided.
                            // if that's the case, initialize it as an empty
                            // object so it can be run through the column
                            // checks like a regular item
                            $scope.item = $scope.item || {
                                '_new': 1
                            };

                            // angular's $resource will encode undefined
                            // parameters as the literal 'undefined' --
                            // this is undesirable, so for each non-key
                            // field which is undefined, set it to the
                            // empty string, which is encoded correctly
                            // and triggers server-side errors as expected
                            // (note: we don't want to reset key columns,
                            // since an undefined key denotes an update
                            // operation. since key fields are in the $resource
                            // url, undefined values are encoded properly
                            // (because google said so))
                            // TODO should we blank undefined key columns too
                            // TODO now that _new attribute determins create/update?
                            for (var i = 0; i < columns.length; i++) {
                                var column = columns[i];
                                if (($scope.item[column] === undefined ||
                                        $scope.item[column] === null) &&
                                    (primary_columns.indexOf(column) == -1)) {
                                    $scope.item[column] = '';
                                }
                            }

                            // If its a new items, _new must be an attribute of the item
                            if ($scope.item.hasOwnProperty('_new')) {
                                Entity[$scope.entity].create(
                                    $scope.item,
                                    function(data) {
                                        success(
                                            data, collectionCreate, growlCreate
                                        );
                                    }
                                );

                                // otherwise, we're updating an existing one
                            } else {
                                Entity[$scope.entity].update(
                                    $scope.item,
                                    function(data) {
                                        success(
                                            data, collectionUpdate, growlUpdate
                                        );
                                    }
                                );
                            }

                            // callback for CRUD success

                            function success(
                                data, collectionCallback, growlCallback) {

                                // handle redirect if one was specified
                                // note: observe the attribute in case it contains
                                // an interpolated value 
                                $attrs.$observe('successRedirect', function(value) {
                                    $scope.successRedirect = value;
                                    $location.path($scope.successRedirect);
                                });

                                // get item from the response
                                var item = data.row;

                                // if there's a collection, update it
                                var entities = $scope.$parent[$scope.entity];
                                if (entities) {
                                    var collection = entities.rows;
                                    collectionCallback(collection, item, $scope.item);
                                }

                                // update the item with the one from the response
                                // this is by reference so that we maintain
                                // 2-way binding
                                $scope.item = item;

                                // update the master with the one from the response
                                // this is by value because:
                                // 1. no 2-way binding to worry about
                                // 2. when a modal add/edit form closes,
                                //    it tries to reset the form data to the
                                //    original value (master) using angular.copy;
                                //    if the form data (bound to $scope.item)
                                //    is the same object as the master
                                //    (which would happen if master was assigned
                                //    by reference here), angular.copy fails,
                                //    since it won't copy an item to itself
                                $scope.master = angular.copy(item);

                                // handle related data
                                for (var relatedEntity in $scope.relatedData) {
                                    if ($scope.relatedData.hasOwnProperty(relatedEntity)) {
                                        var relatedItems = $scope.relatedData[relatedEntity];
                                        for (var i = 0; i < relatedItems.length; i++) {
                                            var relatedItem = relatedItems[i];
                                            var collection = $scope.relatedData[relatedEntity];
                                            switch (relatedItem._action) {
                                                case 'POST':
                                                    createRelatedItem(
                                                        relatedItem, relatedEntity, collection
                                                    );
                                                    break;
                                                case 'PUT':
                                                    updateRelatedItem(
                                                        relatedItem, relatedEntity, collection
                                                    );
                                                    break;
                                                case 'DELETE':
                                                    deleteRelatedItem(
                                                        relatedItem, relatedEntity, collection
                                                    );
                                                    break;
                                            }
                                        }
                                    }
                                }

                                // throw up a success message
                                growlCallback();

                                // do post-processing
                                $scope.post();
                            }

                            // callback to update collection when
                            // an item is updated
                            var collectionUpdate = function(collection, newItem, oldItem) {
                                var index = collection.indexOf(oldItem);
                                collection[index] = newItem;
                            };

                            // callback to update collection when
                            // an item is created
                            var collectionCreate = function(collection, item) {
                                collection.push(item);
                            };

                            // callback to growl when an item is updated
                            var growlUpdate = function() {
                                $.msgGrowl({
                                    type: 'success',
                                    title: 'Item Updated',
                                    text: 'Item has been updated.'
                                });
                            };

                            // callback to growl when an item is created
                            var growlCreate = function() {
                                $.msgGrowl({
                                    type: 'success',
                                    title: 'Item Added',
                                    text: 'Item has been added.'
                                });
                            };

                            // create a related item and update the collection

                            function createRelatedItem(relatedItem, relatedEntity, collection) {
                                var index;
                                Entity[relatedEntity].create(
                                    relatedItem,
                                    function(success) {
                                        index = collection.indexOf(relatedItem);
                                        collection[index] = success.row;
                                    },
                                    function(failure) {
                                        index = collection.indexOf(relatedItem);
                                        collection[index]._serverErrorMessage = failure.data.message;
                                    }
                                );
                            }

                            // update a related item and update the collection

                            function updateRelatedItem(relatedItem, relatedEntity, collection) {
                                var index;
                                Entity[relatedEntity].update(
                                    relatedItem,
                                    function(data) {
                                        index = collection.indexOf(relatedItem);
                                        collection[index] = data.row;
                                    },
                                    function(failure) {
                                        index = collection.indexOf(relatedItem);
                                        collection[index]._serverErrorMessage = failure.data.message;
                                    }
                                );
                            }

                            // delete a related item and update the collection

                            function deleteRelatedItem(relatedItem, relatedEntity, collection) {
                                var index;
                                Entity[relatedEntity].obliterate(
                                    relatedItem,
                                    function(data) {
                                        index = collection.indexOf(relatedItem);
                                        collection.splice(index, 1);
                                    },
                                    function(failure) {
                                        index = collection.indexOf(relatedItem);
                                        collection[index]._serverErrorMessage = failure.data.message;
                                    }
                                );
                            }
                        });

                    }
                }
            }
        }
    }
});
