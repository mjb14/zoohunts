/*
        application_config.js
        
        Store the routes for the application.  We are storing it in a global variable so that we do not need to have an HTTP request
        in order to retrieve it.  Having an http request could complicate things due to the nature of asynchronous calls in that we have
        a separate request to pull in application specific data from the server.  We could allow both of these calls to race and track which finished 2nd
        in order to sanitize data, but there isn't much of a gain in doing that.

*/

var QR = QR || {};

QR.available_games = [
    {
        title: 'Mammal Hunt',
        game_id: 1,
        completed: 1,
        start_date: '7/5/2013'
    },
    {
        title: 'Halloween Hunt',
        completed: 0,
        game_id: 2,
        start_date: '7/5/2013'
    },
    {
        title: 'Member Night: 9/10/2013',
        completed: 0,
        game_id: 2,
        start_date: ''
    }
];

QR.game_instance =   {
        title: 'Mammal Hunt',
        start_time: '',
        end_time: '',
        start_date: '',
        end_date: '',
        category: {
            game_provider_category_id: 1,
            game_provider_id: 1,
            name: "Young Explorer"
        },
        pois: [
            {
                poi_id: 1,
                name: 'Polar Bear',
                qr_answer_code: ['xyz'],
                complete: 1,
                points: 5,
                clues: [
                    {
                        clue_id: 1,
                        clue: 'I am an animal in the artic circle.',
                        point_value: 10,
                        viewed: 1
                    },
                    {
                        clue_id: 2,
                        clue: 'I have white fur.',
                        point_value: 9,
                        viewed: 0
                    },
                    {
                        clue_id: 3,
                        clue: 'I am a bear.',
                        point_value: 8,
                        viewed: 0
                    }
                ]
            },
        ]
    };

QR.APPLICATION_DATA = {
    applicationTitle: "Zoo Hunts",
    providerId: 1,
    modules: [
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
                        "title": "View Games"
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
