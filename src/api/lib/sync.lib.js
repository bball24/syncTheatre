/**
 * Created by brett on 5/1/19.
 */

const RoomModelFactory = require('../models/room.model').RoomModelFactory;

const DEBUG_OUTPUT = false;
const socketLog = (output) => {
    if(DEBUG_OUTPUT){
        console.log("--->[WS] :: " + output);
    }
}

const getRoomName = (roomID) => {
    return 'syncRoom' + roomID;
}

const isPartyLeader = (roomID, userID) => {
    return new Promise((resolve, reject) => {
        RoomModelFactory.getRoom(roomID)
        .then((room) => {
            if(Number(room.partyLeaderID) == Number(userID)){

                resolve(true);
            }
            else{
                resolve(false);
            }
        })
        .catch((err) => {
            reject(err);
        })
    });
};

module.exports = {

    // Request Event Handlers
    connected : () => {
        socketLog('>[WS] :: New client connected.');
    },

    join: (roomID, userID, client, socket) => {
        let roomName = 'syncRoom' + roomID
        client.join(roomName);
        client.userID = userID;
        socketLog(">[WS][join] Room " + roomName);
        RoomModelFactory.getRoom(roomID).then((room) => {
            room.joinUser(userID);
            return RoomModelFactory.updateRoom(roomID, room.toJson());
        })
        .then((room) => {
            socket.to(getRoomName(roomID)).emit('updateUsers');
        })
        .catch((err) => {
            console.error(err);
        })
    },

    customDisconnect : (userID, roomID, socket) => {
        socketLog('>[WS][customDC] :: user ' + userID + ' disconnected from room ' + roomID);
        RoomModelFactory.getRoom(roomID).then((room) => {
            room.disconnectUser(userID);
            return RoomModelFactory.updateRoom(roomID, room.toJson());
        })
        .then((room) => {
            socket.to(getRoomName(roomID)).emit('updateUsers');
        })
        .catch((err) => {
            console.error(err);
        })
    },

    sync : (roomID, userID, curTime) => {
        //socketLog('>[WS][sync] :: from ' + userID + ' at ' + curTime);
    },

    reqVideo : (roomID, client) => {
        socketLog('>[WS][reqVideo] :: sending resVideo event to client');
        RoomModelFactory.getRoom(roomID).then((room) => {
            let youtubeID = room.getCurrentVideo();
            client.emit('resVideo', youtubeID);
        })
        .catch((err) => {
            console.error(err);
        });

    },

    //@TODO
    loadVideo : () => {
        socketLog('>[WS][loadVideo] :: ');
    },

    //@TODO
    changeSpeed : () => {
        socketLog('>[WS][changeSpeed]');
    },


    playVideo : (roomID, userID, client) => {
        isPartyLeader(roomID, userID)
        .then((isLeader) => {
            if(isLeader){
                socketLog('>[WS][playVideo] :: in roomID:' + roomID);
                client.to(getRoomName(roomID)).broadcast.emit('playVideo');
            }
        })
        .catch((err) => {
            console.error(err);
        })

    },

    pauseVideo : (roomID, userID, client) => {
        isPartyLeader(roomID, userID)
        .then((isLeader) => {
            if(isLeader){
                socketLog('>[WS][pauseVideo] :: in roomID:' + roomID);
                client.to(getRoomName(roomID)).broadcast.emit('pauseVideo');
            }
        })
        .catch((err) => {
            console.error(err);
        })

    },

    seekVideo : (roomID, userID, time, client) => {
        isPartyLeader(roomID, userID)
        .then((isLeader) => {
            if(isLeader){
                socketLog('>[WS][pauseVideo] :: from roomID: ' + roomID);
                client.to(getRoomName(roomID)).broadcast.emit('seekVideo', time);
            }
        })
        .catch((err) => {
            console.error(err);
        })
    },

    doneVideo : (roomID, userID, socket) => {
        socketLog('>[WS][doneVideo] :: from userID ' + userID + " in roomID: " + roomID);
        isPartyLeader(roomID, userID)
        .then((isLeader) => {
            if(isLeader){
                RoomModelFactory.getRoom(roomID)
                .then((room) => {
                    room.dequeueVideo();
                    let nextVideo = room.getCurrentVideo();
                    socketLog('>[WS][loadVideo] emmit.');
                    socket.to(getRoomName(roomID)).emit('loadVideo', nextVideo);
                    //client.broadcast.emit('loadVideo', nextVideo);

                    return RoomModelFactory.updateRoom(roomID, room.toJson());
                })
                .then(() => {

                })
                .catch((err) => {
                    console.error(err);
                })
            }
        })
        .catch((err) => {
            console.error(err);
        })
    },

    updateQueue: (roomID, userID, socket) => {
        socket.to(getRoomName(roomID)).emit('updateQueue');
        RoomModelFactory.getRoom(roomID).then((room) => {
            let videoID = room.getCurrentVideo();
        })
        .catch((err) => {
            console.error(err);
        })
    },

    chatMessage: (roomID, userID, socket, message) => {
        socketLog("[chatMessage] received in room " + roomID + " from user " + userID + " (" + message +")");
        socket.to(getRoomName(roomID)).emit('chatMessage', userID, message);
    }


}