const functions = require('firebase-functions');
// const firebase_tools = require('firebase-tools');
// const promisePool = require('es6-promise-pool');
const admin = require('firebase-admin');
admin.initializeApp();

const firestore = admin.firestore();

exports.deleteUserInfo = functions.https.onCall(async (data, context) => {
    const userId = data.userId;
    const chatId = data.chatId;
    return await deleteUserInfoHelper(userId, chatId)
});

async function deleteUserInfoHelper(userId, chatId) {
    console.log("userid to delete: ",userId)
    console.log("chatid to delete: ",chatId)
    
    // delete the user document
    const userDeletePath = firestore.collection('users').doc(userId)
    const userDeleteInfo = await userDeletePath.delete();

    if(chatId !== null) {
        // delete from current chat participants document
        const chatParticipantsPath = firestore.collection('chats').doc(chatId).collection('participants').doc(userId)
        const chatDeleteInfo = await chatParticipantsPath.delete();
        const lowerParticipantsInfo = await firestore.collection('chats').doc(chatId).update({
            num_participants: admin.firestore.FieldValue.increment(-1)
        })
    }

    return "sucess"
}

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
        chatId = await firestore.collection("chats").add({
            num_participants: 1,
            tags: userTags
        })
        .then(function(docRef) {
            chatId = docRef.id
            return docRef.id;
        })
        .catch(function(error) {
            console.error("Error adding document: ",error)
        });
    }

    console.log("CHATID: ",chatId)

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
        console.log('fuck firebase brah')
        console.log(error)
    })

    
    firestore.collection('chats').doc(chatId).collection('participants').doc(userId).set({
        user_id: userId,
        username: username,
        timestamp: new Date(),
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

                // short circuit if the perfect room is found
                if(score === 1) { // score === userTags.length) {
                    console.log("will add "+userId+" to this chat: ", chatId)
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

// Delete accounts that are signed up but are inactive (what does this mean tho? What if they decide to just have their video on)

// Delete chats that haven't had an active message for 30 minutes (same issue as above? )

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
      
        console.log("deleting chat information")
        // Delete the users chat information
        const userInfo = firestore.collection('users').doc(userId);
        var chatId = await userInfo.get().then(function(doc) {
            console.log(doc.id, " => "+doc.data())
            if(doc.exists) {
                console.log("doc.chat_id: ", doc.data().chat_id)
                chatId = doc.data().chat_id
                return chatId
            }
            return null
        }).catch(function(error) {
            console.error("broke here ", error)
        });
        const ref = await deleteUserInfoHelper(userId, chatId)

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