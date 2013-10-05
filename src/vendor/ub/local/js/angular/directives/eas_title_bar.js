/*
    Directive:         eas-title-bar
    Description:     This will create the page title line.  It will use the page title for the current route.  
                    It allows the ability to add custom nagivation buttons to the title line.
    Sample Usage: 
        <div eas-title-bar>
            <button class="btn" href="#" prevent-click data-ng-click="app.crud().goTo('/manage/applications/')"><i class="icon-search"></i> <span class="hidden-phone">Return to Search</span></button>
            <button class="btn" ng-click="app.crud().goTo('/manage/applications/new')"><i class="icon-file"></i> <span class="hidden-phone">Add New Application</span></button>
        </div>
*/

angular.module('EASTitleBarModule', []).directive('easTitleBar', ['EASConfig',
    function(EASConfig) {
        return {
            restrict: 'A',
            replace: true,
            transclude: true,
            template: '<div class="title-bar"><span id="eas-page-title"></span><div class="pull-right" data-ng-transclude></div></div>',
            scope: {},
            controller: ['$scope', '$element', 'EASConfig',
                function titleBarController($scope, $element, EASConfig) {
                    $element.find('#eas-page-title').html(EASConfig.pageTitle());
                }
            ]
        };
    }
]);
