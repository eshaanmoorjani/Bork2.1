import {auth, db, functions, firebase} from '../services/firebase';

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
        const username = username_box.value

        const usernameApproval = functions.httpsCallable('usernameApproval')
        usernameApproval({username: username}).then(result => { 
            const message = result.data;
            if(message === true) {
                signIn(username, chatID)
            }
            else {
                const usernameWarning = document.getElementById("username-warning");
                usernameWarning.innerText = message;
            }
        })
        // if(username_box.value != "" && username_box.value.length < 10) {
        //     signIn(username_box, chatID);
        // }
        // else {
        //     usernameWarn(username_box);
        // }
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

function signIn(username, chatID) {
    auth.signInAnonymously();
    auth.onAuthStateChanged(function(firebaseUser) {
        if(firebaseUser) {
            const assignForSoloQueue = functions.httpsCallable('assignForSoloQueue')
            assignForSoloQueue({username: username}).then(result => { 
                console.log(result.data);
            })
        }
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