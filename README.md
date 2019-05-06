# syncTheatre
CS 180 Project

## Backend API Docs

The following is documentation for the back-end

### Requirements

You must install The following to run the API

- Node.js (v10+) [Install](https://nodejs.org/en/download/)
- MongoDB [Install](https://docs.mongodb.com/manual/installation/)


### Running the API

To get the API up and running perform the following steps

Install all node dependencies with npm.
`npm install`

Make sure your MongoDB service is running
`sudo service mongod restart`


Then start the API
`npm start`

**Note:** MongoDb Short Usage Guide [Here](https://github.com/bball24/syncTheatre/blob/master/src/api/notes/mongodb.md)


### Routes Information

**index**

- `GET /api/`

**rooms**

`GET /api/rooms/` - Get all rooms  
Making an HTTP GET request to `http://localhost:3001/api/rooms/` returns  
```
[
  {
    "roomID": 1,
    "users": [],
    "syncRoom": "syncRoom1",
    "videoQueue": [],
    "currentVideo": "5GCoc893Vt8",
    "roomStatus": "new",
    "founderID": 1,
    "partyLeaderID": 1,
    "createdAt": 1556942476737
  },
    {
      "roomID": 2,
      "users": [],
      "syncRoom": "syncRoom2",
      "videoQueue": [],
      "currentVideo": "",
      "roomStatus": "new",
      "founderID": 1,
      "partyLeaderID": 1,
      "createdAt": 1556942476737
    },
]
```

`GET /api/rooms/:id` - Get one room  
Making an HTTP GET request to `http://localhost:3001/api/rooms/1` returns  
```
{
  "roomID": 1,
  "users": [],
  "syncRoom": "syncRoom1",
  "videoQueue": [],
  "currentVideo": "",
  "roomStatus": "new",
  "founderID": 1,
  "partyLeaderID": 1,
  "createdAt": 1556942476737
}
```

`POST /api/rooms/` - create room  
If you know the userID of the user making the request you should post the following object  

```
{
	"founderID" : <userID>
}
```

Making an HTTP POST request to `http://localhost:3001/api/rooms/`  
 and optionally including the body described above creates a room and returns  
```
{
  "roomID": 1,
  "users": [],
  "syncRoom": "syncRoom1",
  "videoQueue": [],
  "currentVideo": "",
  "roomStatus": "new",
  "founderID": 1,
  "partyLeaderID": 1,
  "createdAt": 1556939184819,
  "_id": "5ccd01b054e3312d3f06d661"
}
```

`PUT /api/rooms/:id` -  update one room  
You can include any valid fields you want in the body of the request. In the
example given below the partyLeaderID and the state of the videoQueue are updated.
The fields you choose to update **overwrite** the existing data.  

Example PUT Body  
```
{
  "partyLeaderID": 2,
  "videoQueue": ["123", "456"]
}
```

Making an HTTP PUT request to `http://localhost:3001/api/rooms/2`
with the body described above updates room 2 and returns  
```
{
  "roomID": 2,
  "users": [],
  "syncRoom": "syncRoom2",
  "videoQueue": [
    "123",
    "456"
  ],
  "currentVideo": "",
  "roomStatus": "new",
  "founderID": 1,
  "partyLeaderID": 2,
  "createdAt": 1556847868804
}
```

`DELETE /api/rooms/:id` - delete one room  
Deletes the room specified by roomID.  
Making an HTTP DELETE request to `http://localhost:3001/api/rooms/2`
deletes room with roomID 2 and returns  
```
{
  "n": 1,
  "ok": 1
}
```

- `n` indicates the number of records deleted
- `ok` (boolean) indicates success.

## SyncControl Protocol

### Request Events  
The *server* has a handler for each of these events. The client *sends* these events to the server.  

`join`  
data: `<number>` room ID   
Response: none  
Description: joins a room specified by roomID. Client socket can now listen to all events on the room.  

`reqVideo`  
data: none  
Response: `<event> resVideo`  
Description: prompts the server to emit a resVideo event, which returns  

`sync`  
data: `<object> { curTime : <number>, userID: <number> }`  
Response: none  
Description: Handles a sync event by recording the time the user is at on the video.  


### Response Events  
The *client* should have a handler for each of these events. The *server* sends these events to the client.  

`resVideo`  
data: `<string>` youtube Video ID  
Description: Server emits an event containing the currently playing youtube video ID.

`playVideo`  
data: none  
Description: An event alerting the clients that they should play the youtube player

`loadVideo`  
data: `<string>` youtube video ID  
description: An event alerting the clients that they should load the video id in data.

`pauseVideo`  
data : none  
description: An event alerting the clients that they should pause the player.

`seekVideo`  
data : `<number>` time to seek the player to.  
Description: An event alerting the clients that they should seek to time in data.

`changeSpeed`  
data: `<number>` the modifier to set the player speed to  
Description: An event alerting the clients to change their playback speed to modifier in data.

`doneVideo`  
data : `<number>` userID  
Description: An event alerting the server that the user as specified by userID has completed.
