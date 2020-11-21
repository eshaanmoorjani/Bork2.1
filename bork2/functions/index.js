const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

const firestore = admin.firestore();
const realtime = admin.database();

signInType = {
    soloQueue: soloQueue,
    createLobby: createLobby,
    joinLobby: joinLobby,

    
};


/**
 * This function is called by the client to sign in.
 * 
 * Verifies that the given username and/or chatID was ok.
 * If it they were not ok, returns an error message to render.
 * Otherwise, add the user's information to the database and assigns them the correct chat room.
 * 
 * @param {obj} data containing username, chatID, and signInType
 * @param {obj} context containing userID
 * @returns {string} error message
 * 
 */
exports.signIn = functions.https.onCall(async (data, context) => {
    const userID = context.auth.uid;
    const username = data.username;
    const chatID = data.chatID;
    const type = data.signInType;
    console.log("INPUTS!!!: ", userID, username, chatID, type);

    const signInFunction = signInType[type];

    var returnObj = {}

    returnObj = await verifyUsername(username);

    if (returnObj.usernameError === true) {
        return returnObj;
    }

    returnObj = await verifyChatID(chatID, type);

    if (returnObj.joinLobbyError === true || returnObj.createLobbyError === true) {
        return returnObj;
    }

    returnObj.chatID = await signInFunction(userID, username, chatID);
    returnObj.username = username;

    return returnObj;
});


/**
 * Verifies that a username is ok.
 * 
 * @param {string} username 
 * @return {string, boolean} message
 * 
 */
async function verifyUsername(username) {
    if(username.length === 0) {
        return {usernameError: true, usernameErrorMessage: "Username cannot be empty"};
    }
    else if(username.length > 16) {
        return {usernameError: true, usernameErrorMessage: "Username must be between 1-16 chracters"};
    }
    const username_lower = username.toLowerCase()
    for(var i = 0; i < username.length; i++) {
        if(!(username_lower[i] >= 'a' && username_lower[i] <= 'z') && !(username_lower[i] >= '1' && username_lower[i] <= '9')) {
            return {usernameError: true, usernameErrorMessage: "Username can only include letters and numbers."};
        }
    }
    return {usernameError: false, usernameErrorMessage: ""};
}

/**
 * Verify that the given chatID was ok.
 * Calls the appropriate helper function for each signInType.
 * 
 * @param {string} chatID 
 * @param {string} signInType 
 * @returns {boolean}
 * 
 */
async function verifyChatID(chatID, signInType) {
    if (signInType === "joinLobby") {
        return await verifyJoinChatID(chatID);
    } else if (signInType === "createLobby") {
        return await verifyCreateChatID(chatID);
    } else {
        return {joinLobbyError: false, createLobbyError: false};
    }
}


/**
 * Verify that the given chatID is ok.
 * 
 * Iterates through all the chats in the database that are not full, are premade lobbies, and are not open (to the outside world).
 * If there is a chat that matches the given chatID, return true.
 * Otherwise, no such chat exists; return false.
 * 
 * @param {string} chatID
 * @returns {boolean}
 * 
 */
async function verifyJoinChatID(chatID) {
    /* Had to create an index in cloud firestore to handle multiple where() queries */
    return firestore.collection("chats")
    .where("num_participants", "<", 10).where("lobby_type", "==", "Premade").where("lobby_open", "==", false).get().then(function(querySnapshot) {
        for (var i in querySnapshot.docs) {
            const doc = querySnapshot.docs[i];
            if(doc.id === chatID) {
                return {joinLobbyError: false}
            }
        }
        return {joinLobbyError: true, joinLobbyErrorMessage: "Lobby does not exist"};
    })
    .catch(function(error) {
        console.log("Error: ", error);
    });
}


/**
 * Verify that the given chatID is ok.
 * 
 * Iterates through all chats.
 * If there is a chat with the same chatID, return false.
 * Otherwise, no such chat exists; return true.
 * 
 * @param {string} chatID 
 * @returns {boolean}
 * 
 */
async function verifyCreateChatID(chatID) {
    // NEED TO ALSO MAKE SURE THAT CHATID CONTAINS NO SPECIAL CHARACTERS AND <41 CHARACTERS LONG 
    // VERY IMPORTANT TO NOT BREAK DAILY.CO ROOM CREATION

    return firestore.collection("chats").get().then(function(querySnapshot) {
        for (var i in querySnapshot.docs) {
            const doc = querySnapshot.docs[i];
            if(doc.id === chatID) {
                return {createLobbyError: true, createLobbyErrorMessage: "Lobby already exists"};
            }
        }
        return {createLobbyError: false};
    })
    .catch(function(error) {
        console.log("Error: ", error);
    });
}



async function soloQueue(userID, username, chatID) {
    chatID = await findBestChat(["Among us"], userID, username)
    
    if(chatID === null) {
        chatID = await createNewChat(["Among us"], true, "Normal", null)
    }

    await addToChatSequence(userID, chatID, username);
    return chatID;
}


async function createLobby(userID, username, chatID) {
    await createNewChat(['Among Us'], false, "Premade", chatID);
    await addToChatSequence(userID, chatID, username);
    return chatID;
}


async function joinLobby(userID, username, chatID) {
    await addToChatSequence(userID, chatID, username);
    return chatID;
}


/**
 * Creates a new chat with the given properties.
 * 
 * If a chatID was passed in, create a chat with that ID.
 * Otherwise, let firebase autogenerate the chatID.
 * 
 * @param {array} userTags 
 * @param {boolean} lobby_open 
 * @param {string} lobby_type 
 * @param {string} chatID 
 * @returns {string} The chatID of the newly created chat.
 * 
 */
async function createNewChat(userTags, lobby_open, lobby_type, chatID) {
    var ref = null;
    if (chatID === null || chatID === undefined) {
        ref = firestore.collection("chats").doc();
    } else {
        ref = firestore.collection("chats").doc(chatID);
    }
    return await ref.set({
        num_participants: 0,
        tags: userTags,
        lobby_type: lobby_type,
        lobby_open: lobby_open,
    })
    .then(async e => {
        const chatID = ref.id;
        await createVideoRoomURL(chatID);
        return chatID;
    })
    .catch(function(error) {
        console.log("Error adding document: ",error)
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
 * @returns {null}
 * 
 */
async function addToChatSequence(userId, chatId, username) {
    await addUserToChat(userId, chatId, username);
    await addToParticipants(userId, chatId, username);
    await changeNumParticipants(chatId, -1);
    await sendMessage(chatId, userId, username, -1, "user_connect", username + " has joined the pub.",);
}



/**
 * Writes the given user's information to the database.
 * 
 * @param {string} userId 
 * @param {string} chatId 
 * @param {string} username 
 * @returns {null}
 * 
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
 * @param {string} chatId 
 * @param {string} userId 
 * @param {string} username
 * @returns {null}
 * 
 */
async function addToParticipants(userId, chatId, username) {
    firestore.collection('chats').doc(chatId).collection('participants').doc(userId).set({
        user_id: userId,
        username: username,
        timestamp: new Date(),
    })
}


/**
 * Changes the num_participants field of the given chat by a given amount
 * 
 * @param {string} chatId 
 * @param {integer} num
 * @returns {null}
 * 
 */
async function changeNumParticipants(chatId, num) {
    firestore.collection('chats').doc(chatId).update({
        num_participants: admin.firestore.FieldValue.increment(num),
    });
}


/**
 * Sends a given message to a given chat.
 * 
 * @param {string} chatId 
 * @param {string} userId 
 * @param {string} username 
 * @param {string} messageNumber 
 * @param {string} type 
 * @param {string} message 
 * @returns {null}
 * 
 */
async function sendMessage(chatId, userId, username, messageNumber, type, message) {
    await firestore.collection('chats').doc(chatId).collection("messages").add({
        content: message,
        timestamp: new Date(),
        userID: userId,
        username: username,
        messageNumber: messageNumber,
        type: type,
    })
    .catch(function(error) {
        console.log("ERROR SENDING MESSAGE", error);
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



exports.sendMessage = functions.https.onCall(async (data, context) => {
    const message = data.message;
    const chatID = data.chatID;
    const userID = context.auth.uid;
    const username = data.username;
    const messageNumber = data.messageNumber;

    const verified = await verifyChatMessage(message, userID, chatID);
    if (!verified) {
        return false;
    }

    await sendMessage(chatID, userID, username, messageNumber, "user_content", message);
    await updateLastMessageTime(chatID);

    return true;
});


async function verifyChatMessage(message, userID, chatID) {
    // check if the user is in the chat they want to write to
    // check if the message contains no profanity
    return true;
}

async function updateLastMessageTime(chatID) {
    await firestore.collection("chats").doc(chatID).update({
        last_message_time: new Date(),
    })
    .catch(function(error) {
        console.log("ERROR UPDATING LAST MESSAGE: ", error);
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
    await changeNumParticipants(chatId, -1);
    await sendMessage(chatId, userId, username, -1, "user_disconnect", username + " has hogged out.");
    console.log("d")
}

// Delete inactive signed-out accounts
exports.accountCleanup = functions.runWith({timeoutSeconds: 540, memory: '2GB'}).pubsub.schedule('every 1000 minutes').onRun(async context => {
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
});

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


/**
 * Creates a daily.co video room with the same url as the given chatID
 * Ex: "https://hogpub.daily.co/{CHATID}"
 * 
 * Dependency: need to run "npm i node-fetch --save"
 * @param {string} chatID 
 * @returns {obj} The room object
 */
async function createVideoRoomURL(chatID) {
    const fetch = require("node-fetch");

    const exp = Date.now() / 1000 + 3660 // room expires 1 hour from creation date without warning and kicks everyone out but we gotta save money

    return await fetch("https://api.daily.co/v1/rooms", {
        "method": "POST",
        "headers": {
          "Content-Type": "application/json",
          "Authorization": "Bearer 5fb08c86128cf2c43f26d08bc1037ee5ab80080c73d1c20132dbb3e3c3a31bd1" // this is our private API key!!!
        },
        "body": `{"properties":{"enable_chat":false,"start_video_off":true,"start_audio_off":true,"autojoin":false,`
         + `"enable_screenshare":false,"max_participants":10, "exp": ${exp}, "eject_at_room_exp":true},"name":"${chatID}"}` // use backtick!!
      })
      .catch(err => {
        console.error("ERROR CREATING VIDEO ROOM:",err);
      });
}


/**
 * 
 * @param {string} chatID 
 * @returns {Obj} Contains 2 fields: deleted, and name. Ex: {"deleted":true, "name":THE CHAT ID THAT WAS DELETED}
 */
async function deleteVideoRoomURL(chatID) {
    const fetch = require("node-fetch");
    return await fetch(`https://api.daily.co/v1/rooms/${chatID}`, {
        "method": "DELETE",
        "headers": {
          "Authorization": "Bearer 5fb08c86128cf2c43f26d08bc1037ee5ab80080c73d1c20132dbb3e3c3a31bd1"
        }
      })
      .catch(err => {
        console.error("ERROR DELETING VIDEO ROOM", err);
      });
}