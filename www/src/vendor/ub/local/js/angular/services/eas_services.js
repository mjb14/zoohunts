/*
    eas_services.js
    
    This module exists to pull in all services that should be common to all apps, which could
    include eas created services or vendor created services.
*/

var servicesModule = angular.module('EASServices', ['services.easDisplayOptions', 'services.EASConfig', 'services.EASAuthorization', 'services.easNavigation', 'services.easHttp', 'EASDefaultRouting', 'services.easUnsavedData', 'services.easImportantNotes', 'services.crud', 'services.easCache', 'services.easLabels', 'services.easSimpleSearch']);
