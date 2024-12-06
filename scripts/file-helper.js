/**
 * Functions that help to operate with files and their content
 */

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