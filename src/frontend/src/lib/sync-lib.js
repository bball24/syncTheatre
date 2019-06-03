/**
 * Created by brett on 5/3/19.
 */

const DEBUG_OUTPUT = true;

export default class SyncLib {
    constructor(roomID, userID, socket){
        this.roomID = roomID;
        this.userID = userID;
        this.player = null;
        this.socket = socket;
        this.startTime = null;
        this.latency = 0;   // in ms
        this.isPartyLead = false;
    }

    socketLog(output){
        if(DEBUG_OUTPUT){
            const prefix = "[WS] :: ";
            console.log('%c'+prefix + output, 'color:dodgerblue;');
        }
    }

    setPlayer(player){
        this.player = player;
    }

    startSync(){
        setInterval(() => {this.syncTick(this.socket)}, 1000);
    }

    setPartylead(isLead){
        this.isPartyLead = isLead;
    }

    syncTick(){

        if(this.isPartyLead){
            //if the user is a party leader, emit the current time of the video
            // as well as a timestamp back to the server. This is used for
            // syncing clients up to the party leader
            let playerState = this.player.getPlayerState();
            let status;
            if(playerState == 1){
                status = 'PLAYING';
            }
            else{
                status = 'PAUSED';
            }
            this.socket.emit('sync', this.roomID, this.userID, this.player.getCurrentTime(), Date.now(), status);
        }
    };

    latencyPong(){
        this.latency = Date.now() - this.startTime;
    }

    syncTime(hostTime, timeStamp, status){
        if(this.player && !this.isPartyLead){
            let lag = (Date.now() - timeStamp)/1000;
            let clientTime = this.player.getCurrentTime();
            let adjustedVideoTime = hostTime;
            let syncDiff = ((clientTime)/ adjustedVideoTime) * 100;

            if(syncDiff < 99 || syncDiff > 101){
                // not in 99 - 100
                this.player.setPlaybackRate(1);
                this.player.seekTo(adjustedVideoTime);
            }
            else if(syncDiff > 101){
                this.player.setPlaybackRate(0.5);
            }
            else if(syncDiff < 99){
                //in 99.0 - 99.5
                this.player.setPlaybackRate(1.5);
            }
            else{
                this.player.setPlaybackRate(1);
            }

            //sync the playback
            let playerState = this.player.getPlayerState();
            let playerStatus;
            if(playerState == 1){
                playerStatus = 'PLAYING';
            }
            else{
                playerStatus = 'PAUSED';
            }

            if(status != playerStatus){
                if(status == 'PLAYING'){
                    this.playVideo();
                }
                else{
                    this.pauseVideo();
                }
            }

            this.socketLog('[syncTime] hostTime: ' + adjustedVideoTime + ' | clientTime: ' + clientTime + ' | syncDiff: ' + syncDiff);
        }
    }

    connect(){
        this.socketLog('[Connected]');
        this.socket.emit('join', this.roomID, this.userID);
        this.startSync();
    }

    onError(err, videoID){
        console.error(err);
        console.error("[YOUTUBE ERR] :: videoID:" + videoID);
        if(err.data == '150' || err.data == '101'){
            console.log("The owner of this video has disabled embedded iFrame playback.");
            if(this.socket && this.isPartyLead){
                this.socket.emit('doneVideo', this.roomID, this.userID);
            }
        }
    }

    changeSpeed(speed){
        this.socketLog('[changeSpeed] change speed received speed: ' + speed);
    }

    resVideo(event, video){
        this.socketLog('[resVideo] youtubeID: ' + video + ' is being played in the room.');

        if(video && video.videoID !== ""){
            event.target.loadVideoById(video.videoID, 0, "default");
        }
        else{
            event.target.loadVideoById('otHnRgZUs2I', 0, "default")
        }
        event.target.pauseVideo();

    }

    resLeader(partyLeaderID, chatBox, room, queue){
        room.setState({
            curTime : this.player.getCurrentTime(),
            partyLeaderID : partyLeaderID
        });
        this.socketLog("[resLeader] received. Party leader is: " + partyLeaderID);
        if(chatBox){
            chatBox.current.updateCurrentLeader(partyLeaderID);
        }
        if(queue){
            queue.current.updateCurrentLeader(partyLeaderID);
        }

    }

    playVideo(){
        this.socketLog('[playVideo] play received');
        this.player.playVideo();
    }

    pauseVideo(){
        this.socketLog('[pauseVideo] pause received');
        this.player.pauseVideo();
    }

    seekVideo(time){
        this.socketLog('[seekVideo] seek received time: ' + time);
        this.player.seekTo(time);
    }

    loadVideo(video, queue, room, addVideo){
        room.setState({
            videoID : video.videoID
        });
        this.socketLog('[loadVideo] loading video:' + video);
        queue.current.updateQueue();
        if(addVideo){
            addVideo.current.setCurrentVideo(video)
        }
        if(video && video.videoID !== ""){
            this.socketLog(video);
            console.log(video);
            this.player.loadVideoById(video.videoID, 0, "default");
        }
        else{
            this.player.loadVideoById('otHnRgZUs2I', 0, "default");
        }
    }

    updateQueue(component){
        this.socketLog('[updateQueue] updating room queue');
        component.current.updateQueue();
    }

    onPlayerReady(event){
        this.socket.emit('reqVideo', this.roomID);
        this.socket.on('resVideo', (youtubeID) => {
            this.resVideo(event, youtubeID)
        });
    }

    onPlayerError(event){
        if(event.data != 2){
            console.error(event);
            this.socket.emit('doneVideo', this.roomID, this.userID);
        }
    }

    onPlay(){
        this.socket.emit('playVideo', this.roomID, this.userID);
        let curTime = this.player.getCurrentTime();
        this.socket.emit('seekVideo', this.roomID, this.userID, curTime)
    }

    onPause(){
        this.socket.emit('pauseVideo', this.roomID, this.userID);
        let curTime = this.player.getCurrentTime();
        this.socket.emit('seekVideo', this.roomID, this.userID, curTime)
    }

    onEnd(){
        this.socket.emit('doneVideo', this.roomID, this.userID);
    }

    chatMessage(userName, userID, message, chatBox){
        this.socketLog("[chatMessage] received: " + message);
        chatBox.current.addMessage(userName, userID, message);
    }

    updateUsers(chatBox){
        this.socketLog("[updateUsers] received")
        if(chatBox.current){
            chatBox.current.updateUserList();
        }

    }


}
