const functions = require('firebase-functions');

// http request 1
exports.randomNumber = functions.https.onRequest((request, response) => {
    const number = Math.round(Math.random() * 100);
    console.log(number); // will log in the firebase logs
    response.send(number.toString());
})

// http request 2
exports.eecs = functions.https.onRequest((request, response) => {
    response.redirect('http://localhost:3000/')
})

// http callable function
exports.sayHello = functions.https.onCall((data, context) => {
    const username = data.username
    return `hello ${username}`
})

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
