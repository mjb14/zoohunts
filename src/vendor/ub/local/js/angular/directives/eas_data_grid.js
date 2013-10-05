/*
    directive:         eas_data_grid
    
    description:     This directive will take a table and transform it so that it includes:
                        - pagination
                        - sortable headers
                        - filter box
                        
                    This directive will not work with static tables - the tables MUST use data-ng-repeat to work properly. 
    
    usage:            On the table element itself, here are option params (exluding the directive itself).  Note that an ID is required on the table.
                <table 
                    data-eas-grid 
                    class                        = "table table-bordered table-striped table-condensed eas-data-grid" 
                    id                            = "applications-table"
                    data-eas-grid-default-order-by    = "application_name" 
                    data-eas-grid-hide-controls        = "1" 
                    data-eas-grid-hide-pagination    = "1" 
                    data-eas-grid-debug                = "1"
                    data-eas-grid-limits             = "1,2,3,4,15,50"
                    data-eas-grid-show-advanced-filters   = "1"
                >
                
                data-eas-grid-default-order-by:     column to sort the table by initially
                data-eas-grid-hide-controls:        option to hide the filter box and page size selection
                data-eas-grid-hide-pagination:    option to hide the pagination bar
                data-eas-grid-debug:                option to display debug information 
                data-eas-grid-limits:            option to override the default page size selections
                data-eas-grid-show-advanced-filters:    option to allow for custom column filtering
                
                    An example TR row in the table:
                    
                <tr data-ng-repeat="item in applications.rows">
                    <td data-eas-grid-title="" data-eas-grid-name="" data-eas-grid-delete="1">  
                        <label class="checkbox"><input type="checkbox" data-ng-model="item._toBeDeleted" class="delete-checked"></label> 
                    </td>
                    <td data-eas-grid-title="Edit">
                        <button class="btn btn-small" data-ng-click="app.crud().goTo('/manage/applications/edit/', item.application_id)">Edit</button>
                    </td>
                    <td data-eas-grid-title="Application" data-eas-grid-name="application_name" data-eas-grid-filterable="1">
                        {{item.application_name}}
                    </td>
                </tr>
                
                data-eas-grid-title:        Title to be displayed in the header row for this column
                data-eas-grid-name:        Optional. Name of the hash key that this column maps to in whatever object is being looped over
                data-eas-grid-delete:    Optional. If supplied, will create a column to be used to as a checkbox
                data-eas-grid-filterable: Optional.  If supplied, column will be filterable

*/



(function(angular) {
    'use strict';

    Object.keys = Object.keys || (function() {
        var hasOwnProperty = Object.prototype.hasOwnProperty,
            hasDontEnumBug = !{
                toString: null
            }.propertyIsEnumerable("toString"),
            DontEnums = [
                'toString',
                'toLocaleString',
                'valueOf',
                'hasOwnProperty',
                'isPrototypeOf',
                'propertyIsEnumerable',
                'constructor'
            ],
            DontEnumsLength = DontEnums.length;

        return function(o) {
            if (typeof o != "object" && typeof o != "function" || o === null)
                throw new TypeError("Object.keys called on a non-object");

            var result = [];
            for (var name in o) {
                if (hasOwnProperty.call(o, name))
                    result.push(name);
            }

            if (hasDontEnumBug) {
                for (var i = 0; i < DontEnumsLength; i++) {
                    if (hasOwnProperty.call(o, DontEnums[i]))
                        result.push(DontEnums[i]);
                }
            }

            return result;
        };
    })();



    // Grid Module
    var easGridModule = angular.module('easgrid', []);

    // Expressions for filter matching
    // Filtered text can use special characters to do things such as like conditions, signs are below in the object
    var Filters = {
        FILTER_GT: {
            sign: '>',
            code: 'gt',
            fn: function(item, filter) {
                return parseInt(item, 10) > parseInt(filter, 10);
            }
        },
        FILTER_LT: {
            sign: '<',
            code: 'lt',
            fn: function(item, filter) {
                return parseInt(item, 10) < parseInt(filter, 10);
            }
        },
        // Use this version if we want case sensitive
        //FILTER_IN:  { sign: ':', code:'in',  fn: function(item, filter) { return typeof item === 'string' ? item.indexOf(filter) !== -1 : filter == item; }},
        FILTER_IN: {
            sign: ':',
            code: 'in',
            fn: function(item, filter) {
                return (typeof item === 'string' && item) ? item.toLowerCase().indexOf(filter.toLowerCase()) !== -1 : filter == item;
            }
        },
        FILTER_NIN: {
            sign: '!',
            code: 'nin',
            fn: function(item, filter) {
                return typeof item === 'string' ? item.indexOf(filter) === -1 : filter != item;
            }
        },
        FILTER_EQ: {
            sign: '=',
            code: 'eq',
            fn: function(item, filter) {
                return filter.toLowerCase() == item.toLowerCase();
            }
        },
        FILTER_NEQ: {
            sign: '~',
            code: 'neq',
            fn: function(item, filter) {
                return filter != item;
            }
        }
    };


    // Create a regular expression that will compare an entered filtered text to see if it contains one of the special signs.
    // The format must be: "text SIGN test" where SIGN is one of the special signs, otherwise we will end up using the default any filter
    // IE 8 has issues with the code below, so I am hard coding the REGEX as opposed to building it, but I left the code to build it as a reference
    //var FILTER_REGEX  = new RegExp("^\\s*([a-zA-Z]+)\\s*([" + Object.keys(Filters).map(function(filter) { return "\\" + Filters[filter].sign; }).join('') + "])\\s*(.+)$");
    var FILTER_REGEX = new RegExp("/^\s*([a-zA-Z]+)\s*([\>\<\:\!\=\~])\s*(.+)$/");

    // Default the FILTER_ANY (if no special sign used) to just use the 'like' equivalent
    var FILTER_ANY = Filters.FILTER_IN;

    // Templates for the controls, table header, and the table footer (and debug)
    var Templates = {
        header: '<thead>' + '<th data-ng-repeat="head in grid.header">' + '<a class="" data-ng-class="{disabled: !head.name}"  data-ng-click="sort($index)">' + '<i data-ng-class="{ \'icon-arrow-up\'  : !!head.name && (grid.predicate==head.name) && grid.reverse' + ',\'icon-arrow-down\': head.name && (grid.predicate==head.name) && !grid.reverse}" ></i>' + ' {{head.title}} ' + '</a>' + '<input type="checkbox" onclick="EAS.toggleCheckAll(this)" data-ng-show="head.deleteChecked">' + '</th>' + '</thead>',
        controls: '<div class="crud-controls" data-ng-show=" ! grid.hideControls " style="background-color: #f9f9f9; padding: 1em 1em 0 1em; border: 1px solid #ddd; height: 70px;" >' + '<div class="control-group" data-ng-class="{error: grid.filterError}">' + '<select data-ng-show="grid.showAdvancedFilters" data-ng-options="option for option in grid.filterColumns" data-ng-model="grid.filterColumn" class="form-control"></select>' + '<select data-ng-show="grid.showAdvancedFilters" data-ng-options="v.value as v.option for v in grid.filterTypes" data-ng-model="grid.filterType" class="form-control"></select>' + '<div class="col-lg-2 col-sm-2 col-2"><input type="text" class="form-control" data-ng-model="grid.filter" placeholder="{{i18n.filter}}" name="filter" /></div>' + '<div class="pull-right">' + '<select data-ng-options="option for option in grid.limits" data-ng-model="grid.limit" class="form-control input-sm"></select>' + '</div>' + '&nbsp;</div>' + '</div>',
        footer: '<div style="background-color: #f9f9f9; height: 55px; border: 1px solid #ddd;" data-ng-show=" ! grid.hidePagination ">' + '<div class="pull-left" style="padding-left: 1em; padding-top: 1em;">' + '<span data-ng-show="grid.filteredList(true).length">' + '<strong>{{ grid.pageStartNumber() }} to {{ grid.filteredList() | grid_filter_size:grid.page:grid.limit }} of ' + '</span>' + '{{grid.filteredList(true).length}} rows</strong>' + ' {{ (grid.filteredList(true).length != grid.unfilteredList(true).length) && "(filtered)" || "" }}' + '</div>' + '<ul class="pagination pull-right" style="padding-right: 1em; padding-top: 1em;">' + '<li data-ng-class="{disabled: grid.page == 1}">' + '<a data-ng-click="prev()">{{i18n.prev}}</a>' + '</li>' + '<li data-ng-repeat="pageIndex in grid.filteredList() | grid_filter_lastPage:grid.limit | grid_filter_toPages:grid.maxPages:grid.page" data-ng-class="{active: grid.page==pageIndex, disabled: pageIndex==\'\u2026\'}">' + '<a data-ng-click="page(pageIndex)">{{pageIndex}}</a></li>' + '</li>' + '<li data-ng-class="grid.filteredList() | grid_filter_lastPage:grid.limit | grid_filter_equal:grid.page:\'disabled\'">' + '<a data-ng-click="next()">{{i18n.next}}</a>' + '</li>' + '</ul>' + '</div>',
        debug: '<pre>pagination = {{grid | json}}</pre>'
    };

    // Filter that is used to compute the number of items shown on page
    // ie, the value of X in "viewing pages 1-X of Y"
    easGridModule.filter('grid_filter_size', function() {
        return function(array, page, limit) {
            if (array) {
                return (page < Math.ceil(array.length / limit)) ? page * limit : array.length;
            }
        };
    });

    // Skip filter used to jump around when using pagination
    easGridModule.filter('grid_filter_skip', function() {
        return function(array, page, limit) {
            if (array) {
                return array.slice((page - 1) * limit);
            }
        };
    });

    easGridModule.filter('grid_filter_lastPage', function() {
        return function(list, limit) {
            if (list) {
                return Math.ceil(list.length / limit);
            }
        };
    });


    // Used to assign a CSS class in an data-ng-class directive.  This is the last part of a multi step process to calculate 
    // if a pagination button should be enabled or disabled.
    easGridModule.filter('grid_filter_equal', function() {
        return function(a, b, klass) {
            return a === b ? klass : '';
        };
    });

    easGridModule.filter('grid_filter_toPages', function() {
        return function(length, count, page) {
            if (!length) return [];
            var results = [],
                index;
            if (length < count) {
                for (index = 1; index <= length; index++) {
                    results.push(index);
                }
                return results;
            }

            var edge = (count - count % 2) / 2,
                low = true,
                low_from = 1,
                low_to = edge,
                mid_from = Math.max(1, page - edge),
                mid_to = Math.min(length, page + edge),
                high = true,
                high_from = length - edge + 1,
                high_to = length + 1;

            if (mid_from - low_to <= 2) {
                low = false;
                mid_from = low_from;
            }

            if (high_from - mid_to <= 2) {
                high = false;
                mid_to = high_to - 1;
            }

            // building first part
            if (low) {
                for (index = low_from; index <= low_to; index++) {
                    results.push(index);
                }
                results.push('\u2026');
            }

            // building middle part
            for (index = mid_from; index <= mid_to; index++) {
                results.push(index);
            }

            // building last part
            if (high) {
                results.push('\u2026');
                for (index = high_from; index < high_to; index++) {
                    results.push(index);
                }
            }

            return results;
        };
    });

    // the row filter
    // Used when doing expressions like =, >, <, etc
    // Format must match, as an example of = :    column = text

    easGridModule.filter('grid_filter_rowFilter', function() {
        return function(list, row, code, needle) {
            // return list if it is no list or something
            if (!list || !list.length) return list;
            // else filter the list
            return list.filter(function(item) {
                // dont include if the row does not have the item
                if (!(row in item)) return false;
                var element = item[row];
                // run through all Filters
                return Object.keys(Filters).filter(function(filter) {
                    return Filters[filter].code == code;
                }).reduce(function(value, filter) {
                    return value && Filters[filter].fn(element, needle);
                }, true);
            });
        };
    });

    easGridModule.filter('grid_filter_anyRowFilter', function() {
        return function(array, filter) {
            var header = this.grid.header;
            return array.filter(function(item) {
                return header.map(function(head) {
                    return FILTER_ANY.fn(item[head.name], filter);
                }).reduce(function(current, value) {
                    return current || value;
                }, false);
            });
        };
    });

    // the main directive: ngGrid
    easGridModule.directive('easGrid', ['$compile',
        function($compile) {
            return {
                scope: true,
                compile: function compile(element) {
                    var tr = element.children('tbody').children('tr'),
                        sourceExpression = tr.attr('data-ng-repeat').match(/^\s*(.+)\s+in\s+(.*)\s*$/),
                        baseExpression = sourceExpression[2],
                        itemExpression = sourceExpression[1];

                    tr.attr('data-ng-repeat', itemExpression + ' in grid.filteredList() | orderBy:grid.predicate:grid.reverse | grid_filter_skip:grid.page:grid.limit | limitTo:grid.limit');
                    //| grid_filter_skip:grid.page:grid.limit | orderBy:grid.predicate:grid.reverse | limitTo:grid.limit | grid_filter_forceLimit

                    var header = [],
                        filter_columns = [],
                        filter_hash = {};

                    // Construct our header row by inspecting each TD element in the table
                    angular.forEach(tr.children('td'), function(elm) {
                        var column = angular.element(elm),
                            exp = column.html().replace(/[{{}}\s]/g, ""),
                            name = column.attr('data-eas-grid-name'),
                            title = column.attr('data-eas-grid-title') || name,
                            filterable = parseInt(column.attr('data-eas-grid-filterable')) || 0,
                            deleteChecked = column.attr('data-eas-grid-delete') || '';

                        header.push({
                            name: name,
                            title: title,
                            deleteChecked: deleteChecked
                        });

                        // Set up mapping for use in filtering by column actual name or display name
                        if (name) {
                            filter_hash[angular.lowercase(name)] = header.length - 1;
                            filter_hash[name] = header.length - 1;
                        }

                        if (title) {
                            filter_hash[angular.lowercase(title)] = header.length - 1;
                            filter_hash[title] = header.length - 1;
                            if (filterable) {
                                filter_columns.push(title);
                            }

                        }

                        column.attr('data-eas-grid-title', null);
                    });

                    // If we are showing line numbers, creating a blank header item

                    element.prepend(Templates.header);

                    return {
                        pre: function preLink(scope) {
                            var cache = null,
                                lastExpression = null;

                            scope.grid = {
                                expression: baseExpression,
                                showLineNumbers: parseInt(element.attr('data-eas-grid-show-line-numbers')) || 0,
                                hideControls: parseInt(element.attr('data-eas-grid-hide-controls')) || 0, // Item comes in as a string, so "0" would show item
                                hidePagination: parseInt(element.attr('data-eas-grid-hide-pagination')) || 0, // Item comes in as a string, so "0" would show item
                                showAdvancedFilters: parseInt(element.attr('data-eas-grid-show-advanced-filters')) || 0, // Item comes in as a string, so "0" would show item
                                predicate: element.attr('data-eas-grid-default-order-by') || "",
                                debug: parseInt(element.attr('data-eas-grid-debug')) || 0, // kind of a debugging mode :-D
                                limit: element.attr('data-eas-grid-limit') || 20, // default starting number of items displayed
                                limits: element.attr('data-eas-grid-limits') ? element.attr('data-eas-grid-limits').split(",") : [10, 20, 30, 60],
                                filterTypes: [{
                                    'option': 'contains',
                                    'value': ':'
                                }, {
                                    'option': 'equals',
                                    'value': '='
                                }, {
                                    'option': 'not equals',
                                    'value': '~'
                                }, {
                                    'option': 'greater than',
                                    'value': '>'
                                }, {
                                    'option': 'less than',
                                    'value': '<'
                                }],
                                filterType: ':',
                                filterColumns: filter_columns,
                                filterColumn: filter_columns.length ? filter_columns[0] : '',
                                page: element.attr('data-eas-grid-page') || 1, // current page of the list
                                maxPages: element.attr('data-eas-grid-pagination') || 5, // max pages to show in pagination, half.floor() on edges
                                filterError: false, // computed value, tells if filter is in an error state
                                filter: '', // filter to be used with this grid
                                header: header, // header that was found for the grid
                                filteredList: function(ignoreCache) {
                                    if (!ignoreCache && scope.grid.expression == lastExpression)
                                        return cache;
                                    lastExpression = scope.grid.expression;
                                    cache = scope.$eval(scope.grid.expression);
                                    return cache;
                                },
                                unfilteredList: function(ignoreCache) {
                                    return scope.$eval(baseExpression);
                                },
                                pageStartNumber: function() {
                                    return scope.grid.page === 1 ? 1 : (scope.grid.page - 1) * scope.grid.limit + 1;
                                }
                            };


                            scope.i18n = {
                                next: 'Next',
                                prev: 'Prev',
                                total: 'Showing 1 to ',
                                filter: 'Filter...'
                            };

                            if (scope.grid.debug) {
                                element.after($compile(Templates.debug)(scope));
                            }
                            element.before($compile(Templates.controls)(scope));
                            element.after($compile(Templates.footer)(scope));

                            scope.$watch('grid.limit', function() {
                                if (scope.hasOwnProperty('grid')) {
                                    scope.grid.page = 1;
                                }
                            });


                            scope.filterChangeMethod = function() {
                                var filterExpression = '';
                                scope.grid.filterError = false;

                                // Case 1, power user, the filter types dropdown isn't displayed
                                // In this case we want to use a regex to determine if a special filter type should be used
                                if (scope.grid.showAdvancedFilters) {

                                    var func = scope.grid.filterType;
                                    var row = scope.grid.filterColumn;
                                    var filter = scope.grid.filter;
                                    var filters = Object.keys(Filters).map(function(filter) {
                                        return Filters[filter].sign == func ? Filters[filter].code : false;
                                    }).filter(function(func) {
                                        return func;
                                    });

                                    if (filter.length && row in filter_hash) {
                                        head = scope.grid.header[filter_hash[row]];
                                    }
                                    if (filters.length && filter && head) { // we do have a filter, a lookup target and a function to filter by
                                        filterExpression = ' | grid_filter_rowFilter:\'' + head.name + '\':\'' + filters[0] + '\':\'' + filter + '\'';
                                    } else {
                                        scope.grid.filterError = true;
                                        filterExpression = '';
                                    }


                                } else {
                                    var FILTER_REGEX_TEST = new RegExp("^\\s*([a-zA-Z]+)\\s*([" + Object.keys(Filters).map(function(filter) {
                                        return "\\" + Filters[filter].sign;
                                    }).join('') + "])\\s*(.+)$");

                                    if (scope.grid.filter) {
                                        var match = angular.lowercase(scope.grid.filter).match(FILTER_REGEX_TEST);
                                        if (match) {
                                            var head = null,
                                                row = match[1].trim().replace(' ', '_'),
                                                func = match[2].trim(),
                                                filter = match[3].trim(),
                                                filters = Object.keys(Filters).map(function(filter) {
                                                    return Filters[filter].sign == func ? Filters[filter].code : false;
                                                }).filter(function(func) {
                                                    return func;
                                                });

                                            //console.log("row: " + row);
                                            //console.log("func: " + func);
                                            //console.log("filter: " + filter);

                                            if (filter.length && row in filter_hash) {
                                                head = scope.grid.header[filter_hash[row]];
                                            }
                                            if (filters.length && filter && head) { // we do have a filter, a lookup target and a function to filter by
                                                filterExpression = ' | grid_filter_rowFilter:\'' + head.name + '\':\'' + filters[0] + '\':\'' + filter + '\'';
                                            } else {
                                                scope.grid.filterError = true;
                                                filterExpression = '';
                                            }
                                        } else {
                                            filterExpression = ' | grid_filter_anyRowFilter:\'' + scope.grid.filter + '\'';
                                        }
                                    }
                                }
                                // Case 2, filter types were shown on screen and user picked one

                                scope.grid.expression = baseExpression + filterExpression;

                                // Need to jump back to the first page or the display and page counts will be incorrect
                                scope.grid.page = 1;
                            }

                            // watch for change in filter
                            scope.$watch('grid.filter', function() {
                                scope.filterChangeMethod();
                            });

                            // watch for change in filter type
                            scope.$watch('grid.filterType', function() {
                                scope.filterChangeMethod();
                            });

                            // watch for change in filter column
                            scope.$watch('grid.filterColumn', function() {
                                scope.filterChangeMethod();
                            });

                            scope.sort = function(index) {
                                // Get column header info for the passed in index
                                var head = header[index];

                                if (!head || !head.name) return; // Only sort on named columns

                                // if the grid is already sorted by this head and not in reverse mode:
                                scope.grid.reverse = (scope.grid.predicate === head.name) && !scope.grid.reverse;

                                // set sorting to this head
                                scope.grid.predicate = head.name;

                                // jump back to the 1st page
                                scope.page(1);
                            };

                            scope.prev = function() {
                                if (scope.grid.page > 1) {
                                    scope.page(scope.grid.page - 1);
                                }
                            };

                            scope.next = function() {
                                if (scope.grid.page < Math.ceil(scope.grid.filteredList().length / scope.grid.limit)) {
                                    scope.page(scope.grid.page + 1);
                                }
                            };

                            scope.page = function(index) {
                                if (typeof index === 'number')
                                    scope.grid.page = index;
                            };
                        }
                    };
                }
            };
        }
    ]);
})(window.angular);
