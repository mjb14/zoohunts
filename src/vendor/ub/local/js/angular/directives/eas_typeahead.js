var typeaheadModule = angular.module('EASTypeahead', []);

typeaheadModule.directive('typeahead', ['$q', 'Entity',
    function($q, Entity) {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function(scope, element, attrs, model) {

                // Defaults for all type aheads
                var defaults = {
                    //map: {},
                    minLength: 2, // The minimum character length needed before triggering autocomplete suggestions
                    items: 12, // The max number of items to display in the dropdown.
                    ajaxdelay: 400, // The time between typing and doing an AJAX request. Limiting the number of requests for fast typers.
                    updater: function(item) {
                        return item;
                    },
                    matcher: function(item) {
                        if (item.toLowerCase().indexOf(this.query.trim().toLowerCase()) != -1) {
                            return true;
                        }
                    },
                    sorter: function(items) {    
                        return items.sort();
                    },
                    highlighter: function(item) {
                        var regex = new RegExp('(' + this.query + ')', 'gi');
                        return item.replace(regex, "<strong>$1</strong>");
                    }
                };

                // merge the defaults with the passed in source data function
                var combinedData = $.extend({}, defaults, scope.$eval(attrs.typeahead));

                element.typeahead(combinedData);

                // show the spinner
                element.on('keydown', function(e) {

                    // Don't start spinner for enter key or tab key or arrow press
                    if (e.keyCode != 13 // enter
                        && e.keyCode != 9 // tab 
                        //&& e.keyCode != 8 // backspace
                        && e.keyCode != 37 // left
                        && e.keyCode != 38 // up
                        && e.keyCode != 39 // right
                        && e.keyCode != 40 // down

                    ) {
                        if (element.val() && element.val().length && element.val().length >= combinedData.minLength - 1) {
                            element.parent().find('.icon-spinner').removeClass('hidden');
                        }
                    }

                    // if backspace clicked, and no value, hide spinner
                    //if( (e.keyCode == 8 || e.keyCode == 46) && (!element.val() || element.val().length == 1)  ) {
                    //    element.parent().find('.icon-spinner').addClass('hidden');
                    //}
                });

                // hide spinner if no text
                element.on('keyup', function(e) {
                    if (!element.val() || element.val().length == 0) {
                        element.parent().find('.icon-spinner').addClass('hidden');
                    }
                });

                //element.on('blue', function() {                        
                // hide the spinner if they pasted a value into field and tabbed out - MAY NOT NEED THIS...
                //console.log("on blur...");
                //element.parent().find('.icon-spinner').addClass('hidden');
                //});

                element.on('change', function() {
                    if (attrs.hasOwnProperty('parent')) {
                        parent = scope.$eval(attrs.parent);
                        if (typeof map === 'undefined') {
                            //console.log("caught undefined map...");
                        } else {
                            if (map[element.val()]) {
                                parent[attrs.keyFieldTarget] = map[element.val()][attrs.keyField];
                            } else {
                                parent[attrs.keyFieldTarget] = "";
                            }
                        }
                    }

                    // hide the spinner
                    //console.log("hide the spinner");
                    element.parent().find('.icon-spinner').addClass('hidden');


                    // Update the model/view
                    scope.$apply(function() {
                        model.$setViewValue(element.val());
                    });

                    // Any post action necessary?
                    if (attrs.hasOwnProperty('postMethod')) {
                        scope.$eval(attrs.postMethod);
                    }


                });
            }
        };
    }
]);
