/*
    
    
    Common filters and parsers to be used across applications
    

*/
angular.module('EASFilters', []);


//  easTrueFalseAsYesNo
//  Will take a value and display Yes or No based on if that value is true or not
//  Sample Usage: {{ item.approver_person_number | easTrueFalseAsYesNo}}
angular.module('EASFilters').filter('easTrueFalseAsYesNo', function() {
    return function(val) {
        if (val) {
            return val ? 'Yes' : 'No';
        } else {
            return 'No';
        }
    };
});

// Parser
// Will allow only numeric values to be entered into a field, all non-numeric values
// will be replaced with empty string
angular.module('EASFilters').directive('easNumbersOnly', function() {
    return {
        require: 'ngModel',
        link: function(scope, elm, attrs, ctrl) {
            ctrl.$parsers.unshift(function(viewValue) {

                var transformedInput = viewValue.replace(/[^0-9]+/g, '');

                if (transformedInput != viewValue) {
                    ctrl.$setViewValue(transformedInput);
                    ctrl.$render();
                }

                return transformedInput;

            });
        }
    };
});


// Parser
// Will force a number to be negative
angular.module('EASFilters').directive('easNegativeNumber', function() {
    return {
        require: 'ngModel',
        link: function(scope, elm, attrs, ctrl) {
            ctrl.$parsers.unshift(function(viewValue) {

                var transformedInput;

                if (viewValue > 0) {
                    transformedInput = viewValue * -1;
                } else {
                    transformedInput = viewValue;
                }

                if (transformedInput != viewValue) {
                    ctrl.$setViewValue(transformedInput);
                    ctrl.$render();
                }

                return transformedInput;

            });
        }
    };
});


// Parser
// Will force a number to be negative
angular.module('EASFilters').directive('easPositiveNumber', function() {
    return {
        require: 'ngModel',
        link: function(scope, elm, attrs, ctrl) {
            ctrl.$parsers.unshift(function(viewValue) {

                var transformedInput;

                if (viewValue < 0) {
                    transformedInput = viewValue * -1;
                } else {
                    transformedInput = viewValue;
                }

                if (transformedInput != viewValue) {
                    ctrl.$setViewValue(transformedInput);
                    ctrl.$render();
                }

                return transformedInput;

            });
        }
    };
});
