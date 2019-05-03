/**
 * Created by brett on 5/1/19.
 */

const RoomModelFactory = require('../models/room.model').RoomModelFactory;

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

    join: (roomID, userID, client) => {
        let roomName = 'syncRoom' + roomID
        client.join(roomName);

        console.log(">[WS][join] Room " + roomName);
        RoomModelFactory.getRoom(roomID).then((room) => {
            return RoomModelFactory.updateRoom(roomID, room.toJson());
        })
        .catch((err) => {
            console.error(err);
        })
    },

    customDisconnect : (client) => {
        console.log('>[WS][customDC] :: Client disconnected');


    },

    sync : (roomID, userID, curTime) => {
        //console.log('>[WS][sync] :: from ' + userID + ' at ' + curTime);
    },

    reqVideo : (roomID, client) => {
        console.log('>[WS][reqVideo] :: sending resVideo event to client');
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
        console.log('>[WS][loadVideo] :: ');
    },

    //@TODO
    changeSpeed : () => {
        console.log('>[WS][changeSpeed]');
    },


    playVideo : (roomID, userID, client) => {
        isPartyLeader(roomID, userID)
        .then((isLeader) => {
            if(isLeader){
                console.log('>[WS][playVideo] :: in roomID:' + roomID);
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
                console.log('>[WS][pauseVideo] :: in roomID:' + roomID);
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
                console.log('>[WS][pauseVideo] :: from roomID: ' + roomID);
                client.to(getRoomName(roomID)).broadcast.emit('seekVideo', time);
            }
        })
        .catch((err) => {
            console.error(err);
        })
    },

    doneVideo : (roomID, userID, socket) => {
        console.log('>[WS][doneVideo] :: from userID ' + userID + " in roomID: " + roomID);
        isPartyLeader(roomID, userID)
        .then((isLeader) => {
            if(isLeader){
                RoomModelFactory.getRoom(roomID)
                .then((room) => {
                    room.dequeueVideo();
                    let nextVideo = room.getCurrentVideo();
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
    }


}