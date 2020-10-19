import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import {auth} from './services/firebase'
import loginButtonTransition from './LoginFirebase'

ReactDOM.render(
  <App />,
  document.getElementById('root')
);

loginButtonTransition()

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
