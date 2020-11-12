import React, { Component } from 'react';

import DailyIframe from '@daily-co/daily-js';

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import './ChatV2.css';
import {auth, db, rt_db, functions, firebase} from '../services/firebase';


export default class LobbyApp extends Component {
    constructor(props) {
        super(props);

        this.state = {
            chatID: this.props.chatID,
            userID: auth.currentUser.uid,
            username: this.props.username,
            
            queueReady: this.props.queueReady,
            participants: {},
            numParticipants: 0,
        };

        this.handleLogout = this.handleLogout.bind(this);

        this.getParticipants = this.getParticipants.bind(this);
        this.changeQueueStatus = this.changeQueueStatus.bind(this);
        this.changeConnectionStatus = this.changeConnectionStatus.bind(this);
        this.addAllListeners = this.addAllListeners.bind(this);

        this.addAllListeners();
    }

    render() {
        return (
            <div class="full-frame">
                <LobbyFrame queueReady={this.state.queueReady} handleLogout={this.handleLogout} handleQueueChange={this.changeQueueStatus}/>
                <ChatFrame chatID={this.state.chatID} userID={this.state.userID} username={this.props.username} initTime={new Date()}/>
                <VideoFrame videoCallURL="https://hogpub.daily.co/test"/>
            </div>
        );
    }

    addAllListeners() {
        this.getParticipants();
        this.changeConnectionStatus();
    }

    getParticipants() {
        const ref = db.collection("chats").doc(this.state.chatID).collection("participants").orderBy("timestamp");
        ref.onSnapshot(collection => {
            var participants = {};
            var numParticipants = 0;

            collection.forEach(doc => {
                const data = doc.data();
                participants[data.user_id] = data.username;

                numParticipants += 1;
            });

            this.setState({
                numParticipants: numParticipants,
                participants: participants,
            })
        });
    }

    changeConnectionStatus() {
        firebase.database().ref('users/' + this.state.userID + "/is_disconnected").set(false); // ayoooo dont change baby girl
        var presenceRef = rt_db.ref("users/" + this.state.userID + "/is_disconnected");     
        presenceRef.onDisconnect().set(true);
    }

    async changeQueueStatus() {
        await db.collection("chats").doc(this.state.chatID).update({
            queue_ready: !this.state.queueReady
        })
        this.setState({
            queueReady: !this.state.queueReady,
        });
    }

    // this deletes from local participants, need to delete from DATABASE
    async handleLogout() {
        const deleteInfo = functions.httpsCallable('deleteUserInfo')
        await deleteInfo({userId: this.state.userID, chatId: this.state.chatID, username: this.state.username}).then(result => { // CORS error that wasn't there earlier
        })
        .catch(function (error) {
            console.log(error);
        });
    
        auth.signOut().then(() => {
        })
        .catch(function (error) {
            console.log("ERROR:", error);
        })
    }

}

class LobbyFrame extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div class="lobby-frame">
                {this.hogPub()}
                {this.misc()}
            </div>
        );
    }

    hogPub() {
        return (
            <div class="hog-pub-box">
                <h1 class="hog-pub-header">The Pub</h1>
                <h2 class="lobby-title">Among Us</h2>
            </div>

        );
    }

    misc() {
        return (
            <div class="misc-box">
                {this.startQueueButton()}
                {this.lobbyInfoBox()}
                {this.leaveLobbyButton()}
            </div>
        );
    }

    startQueueButton() {
        return (
            <Button class="start-queue-button" onClick={this.props.handleQueueChange}>
                <p class="start-queue-text">{this.getQueueButtonMessage()}</p>
            </Button>
        );
    }

    leaveLobbyButton() {
        return (
            <Button class="leave-lobby-button" onClick={this.props.handleLogout}>
                <p class="leave-lobby-text">Leave Lobby</p>
            </Button>
        );
    }

    lobbyInfoBox() {
        return (
            <div class="lobby-info-box">
                <h3 class="lobby-info-header">Lobby Info</h3>
                <div class="lobby-info-text">
                    <p class="random-stuff">Random stuff</p>
                </div>
            </div>
        );
    }

    getQueueButtonMessage() {
        return this.props.queueReady ? "Stop Queue": "Start Queue";
    }
}

class ChatFrame extends Component {
    constructor(props) {
        super(props);

        this.state = {
            numMessagesSent: 0,
            numMessagesReceived: 0,
            messages: {},
            lastMessageTime: Math.floor(this.props.initTime.getTime() / 1000),
        }

        this.handleSendMessage = this.handleSendMessage.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
        this.makeMessageBubble = this.makeMessageBubble.bind(this);

        this.getMessages = this.getMessages.bind(this);
        this.addAllListeners = this.addAllListeners.bind(this);

        this.addAllListeners();
    }

    render() {
        return (
            <div class="chat-frame">
                {this.messages()}
                {this.sendMessageBox()}
            </div>
        );
    }

    // auto scroll down
    componentDidUpdate() {
        const scrollDiv = document.getElementById("dummyScroll");
        if (scrollDiv != null) {
            scrollDiv.scrollIntoView(true, { behavior: "smooth" });
        }
    }

    addAllListeners() {
        this.getMessages();
    }

    messages() {
        return (
            <div class="messages-frame">
                {this.makeMessages()}
                <div id="dummyScroll"></div>
            </div>
        );
    }

    makeMessages() {
        var messages = [];
        for (var key in this.state.messages) {
            messages.push(this.makeMessageBubble(key))
        }
        return messages;
    }

    makeMessageBubble(messageID) {
        function getFormattedTime(date) {
            var timeFormatted = date.toTimeString().substr(0,5);
            if (timeFormatted.substr(0, 2) <= 12) { // need to change 00:01 am to 12:01 am
                timeFormatted += " am";
            } else {
                timeFormatted = timeFormatted.substr(0, 2) % 12 + timeFormatted.substr(2, 5) + " pm";
            }
            return timeFormatted
        }

        function makeRealMessage(messageData, userID) {
            const messageClass = (messageData.userID == userID) ? "user-message" : "other-message";
            var date = new Date(messageData.timestamp.seconds * 1000);
            var timeFormatted = getFormattedTime(date);
            return (
                <div class={messageClass}>
                    <div class="message-bubble">
                        <div class="message-metadata">
                            <div class="message-username">{messageData.username}</div>
                            <div class="message-timestamp">{timeFormatted}</div>
                        </div>
                        <div class="message-content">
                            {messageData.content}
                        </div>
                    </div>
                </div>
            );
        }

        function makeStatusMessage(messageData, userID) {
            return (
                <div class="status-msg">
                    {messageData.content}
                </div>
            );
        }

        const messageData = this.state.messages[messageID];
        if (messageData.type == "user_content") {
            return makeRealMessage(messageData, this.props.userID);
        } else {
            return makeStatusMessage(messageData, this.props.userID);
        }
    }

    sendMessageBox() {
        return (
            <form class="send-message-form" onSubmit={this.handleSendMessage}>
                <TextField className="send-message-input" id="message-input" variant="outlined"
                 label="Enter a message" fullWidth={true} autoComplete="off"></TextField>
            </form>
        );
    }

    getMessages() {
        const ref = db.collection("chats").doc(this.props.chatID).collection("messages").orderBy("timestamp", "desc").limit(1);
        ref.onSnapshot(collection => {
            collection.forEach(doc => {
                const data = doc.data();
                    this.setState({
                        messages: {
                            ...this.state.messages,
                            [this.state.numMessagesReceived + 1]: data,
                        },
                        numMessagesReceived: this.state.numMessagesReceived + 1,
                        lastMessageTime: data.timestamp.seconds,
                    });
            });
        });
    }

    handleSendMessage(event) {
        event.preventDefault();
        const inputForm = document.getElementById("message-input");
        const message = inputForm.value;
        inputForm.value = "";
        if (message != "") {
            this.setState({
                numMessagesSent: this.state.numMessagesSent + 1,
            });
            this.sendMessage(message);
        }
    }

    sendMessage(message) {
        db.collection("chats/").doc(this.props.chatID).collection("messages/").add({
            content: message,
            timestamp: new Date(),
            userID: this.props.userID,
            username: this.props.username,
            messageNumber: this.state.numMessagesSent,
            type: "user_content",
        });
        db.collection("chats").doc(this.props.chatID).update({
            last_message_time: new Date(),
        });
    }
}

class VideoFrame extends Component {
    constructor(props) {
        super(props);

        this.joinCall = this.joinCall.bind(this);

        this.addDisconnectListener = this.addDisconnectListener.bind(this);
        this.addListeners = this.addListeners.bind(this);
    }

    render() {
        return (
            <div class="video-frame" id="video-frame">
                {this.joinButton()}
            </div>
        );
    }

    joinButton() {
        const style = {

          };

        return (
            <Button className="join-video-button" id="join-video-button" variant="contained" color="primary" style={style} onClick={this.joinCall}>
                <p class="join-video-text">Join Voice and Video!</p>
            </Button>
        );
    }

    joinCall() {
        const style = {
            iframeStyle: {
                position: "fixed",
                left: "60%",
                width: "40%",
                height: "100%",
                borderWidth: 0,

            },
            showLeaveButton: true,
            showFullscreenButton: true,
        };
        const callFrame = DailyIframe.createFrame(style);
        callFrame.join({url: this.props.videoCallURL});

        this.addListeners(callFrame);
    }

    addListeners(callFrame) {
        this.addDisconnectListener(callFrame);
    }

    addDisconnectListener(callFrame) {
        callFrame.on("left-meeting", (event) => {
            
        })
    }
}