import React from 'react';
import YouTube from 'react-youtube';

// https://youtu.be/dQw4w9WgXcQ

export default class Room extends React.Component {
    videoReady(event) {
        // access to player in all event handlers via event.target
        event.target.pauseVideo();
    }
    render() {
        const opts = {
            height: '390',
            width: '640',
            playerVars: { // https://developers.google.com/youtube/player_parameters
                autoplay: 1
            }
        };

        return (
            <div className="Room">
            <YouTube
                videoId="dQw4w9WgXcQ"
                opts={opts}
                onReady={this.videoReady}
            />
            </div>
        );
    }
}
