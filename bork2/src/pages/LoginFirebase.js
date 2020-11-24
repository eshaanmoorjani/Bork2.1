import React from 'react';
import ReactDOM from 'react-dom';
import { renderLogin, renderChat, renderLoading } from './../index';

import { auth, functions } from '../services/firebase';

function loginButtonTransition() {
    const sqb = document.getElementById('solo-queue-button');
    transition(sqb, "soloQueue");
}

function joinLobbyTransition() {
    const jlb = document.getElementById("join-lobby-button");
    const jdb = document.getElementById("join-input-button");
    transition(jlb, "joinLobby");
    transition(jdb, "joinLobby");
}

function createLobbyTransition() {
    const clb = document.getElementById("create-lobby-button");
    const cdb = document.getElementById("create-input-button");
    transition(clb, "createLobby");
    transition(cdb, "createLobby");
}

function removeLoginButtonTransition() {
    const sqb = document.getElementById('solo-queue-button');
    sqb.parentNode.replaceChild(sqb.cloneNode(true), sqb);
}

function removeJoinLobbyTransition() {
    const jlb = document.getElementById("join-lobby-button");
    const jdb = document.getElementById("join-input-button");
    jlb.parentNode.replaceChild(jlb.cloneNode(true), jlb);
    jdb.parentNode.replaceChild(jdb.cloneNode(true), jdb);
}

function removeCreateLobbyTransition() {
    const clb = document.getElementById("create-lobby-button");
    const cdb = document.getElementById("create-input-button");
    clb.parentNode.replaceChild(clb.cloneNode(true), clb);
    cdb.parentNode.replaceChild(cdb.cloneNode(true), cdb);
}

export function setTransitions() {
    loginButtonTransition();
    joinLobbyTransition();
    createLobbyTransition();
}

export function removeTransitions() {
    removeLoginButtonTransition();
    removeJoinLobbyTransition();
    removeCreateLobbyTransition();
}

/**
 * Retrive username, inputted chatID from input boxes in the login page.
 * 
 * Call server's sign in function.
 * 
 * If it works, render the chat page.
 * If it doesn't re-render the login page with the correct error message
 * 
 * @param {html button} button 
 * @param {string} signInType 
 * @returns {null}
 * 
 */
function transition(button, signInType) {
    button.addEventListener('click', onClick(signInType));
}

function onClick(signInType) {
    async function handleClick() {
        const username_box = document.getElementById("username-textfield");
        const username = username_box.value;
        const inputChatID = getInputChatID(signInType);
    
        renderLoading();
        
        const signIn = functions.httpsCallable('signIn');
        const obj = await signIn({username: username, chatID: inputChatID, signInType: signInType});
    
        const data = obj.data;
        console.log(data);
        if (data.usernameError || data.createLobbyError || data.joinLobbyError) {
            renderLogin(data.usernameError, data.usernameErrorMessage, data.createLobbyError, data.createLobbyErrorMessage, data.joinLobbyError, data.joinLobbyErrorMessage);
            removeTransitions();
            setTransitions();
        } else {
            renderChat(data.chatID, data.username);
        }
    }
    return throttle(handleClick, 2000);
}

export function throttle(func, timeFrame) {
    var lastTime = 0;
    return function () {
        var now = new Date();
        if (now - lastTime >= timeFrame) {
            func();
            lastTime = now;
        } else {
            console.log("waiting");
        }
    };
  }

/**
 * Retrieves the user-inputted chatID from the input boxes, given their signInType.
 * 
 * @param {string} signInType 
 * @returns {string} chatID
 * 
 */
function getInputChatID(signInType) {
    const joinLobbyInput = document.getElementById("join-lobby-input");
    const createLobbyInput = document.getElementById("create-lobby-input");
    if (signInType === "joinLobby") {
        return joinLobbyInput.value;
    } else if (signInType === "createLobby") {
        return createLobbyInput.value;
    } else {
        return null;
    }
}
