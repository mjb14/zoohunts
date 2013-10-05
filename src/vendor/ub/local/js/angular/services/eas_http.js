// ------------ Global Loading Bar -------------
angular.module('services.easHttp', [])
    .config(['$httpProvider',
        function($httpProvider) {
            "use strict";
            $httpProvider.responseInterceptors.push('easHttpInterceptor');
        }
    ])
// register the interceptor as a service, intercepts ALL angular ajax http calls
.factory('easHttpInterceptor', ['$q', '$window', '$location', 'EASLabels',
    function($q, $window, $location, EASLabels) {
        "use strict";
        return function(promise) {

            return promise.then(function(response) {
                // THIS DOESN'T WORK - THE SHIB REDIRECT IS COMING BACK AS AN ERRO
                // AND STATUS CODE OF 0

                /*                
                // Check if we had a shib redirect
                var myRe = /You have requested access to a site that requires login/g;
                var myArray = myRe.exec(response.data);
                if(myArray) {
                    //console.log("found a shib page...");
                    $location.path('login'); 
                } else {
                    //console.log("not a shib page...");
                     return response;
                }
            */
                // Remove any form errors/messages
                EAS.removeFormErrors();
                EAS.removePageError();

                return response;

            }, function(response) {
                // do something on error

                if (response.status == 0) {
                    // NOT DOING ANYTHING WITH THIS YET---
                    // Certain actions (unexplainable) are causing a response with status code 0 to appear.  One example
                    // is with the typeahead.  If you paste a value in, then hit backspace, it causes this type of response,
                    // but the next backspace keystroke fires a normal response.  The bad response does not show up in the console.
                    // To help get around this, we will store a global count of the current # of status code = 0 reponses, and if
                    // 2+ responses in a row have the 0, then show the shib modal.
                    //console.log("Handle a shib response...");

                    $('#eas-shib-error').modal('show');


                } else if (response.status == "400") { // Bad request
                    //console.log( response.data.message );
                    //console.log( response.data.validation_messages );
                    //EAS.showPageError(response.data.message);
                    EAS.showFormErrors(response.data.validation_messages, response.data.message, EASLabels);
                } else if (response.status == "403") { // Forbidden
                    $location.path('not-authorized');
                } else if (response.status == "404") { // Not Found
                    $location.path('404');
                } else if (response.status == "500") { // Internal Error
                    $('#eas-server-error').modal('show');
                } else if (response.status == "503") { // Service Unavailable 
                    $location.path('not-available');
                } else {
                    console.log("Default status handler: [" + response.status + "]");
                }

                return $q.reject(response);
            });
        };
    }
]);
