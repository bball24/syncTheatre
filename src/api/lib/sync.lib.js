/**
 * Created by brett on 5/1/19.
 */

const RoomModelFactory = require('../models/room.model').RoomModelFactory;

const getRoomName = (roomID) => {
    return 'syncRoom' + roomID;
}

const isPartyLeader = (roomID, userID) => {
    return new Promise((resolve, reject) => {
        console.log(RoomModelFactory);
        RoomModelFactory.getRoom(roomID)
        .then((room) => {
            console.log(room.partyLeaderID + " AND " + userID);
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

    reqVideo : (client) => {
        console.log('[h][reqVideo] :: sending resVideo event to client');
        client.emit('resVideo', 'test#123abc');
    },

    sync : (roomID, userID, curTime) => {
        //console.log('[h][sync] :: from ' + userID + ' at ' + curTime);
    },

    // Response Event Emitters

    resVideo : (client) => {

    },

    playVideo : (roomID, userID, client) => {
        console.log('[e][playVideo] :: in roomID:' + roomID);
        isPartyLeader(roomID, userID)
        .then((isLeader) => {
            if(isLeader){
                client.to(getRoomName(roomID)).broadcast.emit('playVideo');
            }
            else{
                console.log(userID + " tried to send a command in roomID: " + roomID);
            }
        })
        .catch((err) => {
            console.error(err);
        })

    },

    loadVideo : () => {
      console.log('[e][loadVideo] :: ');
    },

    pauseVideo : (roomID, userID, client) => {
        console.log('[e][pauseVideo] :: in roomID:' + roomID);
        isPartyLeader(roomID, userID)
        .then((isLeader) => {
            if(isLeader){
                client.to(getRoomName(roomID)).broadcast.emit('pauseVideo');
            }
            else{
                console.log(userID + " tried to send a command in roomID: " + roomID);
            }
        })
        .catch((err) => {
            console.error(err);
        })

    },

    seekVideo : (roomID, userID, time, client) => {
        console.log('[e][pauseVideo] :: from roomID: ' + roomID);
        isPartyLeader(roomID, userID)
        .then((isLeader) => {
            if(isLeader){
                client.to(getRoomName(roomID)).broadcast.emit('seekVideo', time);
            }
            else{
                console.log(userID + " tried to send a command in roomID: " + roomID);
            }
        })
        .catch((err) => {
            console.error(err);
        })
    },

    changeSpeed : () => {
        console.log('[e][changeSpeed]');
    }
}