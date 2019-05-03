let socketio = require('../sockets');
var mongoUtil = require( '../mongo.util' );
let UserModel = require('./user.model');
let snycLib = require('../lib/sync.lib');

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

    fromJson(doc){
        this.roomID = doc.roomID
        this.users = doc.users
        this.syncRoom = doc.syncRoom
        this.videoQueue = doc.videoQueue
        this.currentVideo = doc.currentVideo
        this.roomStatus = doc.roomStatus
        this.founderID = doc.founderID
        this.partyLeaderID = doc.partyLeaderID
        this.createdAt = doc.createdAt
    }

    /**
     * getFounderID
     * returns a promise to a founderID for the room.
     * If the founderID attribute is -1 a temporary user
     * is created and that userID is returned. If the founderID
     * is not -1, then the founderID is simply returned.
     * @returns {Promise} a promise to the founderID for the room.
     */
    getFounderID(){
        let self = this;
        return new Promise((resolve, reject) => {
            // if founderID was -1, then create a temp user for this person
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

    /**
     * create
     * Assumes that the room object does not exist in the database yet.
     * Creates a new record for the room in the database using the following sequence.
     *  1) if a founderID is not provided, creates a temp user and uses that userID as founderID
     *  2) Generates a roomID to use for the room
     *  3) Serializes the room by calling toJson()
     *  4) creates the record in the database
     * @returns {Promise} a promise to the newly created json document return by the DB
     */
    create(){
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


    /**
     * update
     * Assumes there is already a record in the database for this room.
     * Updates the room object in the database by re-writing the object
     * to the database using the attributes in toJson() to generate a new
     * object.It uses the roomID to search for the object in database, and update it.
     * @returns {Promise} a promise to a json object indicating successful update
     */
    update(doc){
        const self = this;
        return new Promise((resolve, reject) => {
            //update room model with the provided keys in doc passed in
            for(let key in doc){
                self[key] = doc[key];
            }
            let query = { roomID : this.roomID };
            let updateDoc = { $set : this.toJson() };
            this.db.collection('rooms').updateOne(query, updateDoc, (err, res) => {
                if(err) reject(err);
                resolve(self);
            })
        });
    }

    /**
     * retrieve
     * retrieves the associated record in the database for the given roomID
     * unserializes the object from the database by calling fromJson()
     * @param id - the roomID to search for in the database
     * @returns {Promise} a promise to the database record as a json object
     */
    retrieve(id){
        const self = this;
        return new Promise((resolve, reject) => {
            this.db.collection('rooms').findOne({roomID:Number(id)}, { projection: {_id:0}}, (err, doc) => {
                if(err){
                    reject(err);
                }

                if(doc){
                    self.fromJson(doc)
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
        roomSocket.in(this.syncRoom).on('reqVideo', snycLib.reqVideo);
        roomSocket.in(this.syncRoom).on('sync', snycLib.sync)
        setInterval(()=>{this.syncTick(roomSocket)}, 1500);
    }

    syncTick(socket){
        const url = 'https://www.youtube.com/watch?v=ussCHoQttyQ' + Date.now();
        socket.to(this.syncRoom).emit('PLAY', url);

        socket.on('requestVideo', () => {
            console.log("client requested video");
            socket.emit('sendVideo')
        })
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

class RoomModelFactory{
    static getRoom(id){
        return new Promise((resolve, reject) => {
            let room = new Room();
            room.retrieve(id).then((doc) => {
                resolve(room);
            })
            .catch((err) => {
                reject(err);
            })
        })
    }

    static getAllRooms(limit){
        return new Promise((resolve, reject) => {
            mongoUtil.getConnection().collection('rooms').find({},{ projection: {_id:0}}).limit(limit).toArray((err, docs) => {
                if(err){
                    reject(err);
                }
                else{
                    let rooms = []
                    docs.forEach((doc) => {
                        let r = new Room()
                        r.fromJson(doc);
                        rooms.push(r);
                    });
                    resolve(rooms);
                }
            })
        });
    }

    static updateRoom(id, doc){
        return new Promise((resolve, reject) => {
            let room = new Room();
            room.retrieve(id)
            .then((currentDoc) => {
                return room.update(doc)
            })
            .then((updatedModel) => {
                resolve(updatedModel)
            })
            .catch((err) => {
                reject(err);
            })
        });
    }

    static deleteRoom(id){
        return new Promise((resolve, reject) => {
            let query = { roomID : Number(id)};
            console.log(query);
            mongoUtil.getConnection().collection('rooms').deleteOne(query, (err, res) => {

                if(err){
                    reject(err);
                }
                else if(res.result.n === 0){
                    console.log(res.result);
                    reject(res.result);
                }
                else{
                    resolve(res.result);
                }
            })
        });
    }
}

module.exports = {
    RoomModel : Room,
    RoomModelFactory : RoomModelFactory
};