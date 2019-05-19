import React from 'react';
import YouTube from 'react-youtube';
import openSocket from 'socket.io-client';
import SyncLib from '../lib/sync-lib';
import AddVideo from './AddVideo';
import VideoQueue from './VideoQueue';
import ChatBox from './ChatBox';
import "./Room.scss"
import axios from "axios"

// https://youtu.be/dQw4w9WgXcQ

export default class Room extends React.Component {

    constructor(props){
        super(props);
        let roomID;

        // init room and userIDs. if roomID was passed in,
        // it's a permanent room and the roomID will not be
        // in the url params. Otherwise it will be and its a temp room.
        if(!this.props.roomID){ roomID = this.props.match.params.roomID;}
        else{ roomID = this.props.roomID; }
        let userID = this.props.userID;

        //component references
        this._videoQueueComponent = React.createRef();
        this._chatBox = React.createRef();

        //debug
        console.log({Page: 'Room', roomID: roomID, userID: userID});

        // connect to web socket
        const socketURL = 'http://localhost:3001/rooms';
        const socket = openSocket(socketURL);
        const lib = new SyncLib(roomID, userID, socket);

        //bindings - so that the lib can use it's own 'this'
        lib.onPlay = lib.onPlay.bind(lib);
        lib.onPause = lib.onPause.bind(lib);
        lib.onEnd = lib.onEnd.bind(lib);
        lib.onPlayerError = lib.onPlayerError.bind(lib);
        lib.onPlayerReady = lib.onPlayerReady.bind(lib);
        lib.loadVideo = lib.loadVideo.bind(lib);
        lib.seekVideo = lib.seekVideo.bind(lib);
        lib.pauseVideo = lib.pauseVideo.bind(lib);
        lib.playVideo = lib.playVideo.bind(lib);
        lib.resVideo = lib.resVideo.bind(lib);
        lib.changeSpeed = lib.changeSpeed.bind(lib);
        lib.onError = lib.onError.bind(lib);
        lib.connect = lib.connect.bind(lib);
        lib.syncTick = lib.syncTick.bind(lib);
        lib.startSync = lib.startSync.bind(lib);
        lib.setPlayer = lib.setPlayer.bind(lib);
        lib.resLeader = lib.resLeader.bind(lib);
        lib.chatMessage = lib.chatMessage.bind(lib);
        lib.updateUsers = lib.updateUsers.bind(lib);
        this.videoReady = this.videoReady.bind(this);

        //socket even handlers
        socket.on('connect', () => {lib.connect()});
        socket.on('loadVideo', (videoID) => {lib.loadVideo(videoID, this._videoQueueComponent, this)});
        socket.on('error', (err) => {lib.onError(err)});
        socket.on('changeSpeed', (speed) => {lib.changeSpeed(speed)});
        socket.on('playVideo', () => {lib.playVideo()});
        socket.on('pauseVideo', () => {lib.pauseVideo()});
        socket.on('seekVideo', (time) => {lib.seekVideo(time)});
        socket.on('updateQueue', () => {lib.updateQueue(this._videoQueueComponent)})
        socket.on('resLeader', (leadID) => {lib.resLeader(leadID, this._chatBox, this)});
        socket.on('chatMessage', (name, id, msg) => {lib.chatMessage(name, id, msg, this._chatBox)});
        socket.on('updateUsers', () => {lib.updateUsers(this._chatBox)});

        //init room state
        this.state = {
            roomID : roomID,
            userID : userID,
            videoID : 'otHnRgZUs2I',
            socket : socket,
            lib : lib,
            player : null,
            apiHost : this.props.apiHost,
            partyLeaderID: -1,
            founderID: -1
        };

    }

    videoReady(event) {
        // access to player in all event handlers via event.target
        event.target.pauseVideo();
        this.state.lib.setPlayer(event.target);
        this.state.lib.onPlayerReady(event);
        this.state.lib.seekVideo(this.state.curTime)
        this.state.lib.playVideo();
        console.log("it fired");
    }

    render() {
        // Options found here
        // https://developers.google.com/youtube/player_parameters
        let playerVars = {
            autoplay: 1,
            controls : 0,
            disablekb : 1,
            fs : 0,
            modestbranding: 1,
        }

        //user is party leader
        if(this.state.partyLeaderID === this.state.userID){
            playerVars.controls = 1;
            playerVars.disablekb = 0;
        }
        const opts = {
            height: '390',
            width: '640',
            playerVars: playerVars
        };

        return [
            <div className="Room" key="wrapper">
                <div className="YTWrapper">
                    <YouTube
                        className="YTWrapper"
                        key="video"
                        videoId={this.state.videoID}
                        opts={opts}
                        onReady={this.videoReady}
                        onPlay={this.state.lib.onPlay}
                        onPause={this.state.lib.onPause}
                        onEnd={this.state.lib.onEnd}
                        onError={this.state.lib.onError}
                    />
                </div>
                <ChatBox
                    className="ChatBox"
                    key="chat"
                    ref={this._chatBox}
                    apiHost = {this.state.apiHost}
                    userID={this.state.userID}
                    roomID={this.state.roomID}
                    socket={this.state.socket}
                    partyLeaderID={this.state.partyLeaderID}
                    founderID={this.state.founderID}
                />
            </div>,
            <VideoQueue
                key="queue"
                ref={this._videoQueueComponent}
                userID={this.state.userID}
                roomID={this.state.roomID}
                apiHost={this.state.apiHost}
            />,
            <AddVideo
                key="form"
                socket={this.state.socket}
                userID={this.state.userID}
                roomID={this.state.roomID}
                apiHost={this.state.apiHost}/>
        ];
    }
}
