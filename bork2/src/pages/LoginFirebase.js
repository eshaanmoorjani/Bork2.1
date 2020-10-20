import {auth, db} from '../services/firebase';
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
            const tags = getCheckedTags();
            writeUserData(auth.currentUser.uid, document.getElementById("username").value, tags)
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
            const userId = firebaseUser.uid;
            // logged in --> move to the next page
        }   
        else {
            // logout button
        }
    });
}

function getCheckedTags() {
    var checkBoxes = document.getElementsByName("tag_checkbox");
    var checkedBoxes = [];
    for (var i = 0; i < checkBoxes.length; i++) {
        if (checkBoxes[i].checked) {
            checkedBoxes.push(checkBoxes[i].id);
        }
    }
    return checkedBoxes.length > 0 ? checkedBoxes : null;
}

function writeUserData(userId, username, tags) {
    db.ref('users/' + userId).set({
        username: username,
        tags: tags
    });
}
export default loginButtonTransition;