const mongoUtil = require( '../mongo.util' );
const qs = require('querystring');
const axios = require('axios');

class Video{
    constructor(videoURL, userID){
        this.videoURL = videoURL;
        this.videoID = "";
        this.userID = userID;
        this.youtubeAPIKey = 'AIzaSyAhSWmEyo5fFeQ5U7SRbrznQfRICGP2Zz8'
        //this.youtubeAPIKey = 'AIzaSyADBtaDACU6KGQjJQ-oXsMtouAq7Ke3RuY';

        if(this.videoURL !== ""){
            this.parseVideoURL();
        }
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

    setVideoID(videoID){
        this.videoID = videoID;
    }

    getVideoDetails(){
        return new Promise((resolve, reject) => {
            const baseUrl = "https://www.googleapis.com/youtube/v3/videos";
            const part = "?part=snippet";
            const videoID = "&id=" + this.videoID;
            const apiKey = "&key="+ this.youtubeAPIKey;
            const url = baseUrl + part + videoID + apiKey;
            axios.get(url).then((data) => {
                console.log('[YOUTUBE REQ] videoID: ' + this.videoID);
                const details = {
                    thumb : data.data.items[0].snippet.thumbnails.default,
                    title : data.data.items[0].snippet.title,
                    videoID : this.videoID
                }
                resolve(details);
            })
            .catch((err) => {
                console.error(err.response);
                reject({error : "GET failed to Youtube Data API"});
            })
        })

    }

}


module.exports = Video;
