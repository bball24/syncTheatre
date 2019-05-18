/**
 * Created by brett on 5/3/19.
 */

export default class SyncLib {
    constructor(roomID, userID, socket){
        this.roomID = roomID;
        this.userID = userID;
        this.player = null;
        this.socket = socket;
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
        if(youtubeID !== ""){
            event.target.loadVideoById(youtubeID, 0, "default");
        }
        else{
            event.target.loadVideoById('otHnRgZUs2I', 0, "default")
        }
        event.target.pauseVideo();

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

    loadVideo(video){
        console.log('loading video:' + video)
        this.player.loadVideoById(video.videoID, 0, "default");
    }

    updateQueue(component){
        console.log('updating room queue');
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
}
