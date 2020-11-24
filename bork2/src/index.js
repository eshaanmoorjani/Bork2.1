import React from 'react';
import ReactDOM from 'react-dom';

import * as serviceWorker from './serviceWorker';
import {firebase, db, auth} from './services/firebase';

import './index.css';
import App from './pages/LoginV2';
import LobbyApp from './pages/ChatV2';
import Loading from './pages/Loading';
import { setTransitions, removeTransitions } from './pages/LoginFirebase';



export function renderLogin(usernameError, usernameErrorMessage, createLobbyError, createLobbyErrorMessage, joinLobbyError, joinLobbyErrorMessage) {
  ReactDOM.render(<App usernameError={usernameError} usernameHelperText={usernameErrorMessage}
    createLobbyError={createLobbyError} createLobbyHelperText={createLobbyErrorMessage}
    joinLobbyError={joinLobbyError} joinLobbyHelperText={joinLobbyErrorMessage}
  />, document.getElementById('root'));

  auth.setPersistence(firebase.auth.Auth.Persistence.SESSION).then(function () {
    return auth.signInAnonymously();
  });
}

export async function renderPageWithUserID(userId) {
  const userInfo = db.collection('users').doc(userId);
  var chatID = ""
  var username = ""
  await userInfo.get().then(function(doc) {
    if(doc.exists) {
      chatID = doc.data().chat_id
      username = doc.data().username
    }
  })
  .catch(function(error) {
    console.error("broke here ", error)
  })

  if(chatID !== "") {
    renderChat(chatID, username)
  }
  else {
    console.log("poo");
    renderLogin();
    removeTransitions();
    setTransitions();
  }
}

export function renderChat(chatID, username) {
  ReactDOM.render(<LobbyApp chatID={chatID} username={username}/>, document.getElementById('root'));
}

export function renderLoading() {
  ReactDOM.render(<Loading />, document.getElementById("root"));
}


auth.onAuthStateChanged(function(user) {
  console.log("AUTH CHANGED!!!: ", user);
  if(user) {
    renderPageWithUserID(user.uid)
  }
  else {
    renderLogin();
    removeTransitions();
    setTransitions();
  }
});


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();