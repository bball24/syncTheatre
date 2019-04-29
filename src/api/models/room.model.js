var mongoUtil = require( '../mongo.util' );

// room model code would go in here
class Room {
    constructor(){
        this.founderID = null;
        this.roomID = null;
        this.webSocket = null;
        this.users = [];
        this.videoQueue = [];
        this.currentVideo = null;
        this.roomStatus = null;
        this.partyLeaderID = null;
        this.createdAt = null;

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
            webSocket : this.webSocket,
            users : this.users,
            videoQueue : this.videoQueue,
            currentVideo : this.currentVideo,
            roomStatus : this.roomStatus,
            founderID : this.founderID,
            partyLeaderID : this.partyLeaderID,
            createdAt : this.createdAt
        };
    }

    // ----- Databasing Methods ---------
    save(){
        return new Promise((resolve, reject) => {
            this.generateRoomID().then((roomID) => {
                this.roomID = roomID;
                let room = this.toJson();
                this.db.collection("rooms").insertOne(room, (err, result) => {
                    if(err){
                        reject(err);
                    }
                    else{
                        resolve(result.ops.pop());
                    }
                });
            })
            .catch((err) => {
                reject(err)
            })

        })
    }

    retrieve(id){
        return new Promise((resolve, reject) => {
            this.db.collection('rooms').findOne({roomID:Number(id)}, (err, doc) => {
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

    connectUser(userID){

    }


    getPartyLeaderID(){

    }

    getFounderID(){

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