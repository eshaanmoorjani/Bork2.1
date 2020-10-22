import {auth, db, firebase} from '../services/firebase';
import React from 'react';
export function loginButtonTransition() {
    // GET ELEMENTS
    const btnLogin = document.getElementById('submit_button')
    // need to add a logout button later

    // CLICK LOGIN EVENT LISTENER
    btnLogin.addEventListener('click', e=> {
        const username_box = document.getElementById("username");
        if(username_box.value != "") { // add other username criteria later
            console.log("signed in a user");
            auth.signInAnonymously();
        }
        else {
            document.getElementById("no-username-warning").innerText = "Username cannot be empty. ";
            //alert("Username cannot be empty. ");
        }
    });

    // CLICK LOGOUT EVENT LISTENER -- TBD

    // AUTH LISTENER
    auth.onAuthStateChanged(firebaseUser => {
        console.log("auth changed")
        if(firebaseUser) {
            // if authunticated --> move to the next page

            const premadeTags = getCheckedTags();
            const customTags = getCustomTags();
            const username = document.getElementById("username").value
            writeUserData(firebaseUser.uid, username, premadeTags, customTags)

            moveToChat(username);
        }   
        else {
            // logout button
        }
    });
}

// call firebase callable function to move to the next page
function moveToChat(username) {
    const submitButton = document.getElementById("submit_button");
    const sayHello = firebase.functions().httpsCallable('sayHello');
    sayHello({username: username}).then(result => {
        alert(result.data)
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
    
    return checkedTags.length > 0 ? checkedTags : null;
}

function getCustomTags() {
    // convert tags to all lowercase and no whitespace, separate by commas
    const customTags = document.getElementById("customTags").value
    if(customTags == "") {
        return null
    }
    const customTagsArray = customTags.replace(/ /g, '').toLowerCase().split(","); 
    return customTagsArray;
}

function writeUserData(userId, username, premadeTags, customTags) {
    db.collection("users/").add({
        username: username,
        premade_tags: premadeTags,
        custom_tags: customTags
    })
}

export default loginButtonTransition;