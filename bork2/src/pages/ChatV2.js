import React, { Component } from 'react';

import DailyIframe from '@daily-co/daily-js';

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import { auth, db, rt_db, functions } from '../services/firebase';

import './ChatV2.css';
import { throttle } from './LoginFirebase';


export default class LobbyApp extends Component {
    constructor(props) {
        super(props);

        this.state = {
            chatID: this.props.chatID,
            userID: auth.currentUser.uid,
            username: this.props.username,
            
            lobbyType: null,
            lobbyOpen: null,

            participants: {},
            numParticipants: 0,
        };
        
        this.setLobbySettings();

        this.handleLogout = this.handleLogout.bind(this);

        this.getParticipants = this.getParticipants.bind(this);
        this.handleLobbyStatusChange = this.handleLobbyStatusChange.bind(this);
        this.changeConnectionStatus = this.changeConnectionStatus.bind(this);
        this.addAllListeners = this.addAllListeners.bind(this);

        this.addAllListeners();
    }

    render() {
        return (
            <div class="full-frame">
                <LobbyFrame chatID={this.state.chatID} lobbyType={this.state.lobbyType} lobbyOpen={this.state.lobbyOpen}
                 numParticipants={this.state.numParticipants} participants={this.state.participants}
                 handleLogout={throttle(this.handleLogout, 10000)} handleLobbyStatusChange={this.handleLobbyStatusChange}/>

                <ChatFrame chatID={this.state.chatID} userID={this.state.userID} username={this.props.username} initTime={new Date()}/>

                <VideoFrame ref="videoFrame" videoCallURL={`https://hogpub.daily.co/${this.state.chatID}`}/>
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
            });
        });
    }

    async setLobbySettings() {
        const chat = await db.collection("chats").doc(this.state.chatID).get();
        this.setState({
            lobbyOpen: chat.data().lobby_open,
            lobbyType: chat.data().lobby_type,
        });
    }

    changeConnectionStatus() {
        rt_db.ref('users/' + this.state.userID + "/is_disconnected").set(false); 
        var presenceRef = rt_db.ref("users/" + this.state.userID + "/is_disconnected");     
        presenceRef.onDisconnect().set(true);
    }

    async handleLobbyStatusChange() {
        await db.collection("chats").doc(this.state.chatID).update({
            lobby_open: !this.state.lobbyOpen,
        }); 
        this.setState({
            lobbyOpen: !this.state.lobbyOpen,
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

        // disconnect from the video call using the VideoFrame class's method
        this.refs.videoFrame.disconnect();
        
        auth.signOut()
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
                {this.openLobbyButton()}
                {this.lobbyInfoBox()}
                {this.leaveLobbyButton()}
            </div>
        );
    }

    openLobbyButton() {
        return (
            <Button class="start-queue-button" onClick={this.props.handleLobbyStatusChange}>
                <p class="start-queue-text">{this.getLobbyButtonMessage()}</p>
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
                    {this.showLobbyID()}
                    <p class="num-participants">Lobby Capacity: {this.props.numParticipants}/10</p>
                </div>
            </div>
        );
    }

    showLobbyID() {
        if (this.props.lobbyType === "Premade") {
            return <p class="lobby-id">Lobby ID: {this.props.chatID}</p>
        }
    }

    getLobbyButtonMessage() {
        if (this.props.lobbyType === "Premade") {
            return this.props.lobbyOpen ? "Leave queue" : "Join queue";
        } else {
            return this.props.lobbyOpen ? "Close Lobby" : "Open Lobby";
        }
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
            <div class="chat-frame-no-video" id="chat-frame">
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
        const send = functions.httpsCallable('sendMessage');
        const success = send({message: message, chatID: this.props.chatID, username: this.props.username, messageNumber: this.state.numMessagesSent});
    }
}

class VideoFrame extends Component {
    constructor(props) {
        super(props);

        this.state = {
            callFrame: null,
        };

        this.joinCall = this.joinCall.bind(this);
        this.makeCallFrame = this.makeCallFrame.bind(this);
        this.joinButton = this.joinButton.bind(this);

        this.addDisconnectListener = this.addDisconnectListener.bind(this);
        this.addListeners = this.addListeners.bind(this);
    }

    render() {
        return (
            <div class="video-frame-no-video" id="video-frame">
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
        this.makeCallFrame();

        this.state.callFrame.join({url: this.props.videoCallURL});

        this.addListeners();
        this.cssYesVideo();
    }

    makeCallFrame() {
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
        console.log(callFrame);
        this.state.callFrame = callFrame;
        console.log(this.state.callFrame);
    }

    addListeners() {
        this.addDisconnectListener();
    }

    addDisconnectListener() {
        this.state.callFrame.on("left-meeting", (event) => {
            this.state.callFrame.destroy();
            this.cssNoVideo();
        })
    }

    disconnect() {
        if (this.state.callFrame !== null) {
            this.state.callFrame.leave();
        }
    }

    cssYesVideo() {
        const chatFrame = document.getElementById("chat-frame");
        const videoFrame = document.getElementById("video-frame");
        chatFrame.setAttribute("class", "chat-frame-yes-video");
        videoFrame.setAttribute("class", "video-frame-yes-video");
    }

    cssNoVideo() {
        const chatFrame = document.getElementById("chat-frame");
        const videoFrame = document.getElementById("video-frame");
        chatFrame.setAttribute("class", "chat-frame-no-video");
        videoFrame.setAttribute("class", "video-frame-no-video");
    }
}