/*
        application_config.js
        
        Store the routes for the application.  We are storing it in a global variable so that we do not need to have an HTTP request
        in order to retrieve it.  Having an http request could complicate things due to the nature of asynchronous calls in that we have
        a separate request to pull in application specific data from the server.  We could allow both of these calls to race and track which finished 2nd
        in order to sanitize data, but there isn't much of a gain in doing that.

*/

var EAS = EAS || {};

EAS.APPLICATION_DATA = {
  "applicationTitle": "The QR Hunting Company",
  "modules": [
                 {
                        "module": "",
                        "url": "/",
                        "visible": 1,
                        "title": "Welcome"
                },
                {
                        "module": "find-hunts",
                        "url": "/find-hunts",
                        "visible": 1,
                        "title": "Find Hunts"
                },
                {
                        "module": "select-hunt-category",
                        "url": "/select-hunt-category",
                        "visible": 1,
                        "title": "Select Hunt Category"
                },
                {
                        "module": "view-ip-hunts",
                        "url": "/view-ip-hunts",
                        "visible": 1,
                        "title": "View In Progress Hunts"
                },
                {
                        "module": "view-my-badges",
                        "url": "/view-my-badges",
                        "visible": 1,
                        "title": "View My Badges"
                },
                {
                        "module": "login",
                        "url": "/login",
                        "visible": 1,
                        "title": "Login"
                },
                 {
                        "module": "view-game-item",
                        "url": "/view-game-items/10",
                        "visible": 1,
                        "title": "view item"
                },
                {
                        "module": "view-game-items",
                        "url": "/view-game-items",
                        "visible": 1,
                        "title": "View Game Items"
                },
                {
                        "module": "view-score-board",
                        "url": "/view-score-board",
                        "visible": 1,
                        "title": "view score board"
                }
               
        ]
        };
