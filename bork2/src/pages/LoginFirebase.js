import React from 'react';
import ReactDOM from 'react-dom';
import { renderLogin, renderChat } from './../index';

import { auth, functions } from '../services/firebase';

function loginButtonTransition() {
    const soloQueueButton = document.getElementById('solo-queue-button');
    transition(soloQueueButton, "soloQueue");
}

function joinLobbyTransition() {
    const joinLobbyButton = document.getElementById("join-lobby-button");
    const joinDropdownButton = document.getElementById("join-input-button");
    transition(joinLobbyButton, "joinLobby");
    transition(joinDropdownButton, "joinLobby");
}

function createLobbyTransition() {
    const createLobbyButton = document.getElementById("create-lobby-button");
    transition(createLobbyButton, "createLobby");
}

export function setTransitions() {
    loginButtonTransition();
    joinLobbyTransition();
    createLobbyTransition();
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
    button.addEventListener('click', throttle(async e => {
        const username_box = document.getElementById("username-textfield");
        const username = username_box.value;
        const inputChatID = getInputChatID(signInType);

        const signIn = functions.httpsCallable('signIn');

        const obj = await signIn({username: username, chatID: inputChatID, signInType: signInType});

        const data = obj.data;
        console.log(data);
        if (data.usernameError || data.createLobbyError || data.joinLobbyError) {
            renderLogin(data.usernameError, data.usernameErrorMessage, data.createLobbyError, data.createLobbyErrorMessage, data.joinLobbyError, data.joinLobbyErrorMessage);
        } else {
            renderChat(data.chatID, data.username);
        }
    }, 2000)
    );
}

function throttle(func, timeFrame) {
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
