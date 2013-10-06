/*
        application_config.js
        
        Store the routes for the application.  We are storing it in a global variable so that we do not need to have an HTTP request
        in order to retrieve it.  Having an http request could complicate things due to the nature of asynchronous calls in that we have
        a separate request to pull in application specific data from the server.  We could allow both of these calls to race and track which finished 2nd
        in order to sanitize data, but there isn't much of a gain in doing that.

*/

var QR = QR || {};

QR.game_categories = [
    {
        name: 'Young Explorer',
        descr: 'age < 7'
    },
    {
        name: 'Junior Traveler',
        descr: 'age 7-13'
    },
    {
        name: 'Trail Blazer',
        descr: 'age 14+'
    }
];

QR.available_games = [
    {
        title: 'Mammal Hunt',
        game_id: 1,
        game_instance_id: 1,
        start_date: '7/5/2013',
        complete_date: '7/5/2013',
        auth_code_to_play: ''
    },
    {
        title: 'Halloween Hunt',
        game_id: 2,
        game_instance_id: 2,
        start_date: '7/5/2013',
        complete_date: '',
        auth_code_to_play: ''
    },
    {
        title: 'Member Night: 9/10/2013',
        game_id: 2,
        game_instance_id: 3,
        start_date: '',
        complete_date: '',
        auth_code_to_play: 'fun'
    },
    {
        title: 'General: 5/1/13-5/14/13',
        game_id: 2,
        start_date: '',
        complete_date: '',
        auth_code_to_play: ''
    },
];

QR.game_instance =   {
        title: 'Mammal Hunt',
        game_instance_id: 2,
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
                is_completed: 1,
                is_current: 0,
                points: 5,
                clues: [
                    {
                        poi_clue_id: 1,
                        clue_text: 'I am an animal in the artic circle.',
                        clue_point_value: 10,
                        viewed: 1
                    },
                    {
                        poi_clue_id: 2,
                        clue_text: 'I have white fur.',
                        clue_point_value: 9,
                        viewed: 0
                    },
                    {
                        poi_clue_id: 3,
                        clue_text: 'I am a bear.',
                        clue_point_value: 8,
                        viewed: 0
                    }
                ]
            },
            {
                poi_id: 2,
                name: 'Lion',
                qr_answer_code: ['xyz'],
                is_completed: 0,
                is_current: 1,
                points: 5,
                clues: [
                    {
                        clue_id: 1,
                        clue_text: 'I am an animal in the artic circle.',
                        clue_point_value: 10,
                        viewed: 1
                    },
                    {
                        clue_id: 2,
                        clue_text: 'I have white fur.',
                        clue_point_value: 9,
                        viewed: 0
                    },
                    {
                        clue_id: 3,
                        clue_text: 'I am a bear.',
                        clue_point_value: 8,
                        viewed: 0
                    }
                ]
            },
            {
                poi_id: 3,
                name: 'Penguin',
                qr_answer_code: ['xyz'],
                is_completed: 0,
                is_current: 0,
                points: 5,
                clues: [
                    {
                        clue_id: 1,
                        clue_text: 'I am an animal in the artic circle.',
                        clue_point_value: 10,
                        viewed: 1
                    },
                    {
                        clue_id: 2,
                        clue_text: 'I have white fur.',
                        clue_point_value: 9,
                        viewed: 0
                    },
                    {
                        clue_id: 3,
                        clue_text: 'I am a bear.',
                        clue_point_value: 8,
                        viewed: 0
                    }
                ]
            }
        ]
    };

QR.APPLICATION_DATA = {
    applicationTitle: "ABC Scavenger Hunts",
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
                        "title": "Hunts"
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
                        "url": "/view-game-item/1",
                        "visible": 1,
                        "title": "Item Clues"
                },
                {
                        "module": "view-game-items",
                        "url": "/view-game-items/1",
                        "visible": 1,
                        "title": "Game Items"
                },
                {
                        "module": "view-score-board",
                        "url": "/view-score-board",
                        "visible": 1,
                        "title": "view score board"
                }
               
        ]
        };
