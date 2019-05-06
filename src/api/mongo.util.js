/**
 * Created by brett on 4/27/19.
 */

//https://stackoverflow.com/questions/24621940/how-to-properly-reuse-connection-to-mongodb-across-nodejs-application-and-module
const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017";

let _db;

module.exports  ={
    connect : (cb) => {
        MongoClient.connect(url, { useNewUrlParser: true }, (err, client) => {
            _db = client.db('syncApi');
            return cb( err );
        });

    },

    getConnection : () => {
        return _db;
    },

    getNextID : (sequenceName) => {
        return new Promise((resolve, reject) => {
            _db.collection('counters').findOneAndUpdate({_id: sequenceName },{$inc:{sequence_value:1}}, {
                    returnOriginal: false,
                    upsert: true
            }
            , (err, res) => {
                if(err) reject(err);
                resolve(res.value.sequence_value);
            });
        });


    }
};