var mongoUtil = require( '../mongo.util' );

class User {
    constructor(name){
        this.userID = null;
        this.name = name;
        this.createdAt = null;
        this.rooms = []

        this.db = mongoUtil.getConnection();
    }

    // ----- Databasing Methods ---------

    toJson(){
        return {
            userID : this.userID,
            name : this.name,
            rooms : this.rooms,
            createdAt : this.createdAt
        }
    }

    save(){
        return new Promise((resolve, reject) => {
            let user = this.toJson()
            this.db.collection("users").insertOne(user, (err, result) => {
                if(err){
                    reject(err);
                }
                else{
                    resolve(result);
                }
            });
        })
    }

    retrieve(){

    }

    // ---- Custom User Functionality ---

    getRooms(){

    }
}