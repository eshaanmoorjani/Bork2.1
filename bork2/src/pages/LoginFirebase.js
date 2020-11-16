import React from 'react';
import ReactDOM from 'react-dom';
import App from './LoginV2';

import { auth, functions } from '../services/firebase';

export function loginButtonTransition() {
    const soloQueueButton = document.getElementById('solo-queue-button');
    transition(soloQueueButton, "assignForSoloQueue");
}

export function joinLobbyTransition() {
    const joinLobbyButton = document.getElementById("join-lobby-button"); // may have to delete this line, could add multiple listeners 2^n
    const joinDropdownButton = document.getElementById("join-input-button");
    transition(joinLobbyButton, "joinLobby");
    transition(joinDropdownButton, "joinLobby");
}

export function createLobbyTransition() {
    const createLobbyButton = document.getElementById("create-lobby-button");
    transition(createLobbyButton, "createLobby");
}

/**
 * Adds a listener to a given button.
 * On button press, verify the username and/or chatID.
 * If both are verified, then sign the user in.
 * Otherwise, re-render the login page with an error message.
 * 
 * Possible issue: make sure to not call this function multiple times, will add a ton of listeners
 * 
 * @param {*} button 
 * @param {*} signInType 
 */
function transition(button, signInType) {
    button.addEventListener('click', e=> {
        const username_box = document.getElementById("username-textfield");
        const username = username_box.value;
        
        const joinLobbyInput = document.getElementById("join-lobby-input");
        const chatID = (joinLobbyInput === undefined || joinLobbyInput === null) ? null : joinLobbyInput.value;

        const usernameApproval = functions.httpsCallable('usernameApproval');
        const verifyChatID = functions.httpsCallable('verifyChatID');

        /* If the username is ok, make sure the chatID is ok, then sign in. If either is not ok, re-render the page with an error message */
        usernameApproval({username: username}).then(result => {
            const message = result.data;
            if(message === true) {
                verifyChatID({chatID: chatID, signInType: signInType}).then(result => {
                    const verified = result.data;
                    if (verified) {
                        console.log("ITS VERIFIED!!!");
                        signIn(username, chatID, signInType);
                    } else {
                        console.log("ITS NOT VERIFIED!!!");
                        /* Re-render the login page with the chatID error message */
                        ReactDOM.render(<App chatIDError={true} chatIDErrorMessage="The chat does not exist or is full!"/>,
                        document.getElementById("root"));
                    }
                });
            } else {
                /* Re-render the login page with the username error message */
                ReactDOM.render(<App usernameError={true} usernameHelperText={message} />, document.getElementById("root"));
            }
        })
    });
}

/* If solo queue button was clicked, chatID should be -1 (to be compatible with cloud function).
   If join lobby button was clicked, chatID should be what the user entered.
*/

/**
 * This function is called when we are guarenteed that the user inputted username and/or chatID is valid
 * 
 * Revised 11/16/2020 to no longer add another auth.onStateChanged()
 * 
 * @param {*} username 
 * @param {*} chatID 
 * @param {*} signInType 
 */
async function signIn(username, chatID, signInType) {
    console.log("new auth")
    await auth.signInAnonymously();
    const buttonFunction = functions.httpsCallable(signInType);
    buttonFunction({username: username, chatID: chatID}).then(result => { 
        console.log("dick", result.data);
    });
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

export default loginButtonTransition;