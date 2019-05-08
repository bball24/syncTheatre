let mongoUtil = require( '../mongo.util' );

class User {
    constructor(isGuest){
        this.userID = null;
        this.userName = "";
        this.passwordHash = "";
        this.createdAt = Date.now();
        this.rooms = [];
        this.isGuest = isGuest;
        this.oauthID = "";
        this.oauthURL = "";

        this.db = mongoUtil.getConnection();
    }

    registerUser(oauthID, oauthURL){
        this.oauthID = oauthID;
        this.oauthURL = oauthURL;
    }

    // ----- Databasing Methods ---------

    generateUserID(){
        return mongoUtil.getNextID("userID");
    }

    toJson(){
        return {
            userID : this.userID,
            userName : this.userName,
            passwordHash : this.passwordHash,
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
        this.passwordHash = doc.passwordHash;
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
                    if(user.isGuest){
                        user.userID = userID
                        user.userName = "AnonUser#" + user.userID;
                        user.passwordHash = "*";
                    }

                    this.db.collection("users").insertOne(user, (err, result) => {
                        if(err){
                            reject(err);
                        }
                        else{
                            user = result.ops.pop();
                            resolve({
                                userID : user.userID,
                                userName : user.userName,
                                isGuest : user.isGuest
                            });
                        }
                    });
                })
                .catch((err) => {
                    reject(err);
                })
            }
        })
    }

    retrieve(){

    }

    // ---- Custom User Functionality ---

    getRooms(){

    }

}

module.exports = User;