"use strict";
/**
 * Created by brett on 5/3/19.
 */

class SyncLib {
    constructor(roomID, userID, socket){
        this.roomID = roomID;
        this.userID = userID;
        this.player = null;
        this.YT = null;
        this.socket = socket;
    }

    setPlayer(player, YT){
        this.player = player;
        this.YT = YT;
    }

    startSync(){
        setInterval(() => {this.syncTick(roomSocket)}, 1500);
    }

    syncTick(socket){
        socket.emit("sync", this.roomID, this.userID, Date.now());
    };

    connect(){
        console.log('Connected');
        this.socket.emit('join', this.roomID, this.userID);
        //this.startSync();
    }

    onError(err){
        console.error(err);
    }

    changeSpeed(speed){
        console.log('[h][changeSpeed] change speed received speed: ' + speed);
    }

    resVideo(event, youtubeID){
        console.log('[h][resVideo] youtubeID: ' + youtubeID + ' is being played in the room.');
        event.target.loadVideoById(youtubeID, 0, "default");
    }

    playVideo(){
        console.log('[h][playVideo] play received');
        this.player.playVideo();
    }

    pauseVideo(){
        console.log('[h][pauseVideo] pause received');
        this.player.pauseVideo();
    }

    seekVideo(time){
        console.log('[h][seekVideo] seek received time: ' + time);
        this.player.seekTo(time);
    }

    loadVideo(videoID){
        console.log('loading video ID:' + videoID)
        this.player.loadVideoById(videoID, 0, "default");
    }

    onPlayerReady(event){
        event.target.pauseVideo();
        this.socket.emit('reqVideo', this.roomID);
        this.socket.on('resVideo', (youtubeID) => {this.resVideo(event, youtubeID)});
    }

    onPlayerError(event){
        if(event.data != 2){
            console.error(event);
            this.socket.emit('doneVideo', this.roomID, this.userID);
        }
    }

    onPlayerStateChange(event){
        if (event.data == this.YT.PlayerState.PLAYING){
            this.socket.emit('playVideo', this.roomID, this.userID);
            let curTime = this.player.getCurrentTime();
            this.socket.emit('seekVideo', this.roomID, this.userID, curTime)
        }
        if (event.data == this.YT.PlayerState.PAUSED){
            this.socket.emit('pauseVideo', this.roomID, this.userID);
            let curTime = this.player.getCurrentTime();
            this.socket.emit('seekVideo', this.roomID, this.userID, curTime)
        }
        if (event.data == this.YT.PlayerState.ENDED){
            this.socket.emit('doneVideo', this.roomID, this.userID);
        }
    }
}


