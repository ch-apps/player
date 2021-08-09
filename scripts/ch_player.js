// CH PLAYER Javascript Library

var mediaTracks = ({video: [], audio: [], beat: []});
var actualTrack = ({video: 0, audio: 0, beat: 0});
var DATA;

// init the variables
var change_time_state = true;
var queueTime = 4; //seconds (this is the time the BEAT travels from right screen side to the RING
var latency = 0.0;
var nearestBeatIndex = 0;
var scheduledBeatSound;
var allBeatsPlayed = false;
var forceSkipAudioToVideoSync = false;

// init the container
var canvas = document.getElementById("my_canvas");
canvas.width = document.getElementById('chp_container').offsetWidth; //window.innerWidth; //document.body.clientWidth;
canvas.height = document.getElementById('chp_container').offsetHeight; //window.innerHeight/18; //document.body.clientHeight/18;
var c = canvas.getContext("2d");
var container = {
	x: 0,
	y: 0,
	width: canvas.width,
	height: canvas.height,
	lineWidth: canvas.height/5
};

function notImplementedMessage() {
  alert("This feature is not implemented yet.");
}

function playBeatSound() {
	document.getElementById("clickSound").pause();
	document.getElementById("clickSound").currentTime = 0;
	document.getElementById("clickSound").play();
}

// Local MEDIA Files Reading
function getMediaDuration(file) {
  let videoNode = document.createElement("video");
  let promise = new Promise(function(resolve, reject) {
    videoNode.addEventListener("loadedmetadata", function() {
      resolve(videoNode.duration);
    });
    videoNode.addEventListener("error", function() {
      reject(videoNode.error.message + "(" + videoNode.error.code + ")");
    });
  });
	videoNode.src = URL.createObjectURL(file);
  return promise;
}

function readJSONFile(file) {
	return new Promise((resolve, reject) => {
		let content = '';
		const reader = new FileReader();
		// Wait till complete
		reader.onloadend = function(e) {
		  //content = e.target.result;
		  var jsonObj = JSON.parse(e.target.result);
		  //const result = content.split(/\r\n|\n/);
		  resolve(jsonObj);
		};
		// Make sure to handle error states
		reader.onerror = function(e) {
		  reject(e);
		};
		reader.readAsBinaryString(file);
	});
}

function getFileContent(filePath) {
	let httpRequest = new XMLHttpRequest();
	let promise = new Promise(function(resolve, reject) {
		httpRequest.addEventListener("load", function() {
			resolve(this.response);
		});
		httpRequest.addEventListener("error", function() {
			reject(undefined);
		});
	});	
	httpRequest.open("GET", filePath, true);
	httpRequest.send();
	return promise;
}

function readJSFile(filePath) {
	var newScriptElement = document.createElement("script");
	let promise = new Promise(function(resolve, reject) {
		newScriptElement.addEventListener("load", function() {
			resolve(DATA);
		});
		newScriptElement.addEventListener("error", function() {
			reject(false);
		});
	});	
	newScriptElement.src = filePath;
	document.head.appendChild(newScriptElement);
	return promise;
}	

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

function refreshMediaPlayList(itemsArray, sourceElementId, mediaElementID, playlistElementID, mediaType, isLocked=false) {
	var output = '';
	document.getElementById(playlistElementID).innerHTML = output;
	for (var i = 0; i < itemsArray.length; i++) {
		output += '<div class="playlist-item" id="pllstITM">';
		output += '	<div class="playlist-name">';
		output += itemsArray[i].name;
		output += '	</div>';
		output += '	<div class="playlist-action">';
		output += '		<div class="playlist-action-left">';
		//paramString = i + ', "' + sourceElementId +	'", "' + mediaElementID + '", "' + playlistElementID + '", "' + mediaType + '"';
		paramString = i.toString() + ", '" + sourceElementId +	"', '" + mediaElementID + "', '" + playlistElementID + "', '" + mediaType + "', true";
		if (isLocked) {
			output += '			<i class="fas fa-lock"></i>&nbsp;&nbsp;locked with music';
		} else {
			output += '			<i class="fas fa-play-circle" onclick="mediaSpec(' + paramString + ')"></i>&nbsp;&nbsp;' + new Date(1000 * itemsArray[i].duration).toISOString().substr(11, 8);
		}		
		output += '		</div>';
		output += '		<div class="playlist-action-right">';
		if (i > 0) {
			paramString2 = i.toString() + ", " + (i-1).toString() + ", '" + sourceElementId + "', '" + mediaElementID + "', '" + playlistElementID + "', '" + mediaType + "'";
			output += '			<i class="fas fa-caret-square-left" onclick="mediaSwap(' + paramString2 + ')"></i>';
		}
		if (i < itemsArray.length-1) {
			paramString2 = i.toString() + ", " + (i+1).toString() + ", '" + sourceElementId + "', '" + mediaElementID + "', '" + playlistElementID + "', '"+ mediaType + "'";
			output += '			<i class="fas fa-caret-square-right" onclick="mediaSwap(' + paramString2 + ')"></i>';
		}
		output += '			<i class="fas fa-trash-alt" onclick="mediaDel(' + paramString + ')"></i>';
		output += '		</div>';
		output += '	</div>';
		output += '</div>';
	document.getElementById(playlistElementID).innerHTML = output;
	}
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
			change_time_state = true;
		}
		refreshMediaPlayList(mediaTracks[mediaType], sourceElementId, mediaElementID, playlistElementID, mediaType);
	}
}

function setMediaSource (sourceElementID, mediaElementID, sourceUrl, startToPlay = false) {
	document.getElementById(sourceElementID).src = sourceUrl;
	document.getElementById(mediaElementID).load();
	if (startToPlay) {
		document.getElementById(mediaElementID).play();
	}
}

function goFullScreen() {
	var fullscreenElement = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement;
	if(fullscreenElement){
  	exitFullscreen();
	document.getElementById("iconCompress").style.display = "none";
	document.getElementById("iconExpand").style.display = "block";
  }else {
  	launchIntoFullscreen(document.getElementById('chp_container'));
	document.getElementById("iconExpand").style.display = "none";
	document.getElementById("iconCompress").style.display = "block";
  }
  
}

// From https://davidwalsh.name/fullscreen
// Find the right method, call on correct element
function launchIntoFullscreen(element) {
  if (element.requestFullscreen) {
    element.requestFullscreen();
  } else if (element.mozRequestFullScreen) {
    element.mozRequestFullScreen();
  } else if (element.webkitRequestFullscreen) {
    element.webkitRequestFullscreen();
  } else if (element.msRequestFullscreen) {
    element.msRequestFullscreen();
  }
}

// Whack fullscreen
function exitFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  }
}

function animate() {
	// re-init the container size and position (as the browser window might be resized during playback)
	canvas.width = document.getElementById('chp_container').offsetWidth; //window.innerWidth; //document.body.clientWidth;
	canvas.height = document.getElementById('chp_container').offsetHeight/18; //window.innerHeight/18; //document.body.clientHeight/18;
	container.width = document.getElementById('chp_container').offsetWidth; //window.innerWidth; //document.body.clientWidth;
	container.height = document.getElementById('chp_container').offsetHeight/18; //window.innerHeight/18; //document.body.clientHeight/18;
	container.lineWidth = container.height/5;
	
	if (mediaTracks["beat"] && mediaTracks["beat"].length > actualTrack["audio"]) { //beats are locked with audio 1:1 -> we need to check that beat track is defined for the audio currently played (in case it is not, do not show/play beats)
		//draw the container
		c.clearRect(container.x, container.y, container.width, container.height);
		//c.fillStyle = 'rgba(255,0,0,0.1)';
		//c.fillRect(container.x, container.y, container.width, container.height);

		// draw the ring
		actualTime = document.getElementById("myaudio").currentTime;

		if (mediaTracks["beat"][actualTrack["audio"]].beatData.video[0].time 			< actualTime+1.2*queueTime && mediaTracks["beat"][actualTrack["audio"]].beatData.video[mediaTracks["beat"][actualTrack["audio"]].beatData.video.length-1].time+0.2*queueTime > actualTime) { // wait for the time just before first beat appears and show it until the last beat disappears
			c.strokeStyle = 'rgba(255,0,0,0.75)';
			c.lineWidth = container.lineWidth;
			c.beginPath();
			c.arc(container.x+0.3*container.width, container.height/2, (container.height/2)-0.5*container.lineWidth, 0, Math.PI * 2, true);
			c.stroke();
		}

		//loop throug the beats array
		//console.log("DEBUG: audioTrack " + actualTrack["audio"] + ", nearestBeatIndex " + nearestBeatIndex + ", actual time " + actualTime);
		if (mediaTracks["beat"][actualTrack["audio"]].beatData.video[nearestBeatIndex].time < actualTime+latency && !allBeatsPlayed) {
			// Play BEAT SOUND
			//playBeatSound();
			// Animate RING
			c.fillStyle = 'rgba(255,255,255,0.95)';
			c.beginPath();
			c.arc(container.x+0.3*container.width, container.height/2, (container.height/2), 0, Math.PI * 2, true);
			c.fill();
			// Set next beat as nearest (if not already the last one)
			if (nearestBeatIndex < mediaTracks["beat"][actualTrack["audio"]].beatData.video.length-1) {
				nearestBeatIndex++;
				scheduledBeatSound = setTimeout(playBeatSound, (mediaTracks["beat"][actualTrack["audio"]].beatData.video[nearestBeatIndex].time - (actualTime+latency))*1000);
			} else {
				allBeatsPlayed = true;
			}
		}
		i = nearestBeatIndex;
		while (mediaTracks["beat"][actualTrack["audio"]].beatData.video[i].time <  actualTime+queueTime && !allBeatsPlayed) {
		//draw the circles
		c.fillStyle = 'rgba(255,0,0,0.75)';
		c.beginPath();
		c.arc((mediaTracks["beat"][actualTrack["audio"]].beatData.video[i].time-actualTime)*(0.7*container.width/queueTime)+0.3*container.width, container.height/2, (container.height-2*container.lineWidth)/2, 0, Math.PI * 2, true);
		c.fill();
		i++;
		if ( !(i<mediaTracks["beat"][actualTrack["audio"]].beatData.video.length) ) break;
		}
	}
  requestAnimationFrame(animate);
}
requestAnimationFrame(animate);
