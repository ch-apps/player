/**
 * Functions that handle playlist entries
 */

async function enqueuePlaylist(input) {
	if (input.files && input.files[0]) {
		var obj = await readJSONFile(input.files[0]);
		mediaTracks = ({video: [], audio: [], beat: []});
		//INFO
		if (obj.info) {
			document.getElementById("playerInfoBoard").innerHTML = obj.info;
		}
		//VIDEO
		if (obj.videoFilesURL && obj.videoFilesURL[0]) {
			for (var i = 0; i < obj.videoFilesURL.length; i++) {
				document.getElementById("vdSRC").src = obj.videoFilesURL[i];
				document.getElementById("myvideo").load()
				mediaTracks["video"].push({name: obj.videoFilesURL[i], duration: 0, source: obj.videoFilesURL[i]});
			}
			refreshMediaPlayList(mediaTracks["video"], "vdSRC", "myvideo", "pllstInsrtVIDEO", "video");
			mediaSpec(0, "vdSRC", "myvideo", "pllstInsrtVIDEO", "video");
		}
		//AUDIO
		if (obj.audioFilesURL && obj.audioFilesURL[0]) {
			for (var i = 0; i < obj.audioFilesURL.length; i++) {
				document.getElementById("adSRC").src = obj.audioFilesURL[i];
				document.getElementById("myaudio").load()
				mediaTracks["audio"].push({name: obj.audioFilesURL[i], duration: 0, source: obj.audioFilesURL[i]});
			}
			refreshMediaPlayList(mediaTracks["audio"], "adSRC", "myaudio", "pllstInsrtAUDIO", "audio");
			mediaSpec(0, "adSRC", "myaudio", "pllstInsrtAUDIO", "audio");
		}
		//BEATS
		if (obj.beatFilesURL && obj.beatFilesURL[0]) {
			for (var i = 0; i < obj.beatFilesURL.length; i++) {
				// DO THE STUFF
				//var textContentObj = await getFileContent(obj.beatFilesURL[i]);	//OPTION .json file 
				var textContentObj = await readJSFile(obj.beatFilesURL[i]);	//OPTION .js file 
				if (textContentObj) {
					//var beatObj = JSON.parse(textContentObj);	//OPTION .json file 
					//mediaTracks["beat"].push({name: obj.beatFilesURL[i], duration: beatObj.video[beatObj.video.length-1].time, source: obj.beatFilesURL[i], beatData: beatObj});		//OPTION .json file 
					if (textContentObj.video) {	//OPTION .js file 
						mediaTracks["beat"].push({name: obj.beatFilesURL[i], duration: textContentObj.video[textContentObj.video.length-1].time, source: obj.beatFilesURL[i], beatData: textContentObj});	//OPTION .js file 
					} else {	//OPTION .js file 
						var autoGenBD = generateBeatData(textContentObj.tempoInBPM, textContentObj.notesPerBeat, textContentObj.firstNoteTime, textContentObj.songLength);	//OPTION .js file 
						mediaTracks["beat"].push({name: obj.beatFilesURL[i], duration: textContentObj.songLength, source: obj.beatFilesURL[i], beatData: autoGenBD});	//OPTION .js file 
					}	//OPTION .js file 
					
				}
			}
			refreshMediaPlayList(mediaTracks["beat"], "none", "none", "pllstInsrtBEATS", "beat", true);
		}
	}
}

async function enqueueMedia(input, sourceElementId, mediaElementID, playlistElementID, mediaType) {
	if (input.files && input.files[0]) {
		for (var i = 0; i < input.files.length; i++) {
			var fileUrl = URL.createObjectURL(input.files[i]);
			document.getElementById(sourceElementId).src = fileUrl;
			var mediaDuration = await getMediaDuration(input.files[i]);
			mediaTracks[mediaType].push({name: input.files[i].name, duration: mediaDuration, source: fileUrl});
		}
		refreshMediaPlayList(mediaTracks[mediaType], sourceElementId, mediaElementID, playlistElementID, mediaType);
		setMediaSource (sourceElementId, mediaElementID, mediaTracks[mediaType][actualTrack[mediaType]].source, false);
	}
}

async function enqueueBeat(input, sourceElementId='none', mediaElementID='none', playlistElementID='pllstInsrtBEATS', mediaType='beat') {
	if (input.files && input.files[0]) {
		for (var i = 0; i < input.files.length; i++) {
			//var obj = await readJSONFile(input.files[i]);	//OPTION .json file 
			var fileUrl = URL.createObjectURL(input.files[i]);	//OPTION .js file 
			var obj = await readJSFile(fileUrl);	//OPTION .js file 
			if (obj.video) {
				mediaTracks[mediaType].push({name: input.files[i].name, duration: obj.video[obj.video.length-1].time, source: URL.createObjectURL(input.files[i]), beatData: obj});
			} else {
				var autoGenBD = generateBeatData(obj.tempoInBPM, obj.notesPerBeat, obj.firstNoteTime, obj.songLength);
				mediaTracks[mediaType].push({name: input.files[i].name, duration: input.files[i].songLength, source: URL.createObjectURL(input.files[i]), beatData: autoGenBD});
			}
		}
		refreshMediaPlayList(mediaTracks[mediaType], sourceElementId, mediaElementID, playlistElementID, mediaType, true);
	}
}

function mediaSwap(itemNumber1, itemNumber2, sourceElementId, mediaElementID, playlistElementID, mediaType) {
	var temp = mediaTracks[mediaType][itemNumber1];
	mediaTracks[mediaType][itemNumber1] = mediaTracks[mediaType][itemNumber2];
	mediaTracks[mediaType][itemNumber2] = temp;
	refreshMediaPlayList(mediaTracks[mediaType], sourceElementId, mediaElementID, playlistElementID, mediaType);
}

function mediaDel(trackNumber, sourceElementId, mediaElementID, playlistElementID, mediaType) {
	if (mediaTracks[mediaType][trackNumber]) {
		mediaTracks[mediaType].splice(trackNumber, 1); 
		if (actualTrack[mediaType] > trackNumber) { // In the queue the deleting item is before played track (-> decrease actual track number by 1 to match after delete)
			actualTrack[mediaType] -= 1;
		} else if (actualTrack[mediaType] == trackNumber && actualTrack[mediaType] >= mediaTracks[mediaType].length) { //In the queue the deleting item is currently being played && it is a last track in the queue
			actualTrack[mediaType] -= 1;
			if (actualTrack[mediaType] < 0) { // if it was the last track, set the track back to initial value = 0 (not to be -1)
				actualTrack[mediaType] = 0;
				//Nothing to set, the last track was deleted from the queue //setMediaSource (sourceElementId, mediaElementID, ""); 
			} else {
				setMediaSource (sourceElementId, mediaElementID, mediaTracks[mediaType][actualTrack[mediaType]].source, true);
			}
			//change_time_state = true;
		}
		refreshMediaPlayList(mediaTracks[mediaType], sourceElementId, mediaElementID, playlistElementID, mediaType);
	}
}
