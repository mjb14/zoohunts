/* -----------------------------------------
    Directive: eas-prevent-click
    Description: Use this to prevent the default behavior on a hyperlink
    Sample Usage:
        <a href="#" ng-click="selectIdmGroup(idmGroup)" eas-prevent-click>{{ idmGroup.group_name }}</a>
 ----------------------------------------- */
angular.module('EASPreventClickModule', []).directive('easPreventClick', function() {
    return function(scope, element, attrs) {
        element.bind('click', function(event) {
            event.stopPropagation();
            event.preventDefault();
            return 0;
        });
    }
});
