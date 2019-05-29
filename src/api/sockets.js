/**
 * Created by brett on 4/29/19.
 */

//from https://stackoverflow.com/questions/9709912/separating-file-server-and-socket-io-logic-in-node-js

const socketio = require('socket.io');
const syncLib = require('./lib/sync.lib');
let io;
let _client;
let socket;


module.exports = {
    listen : function(app){
        io = socketio.listen(app);
        socket = io.of('/rooms');
        let numClients = {};

        socket.on('connection', (client) => {
            syncLib.connected();
            let socketUserID;
            let socketRoomID;
            /** Sync Control Server Event Handlers **/
            // See documentation in README.md for the available events
            // https://stackoverflow.com/questions/24100218/socket-io-send-packet-to-sender-only/38933590
            client.on('join', (roomID, userID) => {
                socketUserID = userID;
                socketRoomID = roomID;
                syncLib.join(roomID, userID, client, socket)}
            );
            client.on('pauseVideo', (roomID, userID) => {syncLib.pauseVideo(roomID, userID, client)});
            client.on('playVideo', (roomID, userID) => {syncLib.playVideo(roomID, userID, client)});
            client.on('reqVideo', (roomID) => {syncLib.reqVideo(roomID, client)});
            client.on('sync', (roomID, userID, curTime, timeStamp, status) => { syncLib.sync(roomID, userID, curTime, timeStamp, status, socket)});
            client.on('seekVideo', (roomID, userID, time) => {syncLib.seekVideo(roomID, userID, time, client)});
            client.on('disconnect', (client) => {syncLib.customDisconnect(socketUserID, socketRoomID, socket)});
            client.on('doneVideo', (roomID, userID) => {syncLib.doneVideo(roomID, userID, socket)});
            client.on('updateQueue', (roomID, userID) => {syncLib.updateQueue(roomID, userID, socket)});
            client.on('sendMessage', (roomID, userID, message) => {syncLib.chatMessage(roomID, userID, socket, message)});
            client.on('leaderChange', (roomID, userID, newLeaderID) => {syncLib.leaderChange(roomID, userID, newLeaderID, socket)});
            client.on('latencyPing', () => {client.emit('latencyPong')});

            _client = client;
        });



        return io;
    },

    getSocket : function(){
        return socket;
    },

    getServer : function(){
        return io;
    }
}
