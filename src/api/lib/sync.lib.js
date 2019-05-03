/**
 * Created by brett on 5/1/19.
 */

module.exports = {

    // Request Event Handlers

    reqVideo : () => {
        console.log('[h][reqVideo] :: ');
    },

    sync : (data) => {
        let curTime = data.curTime;
        let userID = data.userID;
        console.log('[h][sync] :: from ' + userID + ' at ' + curTime);
    },

    // Response Event Emitters

    resVideo : () => {
        console.log('[e][resVideo] :: ');
    },

    playVideo : () => {
        console.log('[e][playVideo] :: ');
    },

    loadVideo : () => {
      console.log('[e][loadVideo] :: ');
    },

    pauseVideo : () => {
        console.log('[e][pauseVideo] :: ');
    },

    seekVideo : () => {
        console.log('[e][pauseVideo] :: ');
    },

    changeSpeed : () => {
        console.log('[e][changeSpeed]');
    }
}