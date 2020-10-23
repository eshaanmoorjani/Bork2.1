const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

const firestore = admin.firestore();

exports.assignChatroom = functions.https.onCall((data, context) => {
    if(!context.auth) {
        throw new functions.http.HttpsError(
            'authentication error', 'only authenticated users can join rooms'
        );
    }
    
    const currentChatrooms = firestore.collection('chatroom_requests').get().then(docSnapshot => {
        if(docSnapshot.exists) {
            console.log("DOCUMENT DATA:", docSnapshot.data());
        }
        else {
            console.log("No such document!");
        }
        return null
    }).catch(function(error) {
        console.log("Error getting document:", error); // ERROR, cannot read proper file directory
    });
    
    return null
    // return firestore.collection('chatroom_requests').add({
    //     dick: data.username
    // });
});

// create an algorithm for the user to find the best chatroom for them to go to 
function findBestChatroom() {
    // pass    | the user is authenticated --> 1. their data is saved + move to the chatroom page 2. cloud function runs to find ideal chatroom
}

/*
// auth trigger (new user signup)
exports.newUserSignup = functions.auth.user().onCreate(user => {
    return firestore.collection('users').doc(user.uid).set({
        username: user.username,
        custom_tags: [],
        premade_tags: []
    });
});

// auth trigger (user deleted)
exports.userDeleted = functions.auth.user().onDelete(user => {
    const doc = firestore.collection('users').doc(user.uid);
    return doc.delete();
});
*/

/*
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
*/

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
