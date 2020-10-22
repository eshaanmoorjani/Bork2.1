export const firebase = require('firebase');
const config = {
    apiKey: "AIzaSyBriNz3DFDo1ra0CmHC0_ZpoCYnonSWOoo",
    authDomain: "bork-cc.firebaseapp.com",
    projectId: "bork-cc",
    databaseURL: "https://bork-cc.firebaseio.com"
};

firebase.initializeApp(config);
export const auth = firebase.auth();
export const db = firebase.firestore();

// firebase.database();