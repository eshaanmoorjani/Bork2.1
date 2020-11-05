import {auth, db, firebase} from '../services/firebase';

export function loginButtonTransition() {
    // GET ELEMENTS
    const btnLogin = document.getElementById('submit_button')
    // need to add a logout button later

    // CLICK LOGIN EVENT LISTENER
    btnLogin.addEventListener('click', e=> {
        const username_box = document.getElementById("username");
        if(username_box.value != "") { // add other username criteria later
            console.log("signed in a user");
            //const premadeTags = getCheckedTags();
            //const customTags = getCustomTags();
            const username = document.getElementById("username").value

            auth.signInAnonymously();
            auth.onAuthStateChanged(function(firebaseUser) {
                if(firebaseUser) {
                    //writeUserData(firebaseUser.uid, username, premadeTags, customTags) // transform this into a back-end function
                    writeUserData(firebaseUser.uid, username, ["among us"], ["among us"]);
                    assignNextChat(username);
                }
            });
        }
        else {
            document.getElementById("no-username-warning").innerText = "Username cannot be empty. ";
            //alert("Username cannot be empty. ");
        }
    });

    // CLICK LOGOUT EVENT LISTENER -- TBD

}

// call firebase callable function to move to the next page
function assignNextChat(username) {
    const submitButton = document.getElementById("submit_button");
    // const assignChatroom = firebase.functions().httpsCallable('assignChatroom');
    // assignChatroom({username: username}).then(result => {
    //     alert(result.data)
    // });
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

function writeUserData(userId, username, premadeTags, customTags) {
    auth.currentUser.chatId = null
    console.log('userid: ',userId)
    db.collection("users").doc(userId).set({
        user_id: userId,
        username: username,
        premade_tags: premadeTags,
        custom_tags: customTags
    })
}

export default loginButtonTransition;