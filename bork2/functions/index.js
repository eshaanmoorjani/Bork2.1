const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

const firestore = admin.firestore();
const realtime = admin.database();


/*
Need to turn the joinLobbyInput in LoginV2.js into a materialUI textfield so that it can display an error message
*/


exports.usernameApproval = functions.https.onCall((data, context) => {
    const username = data.username
    if(username.length === 0) {
        return "Username cannot be 0 characters"
    }
    else if(username.length > 16) {
        return "Username must be between 1-16 chracters"
    }
    const username_lower = username.toLowerCase()
    for(var i = 0; i < username.length; i++) {
        if(!(username_lower[i] >= 'a' && username_lower[i] <= 'z') && !(username_lower[i] >= '1' && username_lower[i] <= '9')) {
            return "Username can only include letters and numbers."
        }
    }
    return true;
});

exports.assignForSoloQueue = functions.https.onCall(async (data, context) => {
    const userId = context.auth.uid
    const username = data.username

    userRef =  realtime.ref("users/" + userId + '/queuing')
    return await userRef.once("value").then(async function(snapshot) {
        if(snapshot.val() === null) {
            userRef.set(true);
            console.log("fuck me1", snapshot.val())
            const tags = ['Among Us'] // data.tags
            var chatId = await findBestChat(tags, userId, username)
            
            // create a new chat for the person
            if(chatId === null) {
                chatId = await createNewChat(tags, true, "Normal")
            }

            console.log("AYO BRUH IM WRITING TO THE USER INFORMATIO THDAKFHASKFH")
            await modifyUserChatInfo(userId, chatId, username);
            await increaseParticipants(chatId);
            return chatId;
        }
        return "button already pressed";
    });

});

exports.createLobby = functions.https.onCall(async (data, context) => {
    const userId = context.auth.uid;
    const username = data.username;


    userRef =  realtime.ref("users/" + userId + '/queuing');
    return await userRef.once("value").then(async function(snapshot) {
        snapshot_val = snapshot.val();
        if(snapshot_val === null) {
            var chatId = await createNewChat(['Among Us'], false, "Premade");

            await modifyUserChatInfo(userId, chatId, username);
            await increaseParticipants(chatId);

            return chatId;
        }
        return "button already pressed";
    });
});

exports.joinLobby = functions.https.onCall(async (data, context) => {
    const userId = context.auth.uid;
    const username = data.username;
    const chatID = data.chatID;
    
    await modifyUserChatInfo(userId, chatID, username);
    await increaseParticipants(chatID);
});

exports.verifyChatID = functions.https.onCall((data, context) => {
    const chatID = data.chatID;
    const signInType = data.signInType;
    console.log("SIGN IN TYPE: ", signInType);
    /* No need to verify the chatID for soloQueue*/
    if (signInType === "assignForSoloQueue" || signInType === "createLobby") {
        return true;
    } else {
        /* If there is a lobby with same ID as the user-given chatID, the lobby is not full, the lobby is open, and the lobby is premade return true */
        return firestore.collection("chats").where("num_participants", "<", 10).get() 
        .then(function(querySnapshot) {
            for (var i in querySnapshot.docs) {
                const doc = querySnapshot.docs[i];
                const data = doc.data();
                if(doc.id === chatID && !data.lobby_open && data.lobby_type === "Premade") {
                    return true;
                }
            }
            return false;
        })
        .catch(function(error) {
            console.log("Error: ", error);
        });
    }
});

async function createNewChat(userTags, lobby_open, lobby_type) {
    var chatId = null
    chatId = await firestore.collection("chats").add({
        num_participants: 0, // changed this to 0, the chat shouldn't know whats going on outside
        tags: userTags,
        lobby_type: lobby_type,
        lobby_open: lobby_open,
    })
    .then(function(docRef) {
        chatId = docRef.id
        return docRef.id;
    })
    .catch(function(error) {
        console.log("Error adding document: ",error)
    })
    return chatId
}

async function modifyUserChatInfo(userId, chatId, username) {
    // adds the user information to the database
    await firestore.collection("users").doc(userId).set({
        user_id: userId,
        username: username,
        premade_tags: ['Among Us'],
        custom_tags: [],
        chat_id: chatId,
    })
    
    // adds user to the participants collection
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
}

async function findBestChat(userTags, userId, username) {
    // get every chat room where num_participants < 10

    return firestore.collection("chats").where("num_participants", "<", 10).get() 
        .then(function(querySnapshot) {
            var chatId = "-1";
            var chatTags = [];
            var score = 0;
            // Not developing code in this fashion b/c we are just focusing on Among Us
            for (var i in querySnapshot.docs) {
                const doc = querySnapshot.docs[i];
                const data = doc.data();

                if(data.lobby_open && data.lobby_type === "Normal") {
                    chatId = doc.id;
                    chatTags = doc.tags;
                    score = 1; // chatScore(chatId, chatTags)

                    // moved adding one to participants to assignForSoloQueue; findBestChat shouldn't know about that

                    // short circuit if the perfect room is found
                    if(score === 1) {
                        return chatId;
                    }
                }
            }

            return null;
        })
        .catch(function(error) {
            console.log("Error: ", error)
        });
}

/* Increases numParticipants of the given lobby by one */
async function increaseParticipants(chatId) {
    firestore.collection('chats').doc(chatId).update({
        num_participants: admin.firestore.FieldValue.increment(1)
    });
}

// how to do helper functions with firebase??
function chatScore(chatTags, userTags) {
    return 1;
}

exports.removeDisconnectedUsers = functions.database.ref('/users/{userId}/is_disconnected').onWrite(async (change, context) => {
    const is_disconnected = change.after.val();
    const userId = context.params.userId;
    // console.log(original)
    // console.log(userId)
    if(is_disconnected) {
        await setTimeout(async function() {
            await realtime.ref('/users/' + userId + "/is_disconnected").once('value').then(async function(snapshot) {
                console.log("HAPPENED AFTER")
                if(snapshot.val()) {
                    await admin.auth().deleteUser(userId).then(() => {
                        return console.log('Deleted user account', userId, 'because of inactivity');
                    }).catch((error) => {
                        return console.error('Deletion of inactive user account', userId, 'failed:', error);
                    });
                    const userInfo = await getChatId(userId)
                    await deleteUserInfoHelper(userId, userInfo[0], userInfo[1])
                    await deleteChatInfo(userId, userInfo[0], userInfo[1])
                }
                console.log("should not delete")
                return null
            });
            return null
        },5000)
    }

});

exports.deleteUserInfo = functions.https.onCall(async (data, context) => {
    const userId = data.userId;
    const chatId = data.chatId;
    const username = data.username
    await deleteUserInfoHelper(userId)
    console.log("switching to the next: ", chatId)
    await deleteChatInfo(userId, chatId, username)
    return "success"
});

async function getChatId(userId) {
    const userInfo = firestore.collection('users').doc(userId);

    return await userInfo.get().then(function(doc) {
        console.log(doc.id, " => "+doc.data())
        if(doc.exists) {
            console.log("doc.chat_id: ", doc.data().chat_id)
            const chatId = doc.data().chat_id
            const username = doc.data().username
            return [chatId, username]
        }
        return [null, null]
    }).catch(function(error) {
        console.error("broke here ", error)
    });
}

async function deleteUserInfoHelper(userId) {
    console.log("userid to delete: ",userId)
    
    // delete the user document from firestore and realtime database
    const userDeletePath = firestore.collection('users').doc(userId)
    const userDeleteInfo = await userDeletePath.delete();
    await realtime.ref('users/'+userId).remove()

    // delete the user from the chat if they are the last person 
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
        content: username + " has hogged out.",
        timestamp: new Date(),
        userID: userId,
        username: username,
        messageNumber: -1,
        type: "user_disconnect",
    });
    console.log("d")
}

// Delete inactive signed-out accounts
exports.accountCleanup = functions.runWith({timeoutSeconds: 540, memory: '2GB'}).pubsub.schedule('every 30 minutes').onRun(async context => {
    const promisePool = require('es6-promise-pool');
    const PromisePool = promisePool.PromisePool;

    const inactiveUsers = await getInactiveUsers();
    console.log("length of inactive users: ", inactiveUsers.length)

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
        console.log("deleting inactive user")
        const userToDelete = inactiveUsers.pop();
        const userId = userToDelete.uid
      
        // Delete the user's database information
        const ref = await deleteUserInfoHelper(userId)

        console.log("deleting user information")
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

/* 
// listens for changes to the number of users and then finds the best chat for them
exports.assignChatroom = functions.firestore.document('users/{userId}').onWrite(async (change, context) => {
    const userId = context.params.userId;
    const userInfo = change.after.data();
    console.log(userInfo)
    if(userInfo['chat_id'] !== '-1') {
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
        chatId = await createNewChat(userTags, true)
    }

    await modifyUserChatInfo(userId, chatId, username)
});
*/