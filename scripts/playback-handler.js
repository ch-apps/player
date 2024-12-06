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

function videoStarted() {
    var myvideo = document.getElementById("myvideo");
    var myaudio = document.getElementById("myaudio");
    //if(change_time_state){
    if (!forceSkipAudioToVideoSync) { //!forceSkipAudioToVideoSync
        //myaudio.currentTime = myvideo.currentTime;
        myaudio.currentTime = myvideo.currentTime - myaudio.duration*Math.floor(myvideo.currentTime/myaudio.duration);		// what if the video is longer then audio -> loop the audio then
        //console.log("DEBUG video time: " + myvideo.currentTime + ", audio time" + myaudio.currentTime);
        nearestBeatIndex = 0;
        clearTimeout(scheduledBeatSound);
        if (mediaTracks["beat"] && mediaTracks["beat"].length > actualTrack["audio"]) {
            actualTrack["beat"] = actualTrack["audio"]
            while (mediaTracks["beat"][actualTrack["audio"]].beatData.video[nearestBeatIndex].time < myaudio.currentTime+latency && nearestBeatIndex < mediaTracks["beat"][actualTrack["audio"]].beatData.video.length-1) {
                nearestBeatIndex++;
            }
            scheduledBeatSound = setTimeout(playBeatSound, (mediaTracks["beat"][actualTrack["audio"]].beatData.video[nearestBeatIndex].time - (myaudio.currentTime+latency))*1000);
        }
        allBeatsPlayed = false;
        change_time_state = false;
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
    change_time_state = true;
}

function mediaNext(sourceElementId, mediaElementID, mediaType) {
    if (mediaTracks[mediaType].length > actualTrack[mediaType]+1) {	//if it is already the last track, there is no next one
        actualTrack[mediaType] += 1;
    }
    if (mediaType === 'audio') {
        nearestBeatIndex = 0;
        allBeatsPlayed = false;
    }
    setMediaSource (sourceElementId, mediaElementID, mediaTracks[mediaType][actualTrack[mediaType]].source, true);
    change_time_state = true;
}

function mediaSpec(trackNumber, sourceElementId, mediaElementID, playlistElementID, mediaType, startToPlay = false) {
    if (mediaTracks[mediaType][trackNumber]) {
        actualTrack[mediaType] = trackNumber;
        if (mediaType === 'audio') {
            nearestBeatIndex = 0;
        }
        setMediaSource (sourceElementId, mediaElementID, mediaTracks[mediaType][actualTrack[mediaType]].source, startToPlay);
        change_time_state = true;
    }
}

function setMediaSource (sourceElementID, mediaElementID, sourceUrl, startToPlay = false) {
    document.getElementById(sourceElementID).src = sourceUrl;
    document.getElementById(mediaElementID).load();
    if (startToPlay) {
        document.getElementById(mediaElementID).play();
    }
}
  