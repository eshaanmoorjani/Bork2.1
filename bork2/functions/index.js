const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

const firestore = admin.firestore();

// deletes chats with 0 people every 5 minutes
exports.deleteChats = functions.pubsub.schedule('every 5 minutes').onRun((context) => {
    console.log('This will be run every 5 minutes!');
    return null;
});

// listens for changes to the number of users and then finds the best chat for them
exports.assignChatroom = functions.firestore.document('users/{userId}').onWrite((change, context) => {
    const userId = context.params.userId;
    const userInfo = change.after.data();
    console.log(userInfo)

    const premadeTags = userInfo.premade_tags
    const customTags = userInfo.custom_tags
    const username = userInfo.username
    const chatId = '0'



    // iterate through every chat that exists, and see which one fits the tag
    // create new chat for custom tag or 

    firestore.collection("users").doc(userId).update({
        // username: username,
        // premade_tags: premadeTags,
        // custom_tags: customTags,
        chat_id: chatId
    }).then(function() {
        console.log("SUCCESSFULLLLL")
        return null
    })
    .catch(function(error) {
        console.log("fuck firebase brah")
        console.log(error)
    })


    // firestore.collection("users").doc(userId).get().then(function(doc) {
    //     if(doc.exists) {
    //         console.log("Document data:", doc.data());
    //     }
    //     else {
    //         console.log("No such document!");
    //     }
    //     return null
    // }).catch(function(error) {
    //     console.log("Error getting document:", error);
    // });
});