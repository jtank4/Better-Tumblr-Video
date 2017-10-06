var volume;
var requestsDone = 0;

function save(vol){
	chrome.storage.local.set({volume:vol});
}

function place(xhr, iframe, numFrames){
	var result = xhr.responseText;
	var alex = result.match(/source src\="([^"]+)/)[1]; //He asked me to put him in my code.
	
	var newVid = document.createElement("video");
	newVid.src = alex;
	newVid.volume = volume;
	newVid.className = "htmlVid";
	newVid.setAttribute("controls","controls");
	newVid.addEventListener("volumechange", function(){save(newVid.volume)});
	newVid.addEventListener("click", function(){if(newVid.paused){newVid.play();}else{newVid.pause();}});
	newVid.style.minWidth = iframe.offsetWidth + "px";
	newVid.style.minHeight = iframe.offsetHeight + "px";
	var cont = iframe.parentNode;
	cont.insertBefore(newVid, cont.childNodes[0]);
	iframe.remove();
	requestsDone += 1;
	if(requestsDone >= numFrames){
		everything();
	} //As soon as the last request finishes, call everything again.
}

function getSrc(iframe, numFrames){
	var xhr = new XMLHttpRequest();
	xhr.open("GET", iframe.src, true);
	xhr.onload = function (){place(this, iframe, numFrames);};
	xhr.send(null);
}

function everything(){
	var iframes = document.querySelectorAll("iframe.tumblr_video_iframe");
	var numFrames = iframes.length;
	requestsDone = 0;
	for (var i = 0; i < numFrames; i++) {
		getSrc(iframes[i], numFrames);
	}
	if(numFrames == 0){ //If there were no requests made, wait a bit before running again.
		setTimeout(everything, 100);
	}
}

function repeat(items){
	volume = items.volume;
	everything();
}

function dashReplace(items){
	volume = items.volume;
	setInterval(function(){
	var sources = document.querySelectorAll("source");
	for(var i = 0; i < sources.length; i++){
		var source = sources[i];
		if(source.className == "audio-source"){
			var newAud = document.createElement("audio");
			newAud.src = source.src;
			newAud.volume = volume;
			newAud.setAttribute("controls","controls");
			var cont = source.parentElement.parentElement.parentElement.parentElement;
			cont.insertBefore(newAud, cont.childNodes[0]);
			source.parentElement.parentElement.parentElement.remove();
		}else{
			var newVid = document.createElement("video");
			newVid.src = source.src;
			newVid.volume = volume;
			newVid.className = "htmlVid";
			newVid.setAttribute("controls","controls");
			newVid.addEventListener("volumechange", function(){save(newVid.volume)});
			newVid.addEventListener("click", function(){if(newVid.paused){newVid.play();}else{newVid.pause();}});
			var cont = source.parentElement.parentElement.parentElement;
			cont.insertBefore(newVid, cont.childNodes[0]);
			source.parentElement.parentElement.remove();
		}
	}}, 200);
}

if(location.href == "https://www.tumblr.com/dashboard"){
	chrome.storage.local.get({volume:.4}, dashReplace);
}
else{
	chrome.storage.local.get({volume:.4}, repeat);
}