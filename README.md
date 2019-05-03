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


### Routes Information

**index**

- `GET /api/`

**rooms**

- `GET /api/rooms/` get all room
- `GET /api/rooms/:id` get one room
- `POST /api/rooms/` create room
- `PUT /api/rooms/:id` update one room
- `DELETE /api/rooms/:id` delete one room

**videos**

- `GET /api/videos/` get all videos
- `GET /api/videos/:id` get one video
- `POST /api/videos/` create video
- `PUT /api/videos/:id` update one video
- `DELETE /api/videos/:id` delete one video

**users**

- `GET /api/users/` get all users
- `GET /api/users/:id` get one user
- `POST /api/users/` create one user
- `PUT /api/users/:id` update one user
- `DELETE /api/users/:id` delete one user


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









