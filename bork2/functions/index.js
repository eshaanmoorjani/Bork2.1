const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

const firestore = admin.firestore();
const realtime = admin.database();


/*
Need to turn the joinLobbyInput in LoginV2.js into a materialUI textfield so that it can display an error message
*/


exports.usernameApproval = functions.https.onCall(async (data, context) => {
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
                chatId = await createNewChat(tags, true, "Normal", null)
            }

            console.log("AYO BRUH IM WRITING TO THE USER INFORMATIO THDAKFHASKFH")
            await addToChatSequence(userId, chatId, username);
            return chatId;
        }
        return "button already pressed";
    });

});

exports.createLobby = functions.https.onCall(async (data, context) => {
    const userId = context.auth.uid;
    const username = data.username;
    const chatID = data.chatID;

    userRef =  realtime.ref("users/" + userId + '/queuing');
    return await userRef.once("value").then(async function(snapshot) {
        snapshot_val = snapshot.val();
        if(snapshot_val === null) {
            await createNewChat(['Among Us'], false, "Premade", chatID);
            await addToChatSequence(userId, chatID, username);
            return chatID;
        }
        return "button already pressed";
    });
});

/**
 * Writes the user's data into the correct chat room.
 * 
 * This function is only called if all user inputs (username, chatID) are valid.
 * 
 */
exports.joinLobby = functions.https.onCall(async (data, context) => {
    const userID = context.auth.uid;
    const username = data.username;
    const chatID = data.chatID;
    
    await addToChatSequence(userID, chatID, username);
});



/**
 * Verify that given chatID is ok.
 * 
 * Calls the necessary verifyChatID method for the given signInType.
 * If the signInType is soloQueue, no need to verify the chatID; return true.
 */
exports.verifyChatID = functions.https.onCall(async (data, context) => {
    const chatID = data.chatID;
    const signInType = data.signInType;

    if (signInType === "joinLobby") {
        return await verifyJoinChatID(chatID);
    } else if (signInType === "createLobby") {
        return await verifyCreateChatID(chatID);
    } else {
        return true;
    }

});


/**
 * Verify that a given chatID is ok.
 * 
 * Iterates through all the chats in the database that are not full, are premade lobbies, and are not open (to the outside world).
 * If there is a chat that matches the given chatID, return true.
 * Otherwise, no such chat exists; return false.
 * 
 * @param {*} chatID
 */
async function verifyJoinChatID(chatID) {
    /* Had to create an index in cloud firestore to handle multiple where() queries */
    return firestore.collection("chats")
    .where("num_participants", "<", 10).where("lobby_type", "==", "Premade").where("lobby_open", "==", false).get().then(function(querySnapshot) {
        for (var i in querySnapshot.docs) {
            const doc = querySnapshot.docs[i];
            if(doc.id === chatID) {
                return true;
            }
        }
        return "Lobby does not exist";
    })
    .catch(function(error) {
        console.log("Error: ", error);
    });
}


/**
 * Verify that a given chatID is ok.
 * 
 * Iterates through all chats.
 * If there is a chat with the same chatID, return false.
 * Otherwise, no such chat exists; return true.
 * 
 * @param {*} chatID 
 */
async function verifyCreateChatID(chatID) {
    return firestore.collection("chats").get().then(function(querySnapshot) {
        for (var i in querySnapshot.docs) {
            const doc = querySnapshot.docs[i];
            if(doc.id === chatID) {
                return "Lobby already exists";
            }
        }
        return true;
    })
    .catch(function(error) {
        console.log("Error: ", error);
    });
}


/**
 * Creates a new chat with the given properties.
 * 
 * If a chatID was passed in, create a chat with that ID.
 * Otherwise, let firebase autogenerate the chatID.
 * 
 * @returns The chatID of the newly created chat.
 * 
 * @param {*} userTags 
 * @param {*} lobby_open 
 * @param {*} lobby_type 
 * @param {*} chatID 
 */
async function createNewChat(userTags, lobby_open, lobby_type, chatID) {
    var ref = null;
    if (chatID === null || chatID === undefined) {
        ref = firestore.collection("chats").doc();
    } else {
        ref = firestore.collection("chats").doc(chatID);
    }
    return await ref.set({
        num_participants: 0, // changed this to 0, the chat shouldn't know whats going on outside
        tags: userTags,
        lobby_type: lobby_type,
        lobby_open: lobby_open,
    })
    .then( e => {
        return ref.id;
    })
    .catch(function(error) {
        console.log("Error adding document: ",error)
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


/**
 * Do the sequence of operations that must happen every time a user is added to a chat
 * 
 * 1. Write the user to the database -- who they are, what chat they are in, etc.
 * 2. Add them to the chat's participants
 * 3. Increase the chat's participants field by 1
 * 4. Send an entry message
 * 
 * @param {*} userId 
 * @param {*} chatId 
 * @param {*} username 
 */
async function addToChatSequence(userId, chatId, username) {
    await addUserToChat(userId, chatId, username);
    await addToParticipants(userId, chatId, username);
    await increaseParticipants(chatId);
    await sendMessage(chatId, userId, username, -1, "user_connect", username + " has joined the pub.",);
}


/**
 * Writes the given user's information to the database.
 * 
 * @param {*} userId 
 * @param {*} chatId 
 * @param {*} username 
 */
async function addUserToChat(userId, chatId, username) {
    await firestore.collection("users").doc(userId).set({
        user_id: userId,
        username: username,
        premade_tags: ['Among Us'],
        custom_tags: [],
        chat_id: chatId,
    });
}


/**
 * Given a chat and a user, add the user to the chat's participants
 * 
 * @param {*} chatId 
 * @param {*} userId 
 * @param {*} username
 */
async function addToParticipants(userId, chatId, username) {
    firestore.collection('chats').doc(chatId).collection('participants').doc(userId).set({
        user_id: userId,
        username: username,
        timestamp: new Date(),
    })
}


/**
 * Increases the num_participants field of the given chat by 1.
 * 
 * @param {*} chatId 
 */
async function increaseParticipants(chatId) {
    firestore.collection('chats').doc(chatId).update({
        num_participants: admin.firestore.FieldValue.increment(1)
    });
}


/**
 * Sends a given message to a given chat.
 * 
 * @param {*} chatId 
 * @param {*} userId 
 * @param {*} username 
 * @param {*} messageNumber 
 * @param {*} type 
 * @param {*} message 
 */
async function sendMessage(chatId, userId, username, messageNumber, type, message) {
    await firestore.collection('chats').doc(chatId).collection("messages").add({
        content: message,
        timestamp: new Date(),
        userID: userId,
        username: username,
        messageNumber: messageNumber,
        type: type,
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

    await sendMessage(chatId, userId, username, -1, "user_disconnect", username + " has hogged out.");
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