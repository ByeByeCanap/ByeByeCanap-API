// Creation of events.test.js and users.test.js

// If TDD for FRONT
// 1- INSTALLATION DANS TERMINAL FRONT: yarn add -D jest
// 2- Creation TDD
// 3- DANS TERMINAL FRONT: yarn jest


// If TDD for BACK
// 1- INSTALLATION DANS TERMINAL BACK: yarn add -D supertest
// 2- Creation TDD
// 3- DANS TERMINAL FRONT: yarn jest

// ------------------------------------------------------------------------------------------------------
const request = require('supertest');
const app = require('./routes/events.js'); 

it('GET /events/byTheme/:theme', async () => {
    //console.log("LOOK AT APP",typeof app, app); 
	const res = await request(app).get('/events/byTheme/Sport');
	expect(res.statusCode).toBe(200);
	expect(res.body).toEqual([

        {
            _id: "675db691a85208e19206c466",
            profileInfos: "63e58f2e93b3c3d9e81f01a1",
            title: "Cours de natation",
            theme: "Sport",
            category: "Pratiquer en extérieur (mer)",
            reference: "EVT002",
            image: "https://example.com/image2.jpg",
            eventDate: "2024-12-21T14:00:00.000Z",
            location: "Nice",
            sizeGroup: 6,
            description: "Apprenez à nager ou améliorez votre technique.",
            preferences: {
                age: "25",
                gender: "all",
                other: "Débutants acceptés",
                _id: "675dba166c06051606668488"
            },
            participants: [
                "63e58f2e93b3c3d9e81f01a1",
                "63e58f2e93b3c3d9e81f01a4"
            ],
            isFinished: false
        }
    ]);
});



