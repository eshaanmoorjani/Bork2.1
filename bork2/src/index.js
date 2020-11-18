import React from 'react';
import ReactDOM from 'react-dom';

import * as serviceWorker from './serviceWorker';
import {db, auth} from './services/firebase';

import './index.css';
import App from './pages/LoginV2';
import LobbyApp from './pages/ChatV2';
import { loginButtonTransition, joinLobbyTransition, createLobbyTransition } from './pages/LoginFirebase';


export function renderLogin(usernameError, usernameErrorMessage, createLobbyError, createLobbyErrorMessage, joinLobbyError, joinLobbyErrorMessage) {
  ReactDOM.render(<App usernameError={usernameError} usernameHelperText={usernameErrorMessage}
    createLobbyError={createLobbyError} createLobbyHelperText={createLobbyErrorMessage}
    joinLobbyError={joinLobbyError} joinLobbyHelperText={joinLobbyErrorMessage}
  />, document.getElementById('root'));

  auth.signInAnonymously();

  loginButtonTransition();
  joinLobbyTransition();
  createLobbyTransition();
}

export function renderChat(chatID, username) {
  ReactDOM.render(<LobbyApp chatID={chatID} username={username}/>, document.getElementById('root'));
}

renderLogin();


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();