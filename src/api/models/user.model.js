let mongoUtil = require( '../mongo.util' );
const RoomModel = require('./room.model').RoomModel;

class User {
    constructor(isGuest){
        this.userID = null;
        this.userName = "";
        this.createdAt = Date.now();
        this.rooms = [];
        this.roomName = "";
        this.roomID = null;
        this.isGuest = isGuest;
        this.oauthID = "";
        this.oauthURL = "";

        this.db = mongoUtil.getConnection();
    }

    registerUser(userName, oauthID, oauthURL){
        this.userName = userName;
        this.roomName = this.userName;
        this.oauthID = oauthID;
        this.oauthURL = oauthURL;

    }

    createPersistentRoom(userID){
        // create room and assign id back to the user object
        return new Promise((resolve, reject) => {
            let room = new RoomModel();
            room.founderID = userID;
            room.create().then((roomDoc) => {
                resolve(roomDoc.roomID);
            })
            .catch((err) => {
                reject(err);
            })
        });
    }

    changeRoomName(roomName){
        this.roomName = roomName;
    }

    joinRoom(roomID){
        this.rooms.push(roomID);
        // add userID to room as well
    }

    authenticateUser(){

    }

    // ----- Databasing Methods ---------

    generateUserID(){
        return mongoUtil.getNextID("userID");
    }

    toJson(){
        return {
            userID : this.userID,
            userName : this.userName,
            roomName : this.roomName,
            roomID : this.roomID,
            rooms : this.rooms,
            isGuest : this.isGuest,
            createdAt : this.createdAt,
            oauthID : this.oauthID,
            oauthURL : this.oauthURL
        }
    }

    fromJson(doc){
        this.userID = doc.userID;
        this.userName = doc.userName;
        this.roomName = doc.roomName;
        this.roomID = doc.roomID;
        this.rooms = doc.rooms;
        this.isGuest = doc.isGuest;
        this.createdAt = doc.createdAt;
        this.oauthID = doc.oauthID;
        this.oauthURL = doc.oauthURL;
    }

    createGuestUser(){
        const self = this;
        return new Promise((resolve, reject) => {
            if (!self.userID) {
                this.generateUserID()
                .then((userID) => {
                    self.userID = userID;
                    self.userName = "AnonUser#" + self.userID;

                    return self.save()
                })
                .then((guest) => {
                    resolve({
                        userID   : guest.userID,
                        userName : guest.userName,
                        isGuest  : guest.isGuest,
                    });
                })
                .catch((err) => {
                    reject(err);
                })
            }
        })
    }

    isValidUserName(){
        return new Promise((resolve, reject) => {
            if(this.userName){
                this.retrieveByName(this.userName)
                .then((user) => {
                    if(user){
                        // record found - userName NOT valid
                        resolve(false);
                    }
                    else{
                        // no records found - userName is valid
                        resolve(true);
                    }
                })
                .catch((err) => {
                    reject(err);
                })
            }
        })
    }

    createRegisteredUser(){
        const self = this;
        return new Promise((resolve, reject) => {
            if (!self.userID) {
                this.isValidUserName()
                .then((isValid) => {
                    console.log(isValid);
                    if(isValid){
                        return this.generateUserID();
                    }
                    else{
                        reject({ error : "The username: " + this.userName +" is already taken. Please choose a different user name."});
                    }
                })
                .then((userID) => {
                    self.userID = userID;
                    return this.createPersistentRoom(self.userID)
                })
                .then((roomID) => {
                    self.roomID = roomID;

                    return self.save();
                })
                .then((user) => {
                    resolve({
                        userID   : user.userID,
                        userName : user.userName,
                        roomName : user.roomName,
                        roomID   : user.roomID,
                        isGuest  : user.isGuest,
                        oauthID  : user.oauthID,
                        oauthURL : user.oauthURL
                    });
                })
                .catch((err) => {
                    reject(err);
                })
            }
        })
    }

    save(){
        return new Promise((resolve, reject) => {
            let user = this.toJson();
            this.db.collection("users").insertOne(user, (err, result) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(result.ops.pop())
                }
            })
        })
    }

    retrieveByName(userName){
        return new Promise((resolve, reject) => {
            const query = { $text : { $search : userName, $caseSensitive: false } }
            this.db.collection('users').findOne(query, (err, result) => {
                if(err){
                    reject(err);
                }
                if(result){
                    this.fromJson(result)
                    resolve(result)
                }
                else{
                    resolve(null)
                }
            })
        })
    }

    retrieve(id){
        const self = this;
        return new Promise((resolve, reject) => {
            this.db.collection('users').findOne(
                { userID : Number(id)},
                { projection: {_id:0}},
                (err, doc) => {
                    if(err){
                        reject(err);
                    }
                    if(doc){
                        self.fromJson(doc)
                        resolve(doc)
                    }
                    else{
                        reject({ error: "UserID: "+ id+ " was not found in retrieve."});
                    }
            })
        });

    }

    // ---- Custom User Functionality ---

    getRooms(){

    }

}

module.exports = User;