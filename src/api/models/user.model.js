let mongoUtil = require( '../mongo.util' );

class User {
    constructor(isGuest){
        this.userID = null;
        this.userName = "";
        this.passwordHash = "";
        this.createdAt = Date.now();
        this.rooms = [];
        this.isGuest = isGuest;

        this.db = mongoUtil.getConnection();
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
            createdAt : this.createdAt
        }
    }

    save(){
        return new Promise((resolve, reject) => {
            let user = this.toJson();
            if (!user.userID){
                this.generateUserID().then((userID) => {
                    if(user.isGuest){
                        user.userID = userID
                        user.userName = "AnonUser#" + this.userID;
                        user.passwordHash = "*";
                    }

                    this.db.collection("users").insertOne(user, (err, result) => {
                        if(err){
                            reject(err);
                        }
                        else{
                            resolve(result.ops.pop());
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