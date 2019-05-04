/**
 * Created by brett on 5/3/19.
 */

function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m, key, value) {
        vars[key] = value;
    });
    return vars;
}

axios.post('http://localhost:3001/api/rooms/')
.then((room) => {
    let addVideo = {
        roomID : room.data.roomID,
        userID :room.data.founderID,
        videoURL : [
            "https://www.youtube.com/watch?v=5GCoc893Vt8&t=1552s",
            "https://www.youtube.com/watch?v=dza_frgrujw",
            "https://www.youtube.com/watch?v=LUO5qhpD2pA",
            "https://www.youtube.com/watch?v=OU0TaprKPRc"
        ]
    };
    return axios.post('http://localhost:3001/api/rooms/addVideo/', addVideo);
})
.then((room) => {
    let roomID, userID;

    let urlVars = getUrlVars();
    console.log(urlVars);
    if ('roomID' in urlVars){
        roomID = urlVars.roomID;
        userID = urlVars.userID;
    }
    else{
        roomID = room.data.roomID;
        userID = room.data.founderID;
    }

    console.log(roomID);
    console.log(userID);

    let socketURL = 'http://localhost:3001/rooms';
    let roomSocket = io.connect(socketURL);

    // Load the IFrame Player API code asynchronously.
    let tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    let firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    let lib = new SyncLib(roomID, userID, roomSocket);

    window.onYouTubeIframeAPIReady = () => {
        let player = new YT.Player('player', {
            height: '390',
            width: '640',
            videoId: 'ussCHoQttyQ',
            events: {
                'onReady': (event) => {lib.onPlayerReady(event)},
                'onStateChange': (event) => {lib.onPlayerStateChange(event)},
                'onError': (event) => {lib.onPlayerError(event)}
            }
        });

        lib.setPlayer(player, YT);
    }

    roomSocket.on('connect', () => {lib.connect()});
    roomSocket.on('loadVideo', (videoID) => {lib.loadVideo(videoID)});
    roomSocket.on('error', (err) => {lib.onError(err)});
    roomSocket.on('changeSpeed', (speed) => {lib.changeSpeed(speed)});
    roomSocket.on('playVideo', () => {lib.playVideo()});
    roomSocket.on('pauseVideo', () => {lib.pauseVideo()});
    roomSocket.on('seekVideo', (time) => {lib.seekVideo(time)});
})
.catch((err) => {
    console.error(err);
});



