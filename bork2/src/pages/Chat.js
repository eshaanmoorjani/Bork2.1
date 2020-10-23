import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {auth, db, firebase} from '../services/firebase';

import './Chat.css';
import { BorkHeader } from './Login';
import { Button } from 'react-bootstrap';

class ChatApp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            chatID: "0",
            userID: auth.currentUser.uid,
            messages: {
                "1": {
                    message: "I am dogshit at VALORANT",
                    username: "Vijen",
                    userID: auth.currentUser.uid,
                    time: "5:35 pm",
                },
                "2": {
                    message: "I agree.",
                    username: "Drmoor",
                    userID: "2222",
                    time: "5:36 pm",
                }
            }, // messageID: {message: "a", username: "vijen", userID: "q3d8ds", time: "12:08:2032"}
        };
    }
    
    makeChat() {
        return (<section class="msger">
            <header class="msger-header">
                <div class="msger-header-title">
                <i class="fas fa-comment-alt"></i> Bork.cc
                </div>
                <div class="msger-header-options">
                <span><i class="fas fa-cog"></i></span>
                </div>
            </header>

            <main class="msger-chat">    
                {this.makeAllMessages()}
            </main>

            <form class="msger-inputarea">
                <input type="text" id="input" class="msger-input" placeholder="Send a message, you cunt"/>
                <Button type="submit" class="msger-send-btn" onClick={handleClick(this.state.chatID, this.state.userID)}>Send</Button>
            </form>
            </section>
        );
    }

    makeMessageBubble(messageID) {
        const messageData = this.state.messages[messageID];
        var rightOrLeft = "";
        if (messageData["userID"] == this.state["userID"]) {
            rightOrLeft = "msg right-msg";
        } else {
            rightOrLeft = "msg left-msg";
        }
        return (
            <div class={rightOrLeft}>
                <div class="msg-bubble">
                    <div class="msg-info">
                        <div class="msg-info-name">{messageData.username}</div>
                        <div class="msg-info-time">{messageData.time}</div>
                    </div>

                    <div class="msg-text">
                        {messageData.message}
                    </div>
                </div>
            </div>
        );
    }

    makeAllMessages() {
        var allMessages = [];
        for (var key in this.state.messages) {
            allMessages.push(this.makeMessageBubble(key))
        }
        return allMessages;
    }

    render() {
        return this.makeChat(this.state.messages);
    }
}

function handleClick(chatID, userID) {
    console.log("YOU SHOULD SEE ME")
    function handleClickForReal() {
        const message = document.getElementById("input").value;
        console.log("MESSAGE: ", message);
        console.log("USERID: ", userID);

        db.collection("chats/").doc(chatID).collection("messages/").add({
            content: message,
            timestamp: "12:12:00",
            userID: userID,
            username: "vijen the peejen",
        });
    }
    return handleClickForReal;
}

export default ChatApp;



// const userID = auth.currentUser.uid;
//         // create database listener to check if a user has been assigned a room
//         db.collection("users/").doc(userID).onSnapshot(function(doc) {
//             const chatID = doc.get("chat_id");
//             this.state = {
//                 chatID: "0", //chatID
//                 userID: userID,
//                 messages: db.collection("chats/").doc(chatID).get("messages"),
//          }