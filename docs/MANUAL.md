# Cock Hero Player - USER'S GUIDE

## Installation
### Download (and target location)
1. Create a directory on your disk where you want to install the player (it could be anywhere you like - e.g. *C:\\ch-apps\\player\\* )
2. Download the CH Player repository from [GitHub](https://github.com/ch-apps/player)  (it always maintains the latest version)
   * Click the green button `<> Code` 
   * Click on the `Download ZIP` option
3. Extract the downloaded ZIP file content into your directory created in step 1
4. Now you are ready to launch your CH Player. Do it by opening *index.html* page in your preffered web browser (double-clicking it should launch it in default browser on most systems)

## Basic Usage
### Create, Upload and Play Playlist
  1. Download media (video & audio) to be used / played to local disk
  2. Create BeatFiles for audio files
    * Each audio file should have its corresponding BeatFile prepared (same file-name but with .js extension is a good practice)
    * Refer to [BeatFile Chapter](#beatfile) for BeatFiles variants and its content / format descriptionn (including examples)
  3. Create a Playlist JSON file (refer to the [Playlist JSON schema](#playlist-json-schema) and [Example File](#playlist-example) for inspiration)
  4. Launch the CH Player by opening *index.html* page in your preffered web browser (double-clicking it should launch it in default browser on most systems)
    * Performance (browser inner javascript engine) seems to be much better in Chrome then Firefox (at least for this app). If you are facing choppy expirience, try to run the app in different browser, it might help.
  5. Load your playlist
    * Click 2nd icon "Load Playlist" in TOP LEFT menu and open your playlist file. 
    * Sample playlist is included: *.\\AV_MEDIA\\IntroPlaylist.json*
    * If loaded corectly, the media playback chains to be played (for video, audio and beats) will show up at the bottom of the screen (as separated tracks)
  6. Play your game
    * Click the video (to start / pause the playback)
    * Switch to full-screen (and back to windowed mode) by clicking on the icon (four arrows) in top left corner of the video frame
    * Adjust volumes (video, audio and beat volumes in the final mix) by setting appropriate sliders in top right corner of the video frame

### Select and Play Media Interactively (one-by-one)
  1. Download media (video & audio) to be used / played to local disk
  2. Create BeatFiles for audio files 
    * Each audio file should have its corresponding BeatFile prepared (same file-name but with .js extension is a good practice)
    * Refer to [BeatFile Chapter](#beatfile) for BeatFiles variants and its content / format descriptionn (including examples)
  3. Arrange your media playback chains in 
    * click "+" icon in BOTTOM menu (video, audio and beat tracks) and add your media files to be played in sync
    * Remove the media file by clicking on the trash-bin icon (bottom right corner of the media box)
    * Move the media left / right (before / after its neigbours) in the chain flow by clicking on the arrov icons (bottom right corner of the media box)
    * Start playing specific media (jump an play from here) by clicking on the play icon (bottom left corner of the media box)

## Files Structure Description
  * Validate the JSON files (via https://jsonlint.com/ or similar tool) as the format is strict (and missing comma, bracket or simmilar issue could lead to error during file reading / parsing)
### Playlist
Playlist file keeps the pre-configured "chain" of video files, audio files and beat files to be played (in a form of the regular CH game). Files are played one by one as they are listed in the playlist (audio with beats paralel to the video stream).
#### Playlist JSON schema
  * Schema was created with help of [JSON to JASON Schema Transform Tool](https://transform.tools/json-to-json-schema)

```
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Generated schema for Root",
  "type": "object",
  "properties": {
    "info": {
      "type": "string"
    },
    "videoFilesURL": {
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "audioFilesURL": {
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "beatFilesURL": {
      "type": "array",
      "items": {
        "type": "string"
      }
    }
  },
  "required": [
    "info",
    "videoFilesURL",
    "audioFilesURL",
    "beatFilesURL"
  ]
}
```

#### Playlist Example

```
{
"info": "<b>INTRO PLAYLIST</b></br>This is very simple test playlist. It demonstrates the relative and absolute file path usage (to point the media files to be played) on LINUX BASED SYSTEMS.",
"videoFilesURL": [
	"./AV_MEDIA/VIDEO/test_video___FullHD_25fps_60sec_120BPM.mp4?start=0&stop=18",
	"./AV_MEDIA/VIDEO/test_video___FullHD_25fps_60sec_120BPM.mp4?start=30&stop=48",
	"/home/<user>/Development/git.projects/player/AV_MEDIA/VIDEO/test_video___QuadVGA_30fps_30sec_180BPM.mp4?start=10&stop=22"
],
"audioFilesURL": [
	"./AV_MEDIA/AUDIO/Test/BASS_120bpm_18sec.mp3",
	"/home/<user>/Development/git.projects/player/AV_MEDIA/AUDIO/Test/BASS_120bpm_18sec.mp3",
	"/home/<user>/Development/git.projects/player/AV_MEDIA/AUDIO/Test/BASS_180bpm_12sec.mp3"
],
"beatFilesURL": [
	"./AV_MEDIA/AUDIO/Test/BASS_120bpm_18sec.js",
	"/home/<user>/Development/git.projects/player/AV_MEDIA/AUDIO/Test/BASS_120bpm_18sec.js",
	"file:///home/<user>/Development/git.projects/player/AV_MEDIA/AUDIO/Test/BASS_180bpm_12sec.js"
]
}
```

### BeatFile
BeatFile keeps the configuration for the "beat-meter". It is linked to its audio track. Could be either SIMPLE (in such a case the beat-meter is autogenerated based on provided song tempo) or with exact TIMESTAMPS and MESSAGES definition for the beat-meter.
#### BeatFile SIMPLE

```
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Generated schema for Root",
  "type": "object",
  "properties": {
    "tempoInBPM": {
      "type": "number"
    },
    "notesPerBeat": {
      "type": "number"
    },
    "firstNoteTime": {
      "type": "number"
    },
    "songLength": {
      "type": "number"
    },
    "downloadLink": {
      "type": "string"
    }
  },
  "required": [
    "tempoInBPM",
    "notesPerBeat",
    "firstNoteTime",
    "songLength",
    "downloadLink"
  ]
}
```

##### SIMPLE Example

```
DATA={
"tempoInBPM": 90.000,
"notesPerBeat": 4,
"firstNoteTime": 1.000,
"songLength": 12.000,
"downloadLink": "https://github.com/ch-apps/player/tree/main/AV_MEDIA/AUDIO/Test/BASS_180bpm_12sec.mp3"
}
```

#### BeatFile with TIMESTAMPS and MESSAGES
  * timestamps in `video` array as well as in `messages` array MUST BE SORTED (ascending)
  * this format is also used by [Beatmeter Generator](https://gitlab.com/SklaveDaniel/BeatmeterGenerator) - GUI tool to help you make/place the beats to the song. 

```
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Generated schema for Root",
  "type": "object",
  "properties": {
    "audio": {
      "type": "array",
      "items": {}
    },
    "video": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "time": {
            "type": "number"
          },
          "highlighted": {
            "type": "boolean"
          }
        },
        "required": [
          "time",
          "highlighted"
        ]
      }
    },
    "messages": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "fromTime": {
            "type": "number"
          },
          "toTime": {
            "type": "number"
          },
          "message": {
            "type": "string"
          }
        },
        "required": [
          "fromTime",
          "toTime",
          "message"
        ]
      }
    },
    "downloadLink": {
      "type": "string"
    }
  },
  "required": [
    "audio",
    "video",
    "messages",
    "downloadLink"
  ]
}
```

##### TIMESTAMPS and MESSAGES Example

```
{
    "audio": [],
    "video": [
        {"time": 1.000, "highlighted": false},
        {"time": 2.000, "highlighted": false},
        {"time": 3.000, "highlighted": false},
        {"time": 4.000, "highlighted": false},
        {"time": 5.000, "highlighted": false},
        {"time": 6.000, "highlighted": false},
        {"time": 7.000, "highlighted": false},
        {"time": 8.000, "highlighted": false},
        {"time": 9.000, "highlighted": false},
        {"time": 10.000, "highlighted": false},
        {"time": 11.000, "highlighted": false},
        {"time": 12.000, "highlighted": false},
        {"time": 13.000, "highlighted": false},
        {"time": 14.000, "highlighted": false},
        {"time": 15.000, "highlighted": false},
        {"time": 16.000, "highlighted": false},
        {"time": 17.000, "highlighted": false}
    ],
    "messages": [
        {"fromTime": 0.500, "toTime": 4.500, "message": "TEST MESSAGE #1"},
        {"fromTime": 5.500, "toTime": 9.500, "message": "TEST MESSAGE #2"},
        {"fromTime": 10.500, "toTime": 14.500, "message": "TEST MESSAGE #3"}
    ],
    "downloadLink": "https://github.com/ch-apps/player/tree/main/AV_MEDIA/AUDIO/Test/BASS_120bpm_18sec.mp3"
}
```

#### JSON vs. JS
CH Player supports both formats for BeatFiles.<br>
JS format (.js) is regular javascript program, even though (in this specific case) it holds only assignement of DATA variable to the beat-data-object (DATA={...}).\ 
JSON format (.json) stands for JavaScript Object Notation. JSON is a lightweight format for storing and transporting data. So it holds also the beat-data-object {...}, but not assigned already to javascrip variable as in case of JS.<br>
**The content of JS and JSON BeatFiles differs only in the initial string `DATA=` (present only in .js files), all the rest is the same.** Be aware, that in case JSON BeatFile is linked from the Playlist, valid full URI must be used (i.e. file:///C:/Users/.... (on Windows) or file:///home/user/.... (on Linux)).<br>
Why the two formats then? The reason is in the cross-origin restrictions (CORS). By default, browsers prevent web pages from accessing files on the local disk due to security concerns. When running CH Player from local disk with JSON BeatFiles (linked from Playlist) stored also locally - they won't be allowed to be read by the script because of CORS. And here comes the JS "work-around" as the easiest way to by-pass the issue (as the script / JS file could be read without any tweaking).<br>
There are also other ways to work around this:
* temporarily disable CORS enforcement in your browser (easy, but not safe / recommended - remember to re-enable this setting once you’re back in on-line world)
* run the player from a local web server. This avoids cross-origin restrictions entirely, but requires additional SW to install and run (secure, but might be quite complex)
#### How to disable CORS enforcement in the browser
##### Firefox
1. Type `about:config` in the Firefox address bar and press Enter.
2. Click "Accept the Risk and Continue".
3. Search for: `security.fileuri.strict_origin_policy`
4. Double-click it to set it to `false`.
##### Chrome
1. Close All Chrome Instances (Make sure all Chrome windows are completely closed).
2. Run Chrome with the --disable-web-security Flag:
   * On Windows: Open the Command Prompt and run the following command: `start chrome --disable-web-security --user-data-dir="C:/chrome-dev"`
   * On macOS: Open the Terminal and run the following command: `open -na "Google Chrome" --args --disable-web-security --user-data-dir="/tmp/chrome-dev"`
   * On Linux: Open a terminal and run the following command: `google-chrome --disable-web-security --user-data-dir="/tmp/chrome-dev"`
      * disable-web-security: Disables CORS enforcement.
      * user-data-dir: Creates a temporary user profile for this session to prevent affecting your main Chrome profile.
4. Access Your Page: Navigate to your local HTML file or development URL in the browser window that opens.
#### How to run the player from a local web server
This is "out of the scope" for the purpose of this manual. Search the web for the guides how to do that.

<!-- ### BeatPatterns and SongStructure -->
