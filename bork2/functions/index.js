const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

const firestore = admin.firestore();
const realtime = admin.database();


// listens for changes to the number of users and then finds the best chat for them
exports.assignChatroom = functions.firestore.document('users/{userId}').onWrite(async (change, context) => {
    const userId = context.params.userId;
    const userInfo = change.after.data();
    console.log(userInfo)
    if(userInfo['chat_id'] !== undefined) {
        return null;
    }

    const premadeTags = userInfo.premade_tags
    const customTags = userInfo.custom_tags
    const userTags = premadeTags.concat(customTags)
    const username = userInfo.username

    var chatId = await findBestChat(userTags, userId, username)
    
    // create a new chat for the person
    if(chatId === null) {
        chatId = await firestore.collection("chats").add({
            num_participants: 1,
            tags: userTags,
            ready_to_queue: True
        })
        .then(function(docRef) {
            chatId = docRef.id
            return docRef.id;
        })
        .catch(function(error) {
            console.error("Error adding document: ",error)
        });
    }

    firestore.collection("users").doc(userId).update({
        chat_id: chatId
    }).then(function() {
        return null
    })
    .catch(function(error) {
        console.log(error)
    })

    
    firestore.collection('chats').doc(chatId).collection('participants').doc(userId).set({
        user_id: userId,
        username: username,
        timestamp: new Date(),
    })

    // send a connect message
    firestore.collection('chats').doc(chatId).collection("messages").add({
        content: username + " has joined the pub.",
        timestamp: new Date(),
        userID: userId,
        username: username,
        messageNumber: -1,
        type: "user_connect",
    });
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

                // short circuit if the perfect room is found
                if(score === 1) { // score === userTags.length) {
                    // increase the number of participants
                    firestore.collection('chats').doc(chatId).update({
                        num_participants: admin.firestore.FieldValue.increment(1)
                    })

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


exports.removeDisconnectedUsers = functions.database.ref('/users/{userId}/is_disconnected').onWrite(async (change, context) => {
    const is_disconnected = change.after.val();
    const userId = context.params.userId;
    if(is_disconnected) {
        await setTimeout(async function() {
            await realtime.ref('/users/' + userId + "/is_disconnected").once('value').then(async function(snapshot) {
                if(snapshot.val()) {
                    const userInfo = await getChatId(userId)
                    await deleteUserInfoHelper(userId, userInfo[0], userInfo[1])
                    await deleteChatInfo(userId, userInfo[0], userInfo[1])
                    return admin.auth().deleteUser(userId).then(() => {
                        return console.log('Deleted user account', userId, 'because of inactivity');
                    }).catch((error) => {
                        return console.error('Deletion of inactive user account', userId, 'failed:', error);
                    });
                }
                return null
            });
            return null
        },25000)
    }

});

exports.deleteUserInfo = functions.https.onCall(async (data, context) => {
    const userId = data.userId;
    const chatId = data.chatId;
    const username = data.username
    await deleteUserInfoHelper(userId)
    await deleteChatInfo(userId, chatId, username)
    return "success"
});

async function getChatId(userId) {
    const userInfo = firestore.collection('users').doc(userId);

    return await userInfo.get().then(function(doc) {
        if(doc.exists) {
            const chatId = doc.data().chat_id
            const username = doc.data().username
            return [chatId, username]
        }
        return [null, null]
    }).catch(function(error) {
        console.error("Error", error)
    });
}

async function deleteUserInfoHelper(userId) {    
    // delete the user document from firestore and realtime database
    const userDeletePath = firestore.collection('users').doc(userId)
    const userDeleteInfo = await userDeletePath.delete();
    await realtime.ref('users/'+userId).remove()
    return "success"
}

async function deleteChatInfo(userId, chatId, username) {
    // delete from current chat participants document
    const chatParticipantsPath = firestore.collection('chats').doc(chatId).collection('participants').doc(userId)
    const chatDeleteInfo = await chatParticipantsPath.delete();
    const lowerParticipantsInfo = await firestore.collection('chats').doc(chatId).update({
        num_participants: admin.firestore.FieldValue.increment(-1)
    })

    // send user_disconnect message
    await firestore.collection('chats').doc(chatId).collection("messages").add({
        content: username + " has rage quit.",
        timestamp: new Date(),
        userID: userId,
        username: username,
        messageNumber: -1,
        type: "user_disconnect",
    });
}

// Delete inactive signed-out accounts
exports.accountCleanup = functions.runWith({timeoutSeconds: 540, memory: '2GB'}).pubsub.schedule('every 30 minutes').onRun(async context => {
    const promisePool = require('es6-promise-pool');
    const PromisePool = promisePool.PromisePool;

    const inactiveUsers = await getInactiveUsers();
    // Maximum concurrent account deletions.
    const MAX_CONCURRENT = Math.max(3, inactiveUsers.length);
    // await deleteInactiveUser(inactiveUsers)
    const new_promisePool = new PromisePool(() => deleteInactiveUser(inactiveUsers), MAX_CONCURRENT);
    await new_promisePool.start();
    console.log('User cleanup finished');

    return null
})

async function deleteInactiveUser(inactiveUsers) {
    if (inactiveUsers.length > 0) {
        const userToDelete = inactiveUsers.pop();
        const userId = userToDelete.uid
      
        // Delete the user's database information
        const ref = await deleteUserInfoHelper(userId)

        // Delete the inactive user's authentication status
        return admin.auth().deleteUser(userToDelete.uid).then(() => {
            return console.log('Deleted user account', userToDelete.uid, 'because of inactivity');
        }).catch((error) => {
        return console.error('Deletion of inactive user account', userToDelete.uid, 'failed:', error);
        });
    } 
    else {
        return null;
    }
}

async function getInactiveUsers(users = [], nextPageToken) {
    const result = await admin.auth().listUsers(1000, nextPageToken);
    // Find users that have not signed in in the last 30 days.
    const inactiveUsers = result.users.filter(
        user => Date.parse(user.metadata.lastSignInTime) < (Date.now() - 30 * 60 * 1000)); // 30 * 60 * 1000)); // Delete users after 30 minutes of inactivity
    
    // Concat with list of previously found inactive users if there was more than 1000 users.
    users = users.concat(inactiveUsers);
        
    // If there are more users to fetch we fetch them.
    if (result.pageToken) {
      return getInactiveUsers(users, result.pageToken);
    }
    
    return users;
}