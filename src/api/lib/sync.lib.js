/**
 * Created by brett on 5/1/19.
 */
const RoomModelFactory = require('../models/room.model').RoomModelFactory;
const UserModel = require('../models/user.model');

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
        socketLog('[connected] New client connected.');
    },

    join: (roomID, userID, client, socket) => {
        let roomName = 'syncRoom' + roomID
        client.join(roomName);
        client.userID = userID;
        socketLog("[join] Room " + roomName);
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
        socketLog('[customDC] :: user ' + userID + ' disconnected from room ' + roomID);
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

    sync : (roomID, userID, curTime, timeStamp, status, socket) => {
        isPartyLeader(roomID, userID)
        .then((isLeader) => {
            if(isLeader){
                socketLog('[playVideo] :: in roomID:' + roomID);
                socket.to(getRoomName(roomID)).emit('syncTime', curTime, timeStamp, status);
            }
        })
        .catch((err) => {
            console.error(err);
        })
    },

    reqVideo : (roomID, client) => {
        socketLog('[reqVideo] :: sending resVideo event to client');
        RoomModelFactory.getRoom(roomID).then((room) => {
            let youtubeID = room.getCurrentVideo();
            let partyLeaderID = room.partyLeaderID;
            client.emit('resVideo', youtubeID);
            client.emit('resLeader', partyLeaderID);

            if(room.status == 'PLAYING'){
                client.emit('playVideo');
            }
            else if(room.status == 'PAUSED'){
                client.emit('pauseVideo');
            }

        })
        .catch((err) => {
            console.error(err);
        });

    },

    //@TODO
    loadVideo : () => {
        socketLog('[loadVideo] :: ');
    },

    //@TODO
    changeSpeed : () => {
        socketLog('[changeSpeed]');
    },


    playVideo : (roomID, userID, client) => {
        isPartyLeader(roomID, userID)
        .then((isLeader) => {
            if(isLeader){
                socketLog('[playVideo] :: in roomID:' + roomID);
                client.to(getRoomName(roomID)).broadcast.emit('playVideo');
                RoomModelFactory.updateRoom(roomID, { roomStatus: 'PLAYING'})
                .then((room) => {

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

    pauseVideo : (roomID, userID, client) => {
        isPartyLeader(roomID, userID)
        .then((isLeader) => {
            if(isLeader){
                socketLog('[pauseVideo] :: in roomID:' + roomID);
                client.to(getRoomName(roomID)).broadcast.emit('pauseVideo');

                RoomModelFactory.updateRoom(roomID, { roomStatus: 'PAUSED'})
                .then((room) => {

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

    seekVideo : (roomID, userID, time, client) => {
        isPartyLeader(roomID, userID)
        .then((isLeader) => {
            if(isLeader){
                socketLog('[pauseVideo] :: from roomID: ' + roomID);
                client.to(getRoomName(roomID)).broadcast.emit('seekVideo', time);
            }
        })
        .catch((err) => {
            console.error(err);
        })
    },

    doneVideo : (roomID, userID, socket) => {
        socketLog('[doneVideo] :: from userID ' + userID + " in roomID: " + roomID);
        isPartyLeader(roomID, userID)
        .then((isLeader) => {
            if(isLeader){
                RoomModelFactory.getRoom(roomID)
                .then((room) => {
                    room.dequeueVideo();
                    let nextVideo = room.getCurrentVideo();
                    socketLog('[loadVideo] emmit.');
                    socket.to(getRoomName(roomID)).emit('loadVideo', nextVideo);

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

        let user= new UserModel(false);
        user.retrieve(userID)
        .then((user) => {
            socket.to(getRoomName(roomID)).emit('chatMessage', user.userName, userID, message);
        })
        .catch((err) => {
            console.error(err);
        })

    },

    leaderChange : (roomID, userID, newLeaderID, socket) => {
        socketLog("[leaderChange] UserID: " + userID +
                  " changed party leader in roomID:" + roomID +
                  " to new user: " + newLeaderID);

        isPartyLeader(roomID, userID)
        .then((isLeader) => {
            if (isLeader) {
                return RoomModelFactory.updateRoom(roomID, { partyLeaderID : newLeaderID })
            }
            else{
                throw({ error : "User" + userID + "is not leader in Room " + roomID})
            }
        })
        .then((room) => {
            socket.to(getRoomName(roomID)).emit('resLeader', newLeaderID);
            socket.to(getRoomName(roomID)).emit('updateUsers');
            socketLog("Emitting [resLeader]")
        })
        .catch((err) => {
            console.error(err);
        })
    },


}