import logo from './logo.svg';
import './App.css';

import React, { Component } from 'react';
// import {
//   Route,
//   BrowserRouter as Router,
//   Switch,
//   Redirect,
// } from "react-router-dom";
//import Home from './pages/Home';
//import Chat from './pages/Chat';
//import Signup from './pages/Signup';
//import Login from './pages/Login';
import { auth } from './services/firebase';



export function App() {
  return (
    <div className="App">
      <script src="https://www.gstatic.com/firebasejs/7.24.0/firebase-app.js"></script>
      <BorkHeader />
      <BorkDescription />
      <UsernameBox />
      <TagBox />

    </div>
  );
}

function BorkHeader() {
  return (<h1>Bork</h1>);
}

function BorkDescription() {
  return (<h2>Bork matches gamers to other gamers. Find Among Us lobbies, Valorant teams, and more!</h2>);
}

function UsernameBox() {
  return (<form>
    <label id="username">
      Username
      <input type="text" username="Username" />
    </label>
  </form>);
}

function TagBox() {
  return (<form>
    <label id="tags">
      Tags
      <input type="text" tags="Tags"/>
    </label>
  </form>);
}

export default App;