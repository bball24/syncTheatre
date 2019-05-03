/**
 * Created by brett on 4/29/19.
 */

//from https://stackoverflow.com/questions/9709912/separating-file-server-and-socket-io-logic-in-node-js

const socketio = require('socket.io');
let roomSocket;

module.exports = {
    listen : function(app){
        let io = socketio.listen(app);
        roomSocket = io.of('/rooms');

        roomSocket.on('connection', (client) => {
            console.log('New client connected to rooms socket.')

            /** join Event
             * joins a room specified by roomID
             */
            client.on("join", (roomID) => {
                let roomName = 'syncRoom' + roomID
                client.join(roomName);
                console.log("[join] Room " + roomName);

                //print roomName
                //console.log(Object.keys(client.rooms));
            });

        })

        return io;
    },

    getRoomSocket : function(){
        return roomSocket;
    }
}
