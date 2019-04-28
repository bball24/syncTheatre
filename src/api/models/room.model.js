var mongoUtil = require( '../mongo.util' );

// room model code would go in here
class Room {
    constructor(founderID){
        this.roomID = null;
        this.webSocket = null;
        this.users = [];
        this.videoQueue = [];
        this.currentVideo = null;
        this.roomStatus = null;
        this.founderID = founderID;
        this.partyLeaderID = founderID;
        this.createdAt = null;

        this.db = mongoUtil.getConnection();
    }

    // ---- Utility Functions -----------
    toJson(){
        return {
            roomId : this.roomID,
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
            let room = this.toJson()
            this.db.collection("rooms").insertOne(room, (err, result) => {
                if(err){
                    reject(err);
                }
                else{
                    resolve(result);
                }
            });
        })
    }

    retrieve(roomID){

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