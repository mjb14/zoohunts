/*
    eas_search_form.js
    
    Methods:
        formatSearchQuery() - return the formatted search query
        
    Expectations:
        Each search row should have 2 fields, the search value and the search type.  The search
        field should have an idea of search-form-fieldname and must have an ng-model on it.  
        
        The ng-model needs to be 3 levels, where the middle level is arbitrary container to help with naming collisions
        
        Example: (field name = "descr")
    
        <select id="search-form-descr-search-type">
            <option value="1" selected="selected">begins with</option>
            <option value="8">contains</option>
            <option value="2">=</option>
            <option value="3">not =</option>
            <option value="4">&lt;</option>
            <option value="6">&lt;=</option>
            <option value="5">&gt;</option>
            <option value="7">&gt;=</option>
        </select>
        
        <input type="text" ng-model="searchForm.item.descr" /></td></tr>
*/

angular.module('services.easSearchFormQuery', []).factory('EASSearchFormQuery', [
    function() {
        var service = {

            formatSearchQuery: function(formData, formId) {

                var action, fieldFormatted;
                var searchFormDataFormatted = {};
                angular.forEach(formData, function(field, key) {
                    if (field) {
                        action = $('#' + formId + ' #search-form-' + key + '-search-type').val();
                        //console.log("Field: " + field + " :: key: " + key + " :: action: " + action);
                        switch (action) {
                            case '1':
                                // begins with
                                fieldFormatted = field.length ? field + '%' : '';
                                break;
                            case '2':
                                // Equals
                                fieldFormatted = field.length ? field : '';
                                break;
                            case '3':
                                // Not Equal To
                                fieldFormatted = field.length ? '<>' + field : '';
                                break;
                            case '4':
                                // Less Than
                                fieldFormatted = field.length ? '<' + field : '';
                                break;
                            case '5':
                                // Greater Than
                                fieldFormatted = field.length ? '>' + field : '';
                                break;
                            case '6':
                                // Less Than  or Equal To
                                fieldFormatted = field.length ? '<=' + field : '';
                                break;
                            case '7':
                                // Greater Than or Equal To
                                fieldFormatted = field.length ? '>=' + field : '';
                                break;
                            case '8':
                                // begins with
                                fieldFormatted = field.length ? '%' + field + '%' : '';
                                break;
                            case '9':
                                // case insensitive
                                fieldFormatted = field.length ? '~' + field : '';
                                break;
                        }

                        searchFormDataFormatted[key] = fieldFormatted;
                    }
                });

                return searchFormDataFormatted;
            }
        };

        return service;

    }
]);
