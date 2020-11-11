import {auth, db, functions, firebase} from '../services/firebase';
import { showPage } from '../index';

export function loginButtonTransition() {
    const soloQueueButton = document.getElementById('solo-queue-button');
    transition(soloQueueButton, "assignForSoloQueue");
}

export function joinLobbyTransition() {
    const joinLobbyButton = document.getElementById("join-lobby-button");
    transition(joinLobbyButton, "joinLobby");
}

export function createLobbyTransition() {
    const createLobbyButton = document.getElementById("create-lobby-button");
    transition(createLobbyButton, "createLobby");
}

/* Add listener to the given button */
function transition(button, functionName) {
    button.addEventListener('click', e=> {
        const username_box = document.getElementById("username-textfield");
        const username = username_box.value

        const usernameApproval = functions.httpsCallable('usernameApproval')
        usernameApproval({username: username}).then(result => { 
            const message = result.data;
            if(message === true) {
                signIn(username, functionName);
            }
            else {
                showPage(true, message);
            }
        })
    });
}

/* If solo queue button was clicked, chatID should be -1 (to be compatible with cloud function).
   If join lobby button was clicked, chatID should be what the user entered.
*/

function signIn(username, functionName) {
    auth.signInAnonymously();
    auth.onAuthStateChanged(function(firebaseUser) {
        if(firebaseUser) {
            const buttonFunction = functions.httpsCallable(functionName)
            buttonFunction({username: username}).then(result => { 
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