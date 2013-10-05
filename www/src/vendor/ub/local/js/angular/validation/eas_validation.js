/*
    
    
    Common validation to be used across applications

*/
angular.module('EASValidation', []);

// here is a sample one
/*
angular.module('EASValidation').directive('easEffectiveDateValidate', function() {
    return {
        require: 'ngModel',
        link: function(scope, elm, attrs, ctrl) {
            ctrl.$parsers.unshift(function(viewValue) {
            
                if( scope.hasOwnProperty('detailsForm') ) {
                    var fiscalYear = scope.detailsForm.fiscal_year.$modelValue;
                    var year1 = fiscalYear.substring(0,4);
                    var year2 = fiscalYear.substring(4);
                    var date1 = new Date(year1, 1, 1, 1, 1, 1, 1 ); // jan 1 of year1
                    var date2 = new Date(year2, 1, 1, 1, 1, 1, 1 ); // jan 1 of year2
                    if( viewValue) {
                        if(date1 <= viewValue && viewValue <= date2) {
                            ctrl.$setValidity('effective_date', true);
                            return viewValue;
                        } else {
                            ctrl.$setValidity('effective_date', false);                    
                            return undefined;
                        }
                    } 
                } 
            });
        }
    };
});
*/
