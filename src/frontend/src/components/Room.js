import React from 'react';
import YouTube from 'react-youtube';
import openSocket from 'socket.io-client';
import SyncLib from '../lib/sync-lib';

// https://youtu.be/dQw4w9WgXcQ

export default class Room extends React.Component {

    constructor(props){
        super(props);
        console.log(this.props)
        const roomID = this.props.match.params.roomID;
        const userID = this.props.userID;

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
        this.videoReady = this.videoReady.bind(this);

        //socket even handlers
        socket.on('connect', () => {lib.connect()});
        socket.on('loadVideo', (videoID) => {lib.loadVideo(videoID)});
        socket.on('error', (err) => {lib.onError(err)});
        socket.on('changeSpeed', (speed) => {lib.changeSpeed(speed)});
        socket.on('playVideo', () => {lib.playVideo()});
        socket.on('pauseVideo', () => {lib.pauseVideo()});
        socket.on('seekVideo', (time) => {lib.seekVideo(time)});


        this.state = {
            roomID : roomID,
            userID : userID,
            videoID : 'otHnRgZUs2I',
            socket : socket,
            lib : lib,
            player : null,
        };
    }

    videoReady(event) {
        // access to player in all event handlers via event.target
        event.target.pauseVideo();
        this.state.lib.setPlayer(event.target);
    }

    render() {
        const opts = {
            height: '390',
            width: '640',
            playerVars: { // https://developers.google.com/youtube/player_parameters
                autoplay: 1
            }
        };

        return (
            <div className="Room">
            <YouTube
                videoId={this.state.videoID}
                opts={opts}
                onReady={this.videoReady}
                onPlay={this.state.lib.onPlay}
                onPause={this.state.lib.onPause}
                onEnd={this.state.lib.onEnd}
                onError={this.state.lib.onError}
            />
            </div>
        );
    }
}
