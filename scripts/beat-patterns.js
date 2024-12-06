/**
 * Functions that generate beat data based on predefined patterns
 */

var patterns = [{
	"name": "1---",
	"barsOccupied": 1,
	"notesPerBar": 4,
	"beats": [0/4],
	"relativeFrequency": 1/4
},
{
	"name": "1-2-",
	"barsOccupied": 1,
	"notesPerBar": 4,
	"beats": [0/4, 2/4],
	"relativeFrequency": 2/4
},
{
	"name": "12--",
	"barsOccupied": 1,
	"notesPerBar": 4,
	"beats": [0/4, 1/4],
	"relativeFrequency": 2/4
},
{
	"name": "123-",
	"barsOccupied": 1,
	"notesPerBar": 4,
	"beats": [0/4, 1/4, 2/4],
	"relativeFrequency": 3/4
},
{
	"name": "1234",
	"barsOccupied": 1,
	"notesPerBar": 4,
	"beats": [0/4, 1/4, 2/4, 3/4],
	"relativeFrequency": 4/4
},
{
	"name": "1-2- | 123-",
	"barsOccupied": 2,
	"notesPerBar": 4,
	"beats": [0/4, 2/4, 4/4, 5/4, 6/4],
	"relativeFrequency": 5/8
},
{
	"name": "1-2- | 1234",
	"barsOccupied": 2,
	"notesPerBar": 4,
	"beats": [0/4, 2/4, 4/4, 5/4, 6/4, 7/4],
	"relativeFrequency": 6/8
},
{
	"name": "1234 | 123-",
	"barsOccupied": 2,
	"notesPerBar": 4,
	"beats": [0/4, 1/4, 2/4, 3/4, 4/4, 5/4, 6/4],
	"relativeFrequency": 7/8
},
{
	"name": "DOUBLE",
	"barsOccupied": 1,
	"notesPerBar": 4,
	"beats": [0/8, 1/8, 2/8, 3/8, 4/8, 5/8, 6/8, 7/8],
	"relativeFrequency": 8/4
}];

var beatData = {"audio": [], "video": [], "messages": []};
var slowBeatsArray = patterns.filter(pattern => pattern.relativeFrequency <= 0.35);
var mediumBeatsArray = patterns.filter(pattern => pattern.relativeFrequency > 0.35 && pattern.relativeFrequency < 0.70); //
var fastBeatsArray = patterns.filter(pattern => pattern.relativeFrequency >= 0.70 && pattern.relativeFrequency <= 1.00);
var extrafastBeatsArray = patterns.filter(pattern => pattern.relativeFrequency > 1.00);
var currentBeatTime =0;

function generateBeatData(tempoInBPM, notesPerBeat, firstNoteTime, songLength) {
	beatData = {"audio": [], "video": [], "messages": []};
	var currentBeatTime = firstNoteTime;
	var beatTimeInSeconds = 60/tempoInBPM;
	var numberOfBars = 0;
	// INTRO SECTION
		// 20-30 beats SLOW 
		numberOfBars = 20 + notesPerBeat*(Math.floor(Math.random()*3));
		currentBeatTime = appendPatternBeats (numberOfBars, slowBeatsArray[Math.floor(Math.random()*slowBeatsArray.length)], currentBeatTime, beatTimeInSeconds);
		// 20-30 beats MEDIUM 
		numberOfBars = 20 + notesPerBeat*(Math.floor(Math.random()*3));
		currentBeatTime = appendPatternBeats (numberOfBars, mediumBeatsArray[Math.floor(Math.random()*mediumBeatsArray.length)], currentBeatTime, beatTimeInSeconds);
		// 20-30 beats FAST 
		numberOfBars = 20 + notesPerBeat*(Math.floor(Math.random()*3));
		currentBeatTime = appendPatternBeats (numberOfBars, fastBeatsArray[Math.floor(Math.random()*fastBeatsArray.length)], currentBeatTime, beatTimeInSeconds);
		//// 4-8 beats REST	[no beats]
		//numberOfBars = 4 + notesPerBeat*(Math.floor(Math.random()*1));
		//currentBeatTime += numberOfBars*beatTimeInSeconds;
		
	// BODY SECCTION
	while (currentBeatTime < songLength) {
		// 20-30 beats SLOW or MEDIUM
		numberOfBars = 20 + notesPerBeat*(Math.floor(Math.random()*3));
		currentBeatTime = appendPatternBeats (numberOfBars, mediumBeatsArray[Math.floor(Math.random()*mediumBeatsArray.length)], currentBeatTime, beatTimeInSeconds);
		// 20-30 beats MEDIUM or FAST
		numberOfBars = 20 + notesPerBeat*(Math.floor(Math.random()*3));
		currentBeatTime = appendPatternBeats (numberOfBars, fastBeatsArray[Math.floor(Math.random()*fastBeatsArray.length)], currentBeatTime, beatTimeInSeconds);	
		// 20 beats FAST or DOUBLE
		numberOfBars = 20;
		if (tempoInBPM < 45) {
			currentBeatTime = appendPatternBeats (numberOfBars, extrafastBeatsArray[Math.floor(Math.random()*extrafastBeatsArray.length)], currentBeatTime, beatTimeInSeconds);
		} else {
			currentBeatTime = appendPatternBeats (numberOfBars, fastBeatsArray[Math.floor(Math.random()*fastBeatsArray.length)], currentBeatTime, beatTimeInSeconds);
		}
		// 20 beats MEDIUM
		numberOfBars = 20;
		currentBeatTime = appendPatternBeats (numberOfBars, mediumBeatsArray[Math.floor(Math.random()*mediumBeatsArray.length)], currentBeatTime, beatTimeInSeconds)
		//// 4-8 beats REST	[no beats]
		//numberOfBars = 4 + notesPerBeat*(Math.floor(Math.random()*1));
		//currentBeatTime += numberOfBars*beatTimeInSeconds;
	}
	return beatData;
}

function appendPatternBeats (numberOfBars, randomBeatPattern, currentBeatTime, beatTimeInSeconds) {
		for (var i = 0; i < numberOfBars; i += randomBeatPattern.barsOccupied) {
			for (var j = 0; j < randomBeatPattern.beats.length; j++) {
				beatData.video.push({"time": currentBeatTime+(beatTimeInSeconds*randomBeatPattern.beats[j]), "highlighted": false});
			}
		currentBeatTime += randomBeatPattern.barsOccupied*beatTimeInSeconds;
		}	
	return currentBeatTime;
}