import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './pages/LoginV2';
import LobbyApp from './pages/ChatV2';
import * as serviceWorker from './serviceWorker';
import {db, auth} from './services/firebase';
import {loginButtonTransition} from './pages/LoginFirebase';

export function showPage(usernameError, usernameHelperText) {
  // AUTH LISTENER
  auth.onAuthStateChanged(firebaseUser => {
    console.log("auth changed")
    if(firebaseUser) { // and firebaseUser.assignedToChat
      console.log("firebase user hehe", firebaseUser)

      // create a listener because client writes to database --> cloud function is called --> chatId is assigned
      db.collection("users").doc(auth.currentUser.uid).onSnapshot(function(doc) {
        const data = doc.data();
        if (data != null) {
          const assignedChatID = data.chat_id;
          const username = data.username;


          ReactDOM.render(
            <LobbyApp chatID={assignedChatID} username={username} queueReady={true} joinTime={new Date()}/>,
            document.getElementById('root')
          );
        }
      }) 
    }  
    else {
      ReactDOM.render(
        <App usernameError={usernameError} usernameHelperText={usernameHelperText}/>,
        document.getElementById('root')
      );
      loginButtonTransition();
    }
  });
}

showPage(false, "");


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();