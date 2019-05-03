/**
 * Created by brett on 4/29/19.
 */

//from https://stackoverflow.com/questions/9709912/separating-file-server-and-socket-io-logic-in-node-js

const socketio = require('socket.io');
const syncLib = require('./lib/sync.lib');
let io;

module.exports = {
    listen : function(app){
        io = socketio.listen(app);
        let socket = io.of('/rooms');

        socket.on('connection', (client) => {
            console.log('>[WS] :: New client connected.')

            /** join Event
             * joins a room specified by roomID
             */
            client.on("join", (roomID) => {
                let roomName = 'syncRoom' + roomID
                client.join(roomName);
                console.log("[join] Room " + roomName);
            });

            client.on('pauseVideo', (roomID, userID) => {syncLib.pauseVideo(roomID, userID, client)});
            client.on('playVideo', (roomID, userID) => {syncLib.playVideo(roomID, userID, client)});
            client.on('reqVideo', () => {syncLib.reqVideo(client)});
            client.on('sync', (roomID, userID, curTime) => { syncLib.sync(roomID, userID, curTime)});
            client.on('seekVideo', (roomID, userID, time) => {syncLib.seekVideo(roomID, userID, time, client)});
        });





        return io;
    },

    getSocket : function(){
        return io;
    }
}
