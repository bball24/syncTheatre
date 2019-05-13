let mongoUtil = require( '../mongo.util' );

class User {
    constructor(isGuest){
        this.userID = null;
        this.userName = "";
        this.createdAt = Date.now();
        this.rooms = [];
        this.isGuest = isGuest;
        this.oauthID = "";
        this.oauthURL = "";

        this.db = mongoUtil.getConnection();
    }

    registerUser(userName, oauthID, oauthURL){
        this.userName = userName;
        this.oauthID = oauthID;
        this.oauthURL = oauthURL;
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
        this.rooms = doc.rooms;
        this.isGuest = doc.isGuest;
        this.createdAt = doc.createdAt;
        this.oauthID = doc.oauthID;
        this.oauthURL = doc.oauthURL;
    }

    save(){
        return new Promise((resolve, reject) => {
            let user = this.toJson();
            if (!user.userID){
                this.generateUserID().then((userID) => {
                    user.userID = userID;
                    if(user.isGuest){
                        user.userName = "AnonUser#" + user.userID;
                        user.passwordHash = "*";
                    }

                    this.db.collection("users").insertOne(user, (err, result) => {
                        if(err){
                            reject(err);
                        }
                        else{
                            user = result.ops.pop();

                            if(user.isGuest){
                                resolve({
                                    userID : user.userID,
                                    userName : user.userName,
                                    isGuest : user.isGuest,
                                });
                            }
                            else{
                                resolve({
                                    userID : user.userID,
                                    userName : user.userName,
                                    isGuest : user.isGuest,
                                    oauthID : user.oauthID,
                                    oauthURL : user.oauthURL
                                });
                            }

                        }
                    });
                })
                .catch((err) => {
                    reject(err);
                })
            }
        })
    }

    retrieve(id){
        const self = this;
        return new Promise((resolve, reject) => {
            this.db.collection('user').findOne(
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