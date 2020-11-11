import {auth, db, firebase} from '../services/firebase';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './LoginV2.js';

export function loginButtonTransition() {
    const soloQueueButton = document.getElementById('solo-queue-button');
    transition(soloQueueButton, "soloQueue");
}

export function joinLobbyTransition() {
    const joinLobbyButton = document.getElementById("join-lobby-button");
    transition(joinLobbyButton, "joinLobby");
}

export async function createLobbyTransition() {
    
}

/* Add listener to the given button */
function transition(button, type) {
    button.addEventListener('click', e=> {
        const chatID = getChatID(type);

        const username_box = document.getElementById("username-textfield");        
        if(username_box.value != "" && username_box.value.length < 10) {
            signIn(username_box, chatID);
        }
        else {
            ReactDOM.render(<App usernameError={true} usernameLabel="Bad username!"/>, document.getElementById("root"));
        }
    });
}

/* If solo queue button was clicked, chatID should be -1 (to be compatible with cloud function).
   If join lobby button was clicked, chatID should be what the user entered.
*/
function getChatID(type) {
    var chatID = "-1";
    if (type == "joinLobby") {
        const joinLobbyInput = document.getElementById("join-lobby-input");
        chatID = joinLobbyInput.value;
    }
    console.log("CHAT ID:", chatID);
    return chatID;
}

function signIn(username_box, chatID) {
    const username = username_box.value;
    auth.signInAnonymously();
    auth.onAuthStateChanged(function(firebaseUser) {
        if(firebaseUser) {
            writeUserData(firebaseUser.uid, username, ["among us"], ["among us"], chatID);
        }
    });
}

function usernameWarn(username_box) {
    const usernameWarning = document.getElementById("username-warning");
    if (username_box.value == "") {
        usernameWarning.innerText = "Username cannot be empty!";
    } else {
        usernameWarning.innerText = "Username must be under 10 characters!";
    }
}

function getCheckedTags() {
    // pre-made tags
    var checkBoxes = document.getElementsByName("tag_checkbox");
    var checkedTags = [];
    for (var i = 0; i < checkBoxes.length; i++) {
        if (checkBoxes[i].checked) {
            checkedTags.push(checkBoxes[i].id);
        }
    }
    
    return checkedTags.length > 0 ? checkedTags : [];
}

function getCustomTags() {
    // convert tags to all lowercase and no whitespace, separate by commas
    const customTags = document.getElementById("customTags").value
    if(customTags == "") {
        return []
    }
    const customTagsArray = customTags.replace(/ /g, '').toLowerCase().split(","); 

    return [...new Set(customTagsArray)];
}

function writeUserData(userId, username, premadeTags, customTags, chatID) {
    auth.currentUser.chatId = null
    console.log('userid: ',userId)
    db.collection("users").doc(userId).set({
        user_id: userId,
        username: username,
        premade_tags: premadeTags,
        custom_tags: customTags,
        chat_id: chatID,
    })
}

export default loginButtonTransition;