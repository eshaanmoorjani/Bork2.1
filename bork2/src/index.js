import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './pages/Login';
import ChatApp from './pages/Chat';
import * as serviceWorker from './serviceWorker';
import {db, auth} from './services/firebase'
import {loginButtonTransition} from './pages/LoginFirebase'


// AUTH LISTENER
auth.onAuthStateChanged(firebaseUser => {
  console.log("auth changed")
  if(firebaseUser) { // and firebaseUser.assignedToChat

    // create a listener because client writes to database --> cloud function is called --> userId is assigned
    db.collection("users").doc(auth.currentUser.uid).onSnapshot(function(doc) {
      const data = doc.data();
      if (data.chat_id != null) {
        const assignedChatID = data.chat_id;
        const username = data.username;
        ReactDOM.render(
          <ChatApp chatID={assignedChatID} username={username}/>,
          document.getElementById('root')
        );
      }
    }) 
  }   
  else {
    ReactDOM.render(
      <App />,
      document.getElementById('root')
    );
    loginButtonTransition()
  }
});


// {
//     const data = querySnapshot.data();
//     console.log("DATA:", data);
//     chatID = data.chat_id;
//     })
// .catch(function(error) {
//     console.log(error)
// });

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();