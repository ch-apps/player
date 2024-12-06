/**
 * Functions that visualize the content
 */

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


function goFullScreen() {
    var fullscreenElement = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement;
    if (fullscreenElement) {
        exitFullscreen();
        document.getElementById("iconCompress").style.display = "none";
        document.getElementById("iconExpand").style.display = "block";
    } else {
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
		//console.log("DEBUG: NearestBeatIndex Time: " + mediaTracks["beat"][actualTrack["audio"]].beatData.video[nearestBeatIndex].time);
		//console.log("DEBUG: Actual Time with Latency: " + actualTime+latency);
		//console.log("DEBUG: All Beats Played: " + allBeatsPlayed);
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