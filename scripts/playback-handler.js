/**
 * Functions that handle media playback
 */

function playBeatSound() {
    document.getElementById("clickSound").pause();
    document.getElementById("clickSound").currentTime = 0;
    document.getElementById("clickSound").play();
}

function changeVolume(amount, id) {
    var objectToChangeVolume = document.getElementById(id);
    objectToChangeVolume.volume = amount;
}

function createTimeUpdateListener(endTime) {
    timeUpdateListener = function onTimeUpdate(event) {
        if (myvideo.currentTime >= endTime) {
            //forceSkipAudioToVideoSync = true;
            //mediaNext('vdSRC', 'myvideo', 'video');
            const endedEvent = new Event('ended');
            this.dispatchEvent(endedEvent);
            myvideo.removeEventListener('timeupdate', onTimeUpdate);
        }
    };
    return timeUpdateListener;
}

function videoStarted() {
    var myvideo = document.getElementById("myvideo");
    var myaudio = document.getElementById("myaudio");
    // handle start-time and stop-time (if provided for the video)
    if (timeUpdateListener) { // Remove previous stop-time event listener (if exist/was set and not removed by itself - e.g nextMedia was called before stop-time was reached)
        myvideo.removeEventListener('timeupdate', timeUpdateListener);
    }
    const [, paramString] = mediaTracks["video"][actualTrack["video"]].source.split('?');
    const params = new URLSearchParams(paramString); // return type is Array of Strings
    var paramStart = 0;
    if (params.has('start')) {
        paramStart = Number(params.get('start'));
        if (myvideo.currentTime < paramStart) {
            myvideo.currentTime = paramStart;
        }
    }
    if (params.has('stop')) {
        const timeUpdateListener = createTimeUpdateListener(Number(params.get('stop')));
        myvideo.addEventListener('timeupdate', timeUpdateListener);
    }
    //if(change_time_state){
    if (!forceSkipAudioToVideoSync) { //!forceSkipAudioToVideoSync
        //myaudio.currentTime = myvideo.currentTime;
        myaudio.currentTime = (myvideo.currentTime - paramStart) - myaudio.duration * Math.floor(myvideo.currentTime / myaudio.duration);		// what if the video is longer then audio -> loop the audio then
        //console.log("DEBUG video time: " + myvideo.currentTime + ", audio time" + myaudio.currentTime);
        nearestBeatIndex = 0;
        nearestMessageIndex = 0;
        clearTimeout(scheduledBeatSound);
        // Locate Beat Index
        if (mediaTracks["beat"] && mediaTracks["beat"].length > actualTrack["audio"]) {
            actualTrack["beat"] = actualTrack["audio"]
            while (mediaTracks["beat"][actualTrack["audio"]].beatData.video[nearestBeatIndex].time < myaudio.currentTime + latency && nearestBeatIndex < mediaTracks["beat"][actualTrack["audio"]].beatData.video.length - 1) {
                nearestBeatIndex++;
            }
            scheduledBeatSound = setTimeout(playBeatSound, (mediaTracks["beat"][actualTrack["audio"]].beatData.video[nearestBeatIndex].time - (myaudio.currentTime + latency)) * 1000);
        }
        allBeatsPlayed = false;
        // Locate Message Index
        if (mediaTracks["beat"] && mediaTracks["beat"].length > actualTrack["audio"] && mediaTracks["beat"][actualTrack["audio"]].beatData.messages.length > 0) {
            while (mediaTracks["beat"][actualTrack["audio"]].beatData.messages[nearestMessageIndex].fromTime < myaudio.currentTime + latency && nearestMessageIndex < mediaTracks["beat"][actualTrack["audio"]].beatData.messages.length - 1) {
                nearestMessageIndex++;
            }
        }
        //change_time_state = false;
        //}
    }
    myaudio.play();
    forceSkipAudioToVideoSync = false;	//reset to initial valu (i.e. to sync audio to video

}

function videoPaused() {
    var myvideo = document.getElementById("myvideo");
    var myaudio = document.getElementById("myaudio");
    myaudio.pause();
    clearTimeout(scheduledBeatSound);
    //change_time_state = true;
}

function mediaNext(sourceElementId, mediaElementID, mediaType) {

    document.getElementById(mediaElementID).src = document.getElementById(mediaElementID + "Buffer").src;
    document.getElementById(mediaElementID).play();
    actualTrack[mediaType] = bufferedTrack[mediaType];
    bufferedTrack[mediaType] = getNextTrackIndex(mediaType);
    preloadBufferVideo(mediaElementID + "Buffer", mediaTracks[mediaType][bufferedTrack[mediaType]].source);
    if (mediaType === 'audio') {
        nearestBeatIndex = 0;
        nearestMessageIndex = 0;
        allBeatsPlayed = false;
    }
    //setMediaSource (sourceElementId, mediaElementID, mediaTracks[mediaType][actualTrack[mediaType]].source, true);
    //change_time_state = true;
}

function mediaSpec(trackNumber, sourceElementId, mediaElementID, playlistElementID, mediaType, startToPlay = false) {
    if (mediaTracks[mediaType][trackNumber]) {
        actualTrack[mediaType] = trackNumber;
        if (mediaType === 'audio') {
            nearestBeatIndex = 0;
            nearestMessageIndex = 0;
        }
        setMediaSource(sourceElementId, mediaElementID, mediaTracks[mediaType][actualTrack[mediaType]].source, startToPlay);
        bufferedTrack[mediaType] = getNextTrackIndex(mediaType);
        preloadBufferVideo(mediaElementID + "Buffer", mediaTracks[mediaType][bufferedTrack[mediaType]].source);
        //change_time_state = true;
    }
}

function setMediaSource(sourceElementID, mediaElementID, sourceUrl, startToPlay = false) {
    document.getElementById(mediaElementID).src = sourceUrl;
    document.getElementById(mediaElementID).load();

    if (startToPlay) {
        document.getElementById(mediaElementID).play();
    }
}

// Function to preload the next video
function preloadBufferVideo(mediaElementID, sourceUrl) {
    document.getElementById(mediaElementID).src = sourceUrl;
    document.getElementById(mediaElementID).load(); // Start buffering the next video
};

function getNextTrackIndex(mediaType) {
    var nextTrackIndex = -1;
    if (mediaTracks[mediaType].length > actualTrack[mediaType] + 1) {	//if it is already the last track, there is no next one so start from beginning
        nextTrackIndex = actualTrack[mediaType] + 1;
    } else {
        nextTrackIndex = 0;
    }
    return nextTrackIndex;
}
