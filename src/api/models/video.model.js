const mongoUtil = require( '../mongo.util' );
const qs = require('querystring');

class Video{
    constructor(videoURL, userID){
        this.videoURL = videoURL;
        this.videoID = "";
        this.userID = userID;

        this.parseVideoURL();
    }

    // ----- Databasing Methods ---------

    toJson(){
        return {
            videoURL : this.videoURL,
            videoID : this.videoID
        };
    }

    save(){
        return new Promise((resolve, reject) => {
            let video = this.toJson();
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

    parseVideoURL(){
        let strippedURL = this.videoURL.replace(/^.*\?/, '');
        let parse = qs.parse(strippedURL);
        this.videoID = parse.v;
    }

    getVideoID(){
        return this.videoID;
    }

}

module.exports = Video;
