import {auth, db} from './services/firebase';

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
            console.log("dick")
            document.getElementById("no-username-warning").innerText = "Username cannot be empty. ";
            //alert("Username cannot be empty. ");
        }
    });

    // CLICK LOGOUT EVENT LISTENER -- TBD

    // AUTH LISTENER
    auth.onAuthStateChanged(firebaseUser => {
        console.log(firebaseUser)
        if(firebaseUser) {
            const userId = firebaseUser.uid;
            writeUserData(userId, document.getElementById("username").value)
            // logged in --> move to the next page
        }
        else {
            // logout button
        }
    });
}

function writeUserData(userId, un) {
  db.ref('users/' + userId).set({
    username: un,
  });
}
export default loginButtonTransition;