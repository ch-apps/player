/**
 * CH PLAYER
 * Browser based application that provides an universal platform for easy creation and playback of Cock Hero custom games. 
 */

var mediaTracks = ({ video: [], audio: [], beat: [] });
/*
mediaTracks = ({
	video: [
		{ name: "/home/smb_share/Video1.mp4", duration: 0, source: "/home/smb_share/Video1.mp4" }
	],
	audio: [
		{ name: "/run/media/DATA_CH/AUDIO/Song1.mp3", duration: 0, source: "/run/media/DATA_CH/AUDIO/Song1.mp3" },
		{ name: "/run/media/DATA_CH/AUDIO/Song2.mp3", duration: 0, source: "/run/media/DATA_CH/AUDIO/Song2.mp3" },
	],
	beat: [
		{ name: "/run/media/DATA_CH/AUDIO/Song1.js",
		duration: 180.366,
		source: "/run/media/DATA_CH/AUDIO/Song1.js",
		beatData: {
			audio: [],
			messages: [],
			video: [
				{ time: 11.317, highlighted: false },
				{ time: 12.564401247401248, highlighted: false }
			]}
		}
	]
});
*/
var actualTrack = ({ video: 0, audio: 0, beat: 0 });
var bufferedTrack = ({ video: 0, audio: 0, beat: 0 });
let timeUpdateListener; // Declare a variable to hold the listener reference
var DATA;
/*
sourceElementId ... it is an < source > element ID in HTML page(vdSRC, adSRC, btSRC)
mediaElementID ... it is an < video > or < audio > element ID in the HTML page(myvideo, myaudio)
mediaType ... name of the track inside the mediaTracks variable(video, audio, beat)
*/

// init the variables
//var change_time_state = true;
var queueTime = 4; //seconds (this is the time the BEAT travels from right screen side to the RING
var latency = 0.0;
var nearestBeatIndex = 0;
var nearestMessageIndex = 0;
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
	lineWidth: canvas.height / 5
};

function notImplementedMessage() {
	alert("This feature is not implemented yet.");
}

requestAnimationFrame(animate);
