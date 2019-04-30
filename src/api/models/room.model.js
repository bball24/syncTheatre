let socketio = require('../sockets');
var mongoUtil = require( '../mongo.util' );
let UserModel = require('./user.model');

const RoomStatus = {
    NEW : 'new',
    ACTIVE : 'active',
    DELETING: 'deleting'
};

// room model code would go in here
class Room {
    constructor(){
        this.roomID = null;

        this.founderID = null;
        this.partyLeaderID = null;
        
        this.syncRoom = null;
        this.users = [];
        this.videoQueue = [];
        this.currentVideo = "";
        this.roomStatus = RoomStatus.NEW;
        this.createdAt = Date.now();

        this.db = mongoUtil.getConnection();
        this.viewOptions = [
            'roomID',
            'founderID',
            'webSocket',
            'users',
            'videoQueue',
            'currentVideo',
            'roomStatus',
            'partyLeaderID',
            'createdAt'
        ];
    }

    generateRoomID(){
        return mongoUtil.getNextID("roomID")
    }

    // ---- Utility Functions -----------
    toJson(){
        return {
            roomID : this.roomID,
            users : this.users,
            syncRoom : this.syncRoom,
            videoQueue : this.videoQueue,
            currentVideo : this.currentVideo,
            roomStatus : this.roomStatus,
            founderID : this.founderID,
            partyLeaderID : this.partyLeaderID,
            createdAt : this.createdAt
        };
    }

    getFounderID(){
        let self = this;
        return new Promise((resolve, reject) => {
            // if founderID was not given, then create a temp user for this person
            if (self.founderID === -1) {
                new UserModel(true).save()
                .then((userDoc) => {
                    resolve(userDoc.userID);
                })
                .catch((err) => {
                    reject({ error: err, message : "Could not create temp user"});
                })
            }
            else {
                // User was a registered user, we can just use his ID!
                resolve(self.founderID);
            }
        });
    }

    // ----- Databasing Methods ---------
    save(){
        let self = this;
        return new Promise((resolve, reject) => {
            self.getFounderID()
            .then((founderID) => {
                self.founderID = founderID;
                self.partyLeaderID = founderID;
                return self.generateRoomID();
            })
            .then((roomID) => {
                self.roomID = roomID;
                self.syncRoom = 'syncRoom' + roomID;
                let room = self.toJson();
                self.db.collection("rooms").insertOne(room, { projection: {_id:0}}, (err, result) => {
                    if(err) reject(err);
                    else resolve(result.ops.pop());
                });
            })
            .catch((err) => {
                reject(err)
            })
        })
    }

    retrieve(id){
        return new Promise((resolve, reject) => {
            this.db.collection('rooms').findOne({roomID:Number(id)}, { projection: {_id:0}}, (err, doc) => {
                if(err){
                    reject(err);
                }

                if(doc){
                    resolve(doc)
                }
                else{
                    reject("Doc with id "+ id+ "was not found.");
                }

            })
        });
    }

    // ---- Custom Room Functionality ---

    connectSocket(){
        const roomSocket = socketio.getRoomSocket()
        roomSocket.to(this.syncRoom).emit('MSG', "Hello World");
        setInterval(()=>{this.syncTick(roomSocket)}, 1500);
    }

    syncTick(socket){
        const url = 'https://www.youtube.com/watch?v=ussCHoQttyQ' + Date.now();
        socket.to(this.syncRoom).emit('PLAY', url);
    }

    getPartyLeaderID(){

    }

    getCurrentVideo(){

    }

    enqueueVideo(videoID){

    }

    removeVideo(videoID){

    }

    swapVideosInQueue(videoID1, videoID2){

    }

    getRoomStatus(){

    }

    getCreationDate(){

    }

}

module.exports = Room;