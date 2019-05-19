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
        setInterval(() => {this.syncTick(this.socket)}, 1500);
    }

    syncTick(socket){
        socket.emit("sync", this.roomID, this.userID, Date.now());
    };

    connect(){
        this.socketLog('[Connected]');
        this.socket.emit('join', this.roomID, this.userID);
        //this.startSync();
    }

    onError(err){
        console.error(err);
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

    resLeader(partyLeaderID, chatBox, room){
        room.setState({
            curTime : this.player.getCurrentTime(),
            partyLeaderID : partyLeaderID
        });
        this.socketLog("[resLeader] received. Party leader is: " + partyLeaderID);
        chatBox.current.updateCurrentLeader(partyLeaderID);
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

    loadVideo(video, queue, room){
        room.setState({
            videoID : video.videoID
        });
        this.socketLog('[loadVideo] loading video:' + video);
        queue.current.updateQueue();
        if(video && video.videoID !== ""){
            this.socketLog(video);
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
