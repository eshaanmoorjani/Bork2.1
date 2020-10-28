const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

const firestore = admin.firestore();

// // deletes chats with 0 people every 5 minutes
// exports.deleteChats = functions.pubsub.schedule('every 5 minutes').onRun((context) => {
//     console.log('This will be run every 5 minutes!');
//     return null;
// });


// listens for changes to the number of users and then finds the best chat for them
exports.assignChatroom = functions.firestore.document('users/{userId}').onWrite(async (change, context) => {
    const userId = context.params.userId;
    const userInfo = change.after.data();
    console.log(userInfo)
    if(userInfo['chat_id'] !== undefined) {
        console.log("this solved the issue")
        return null;
    }

    const premadeTags = userInfo.premade_tags
    const customTags = userInfo.custom_tags
    const userTags = premadeTags.concat(customTags)
    const username = userInfo.username

    // iterate through every chat that exists, and see which one fits the tag
    // create new chat for custom tag or 

    var chatId = await findBestChat(userTags, userId, username)
    
    // create a new chat for the person
    if(chatId === null) {
        // console.log("chatId is null")
        // chatId = firestore.collection('chats').doc().documentId()
        // console.log("new chatid: ",chatId)
        // firestore.collection("chats").document(chatId).add({
        //     num_participants: 1,
        //     tags: userTags
        // })
        // modify the chatId
    }

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
        console.log(error)
    })
});

async function findBestChat(userTags, userId, username) {
    // get every chat room where num_participants < 10
    return firestore.collection("chats").where("num_participants", "<", 10).get()
        .then(function(querySnapshot) {
            var chatId = "0"
            var chatTags = []
            var score = 0
            // Not developing code in this fashion b/c we are just focusing on Among Us
            for (var i in querySnapshot.docs) {
                const doc = querySnapshot.docs[i]

                chatId = doc.id
                chatTags = doc.tags
                score = 1 // chatScore(chatId, chatTags)
                // console.log(doc.id, " => ", doc.data());

                // short circuit if the perfect room is found
                if(score === 1) { // score === userTags.length) {
                    console.log("will add "+userId+" to this chat: ", chatId)
                    // increase the number of participants
                    firestore.collection('chats').doc(chatId).update({
                        num_participants: admin.firestore.FieldValue.increment(1)
                    })

                    firestore.collection('chats').doc(chatId).collection('participants').doc(userId).set({
                        user_id: userId,
                        username: username,
                        timestamp: new Date(),
                    })
                    console.log("before");
                    return chatId;
                }
            }

            return null
        })
        .catch(function(error) {
            console.log("Error: ", error)
        });
}

// how to do helper functions with firebase??
function chatScore(chatTags, userTags) {
    return 1;
}

/**
 * Run once a day at midnight, to cleanup the users
 * Manually run the task here https://console.cloud.google.com/cloudscheduler
 */
// exports.accountcleanup = functions.pubsub.schedule('every 5 minutes').onRun(async context => {
//     // Fetch all user details.
//     const inactiveUsers = await getInactiveUsers();
//     // Use a pool so that we delete maximum `MAX_CONCURRENT` users in parallel.
//     const promisePool = new PromisePool(() => deleteInactiveUser(inactiveUsers), MAX_CONCURRENT);
//     await promisePool.start();
//     console.log('User cleanup finished');
// });

/**
 * Deletes one inactive user from the list.
 */
function deleteInactiveUser(inactiveUsers) {
    if (inactiveUsers.length > 0) {
      const userToDelete = inactiveUsers.pop();
      
      // Delete the inactive user.
      return admin.auth().deleteUser(userToDelete.uid).then(() => {
        return console.log('Deleted user account', userToDelete.uid, 'because of inactivity');
      }).catch((error) => {
        return console.error('Deletion of inactive user account', userToDelete.uid, 'failed:', error);
      });
    } else {
      return null;
    }
  }

/**
 * Returns the list of all inactive users.
 */
async function getInactiveUsers(users = [], nextPageToken) {
    const result = await admin.auth().listUsers(1000, nextPageToken);
    // Find users that have not signed in in the last 30 days.
    const inactiveUsers = result.users.filter(
        user => Date.parse(user.metadata.lastSignInTime) < (Date.now() - 24 * 60 * 60 * 1000));
    
    // Concat with list of previously found inactive users if there was more than 1000 users.
    users = users.concat(inactiveUsers);
    
    // If there are more users to fetch we fetch them.
    if (result.pageToken) {
      return getInactiveUsers(users, result.pageToken);
    }
    
    return users;
}
  


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