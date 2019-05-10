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
            console.log('>[WS] :: New client connected.')

            /** Sync Control Server Event Handlers **/
            // See documentation in README.md for the available events
            // https://stackoverflow.com/questions/24100218/socket-io-send-packet-to-sender-only/38933590
            client.on('join', (roomID, userID) => {syncLib.join(roomID, userID, client)});
            client.on('pauseVideo', (roomID, userID) => {syncLib.pauseVideo(roomID, userID, client)});
            client.on('playVideo', (roomID, userID) => {syncLib.playVideo(roomID, userID, client)});
            client.on('reqVideo', (roomID) => {syncLib.reqVideo(roomID, client)});
            client.on('sync', (roomID, userID, curTime) => { syncLib.sync(roomID, userID, curTime)});
            client.on('seekVideo', (roomID, userID, time) => {syncLib.seekVideo(roomID, userID, time, client)});
            client.on('disconnect', (client) => {syncLib.customDisconnect(client)});
            client.on('doneVideo', (roomID, userID) => {syncLib.doneVideo(roomID, userID, socket)});
            client.on('updateQueue', (roomID, userID) => {syncLib.updateQueue(roomID, userID, socket)});
            client.on('sendMessage', (roomID, userID, message) => {syncLib.chatMessage(roomID, userID, socket, message)});

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
