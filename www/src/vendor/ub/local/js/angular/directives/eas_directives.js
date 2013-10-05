/*
    eas_directives.js
    
    This module exists to pull in all directives that should be common to all apps, which could
    include eas created directives or vendor created directives.
*/

var directivesModule = angular.module('EASDirectives', ['EASTitleBarModule', 'EASPreventClickModule', 'EASTypeahead', 'EASKeyData', 'easgrid']);
