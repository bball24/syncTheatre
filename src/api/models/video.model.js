var mongoUtil = require( '../mongo.util' );

class Video{
    constructor(videoURL){
        this.videoID = null;
        this.videoURL = videoURL;
        this.videoStart = null;
        this.videoEnd = null;

        this.db = mongoUtil.getConnection();
    }

    // ----- Databasing Methods ---------

    toJson(){
        return {
            videoID : this.videoID,
            videoURL : this.videoURL,
            videoStart : this.videoStart,
            videoEnd : this.videoEnd
        }
    }

    save(){
        return new Promise((resolve, reject) => {
            let video = this.toJson()
            this.db.collection("videos").insertOne(video, (err, result) => {
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

    // ---- Custom Video Functionality ---

    // Returns start and end times
    getTimes(){

    }

    play(){

    }

    pause(){

    }

    seek(){

    }
}
