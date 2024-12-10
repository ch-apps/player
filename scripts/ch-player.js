/**
 * CH PLAYER
 * Browser based application that provides an universal platform for easy creation and playback of Cock Hero custom games. 
 */

var mediaTracks = ({video: [], audio: [], beat: []});
var actualTrack = ({video: 0, audio: 0, beat: 0});
let timeUpdateListener; // Declare a variable to hold the listener reference
var DATA;

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
	lineWidth: canvas.height/5
};

function notImplementedMessage() {
  alert("This feature is not implemented yet.");
}

requestAnimationFrame(animate);
