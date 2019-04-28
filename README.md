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







