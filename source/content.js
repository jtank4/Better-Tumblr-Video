var volume;
var requestsDone = 0;
var player;

function save(vol){
	chrome.storage.local.set({volume:vol});
}

function place(xhr, iframe, numFrames){
	var result = xhr.responseText;
	var alex = result.match(/source src\="([^"]+)/)[1]; //He asked me to put him in my code.
	var poster = result.match(/poster\=["']([^"']+)/)[1];
	
	var newVid = document.createElement("video");
	newVid.src = alex;
	newVid.poster = poster;
	newVid.volume = volume;
	newVid.className = "htmlVid";
	newVid.setAttribute("controls","controls");
	newVid.addEventListener("volumechange", function(){save(this.volume)});
	newVid.style.minWidth = iframe.offsetWidth + "px";
	newVid.style.minHeight = iframe.offsetHeight + "px";
	var cont = iframe.parentNode;
	var vid = cont.insertBefore(newVid, cont.childNodes[0]);
	
	//Chrome 67, in an aggresively ignorant decision,
	//removed the volume bar from the default player, so now we must use plyr video player.
	//Note for anyone looking to use plyr for multiple videos, here's one way to do it.
	player = new Plyr(vid, {});
	window.player = player;
	
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
		}else if(source.src && source.parentElement.tagName == "VIDEO" && source.parentElement.className == "vjs-tech"){
			var children = source.parentElement.parentElement.childNodes;
			var poster;
			for(j of children){
				if(j.className == "vjs-poster"){
					poster = j.style.backgroundImage.match(/url\("([^"]+)/)[1];
					if(poster){
						break;
					}
				}
			}
			if(poster){
				var newVid = document.createElement("video");
				newVid.poster = poster;
				newVid.src = source.src;
				newVid.volume = volume;
				newVid.className = "htmlVid";
				newVid.setAttribute("controls","controls");
				newVid.addEventListener("volumechange", function(){save(this.volume)});
				var cont = source.parentElement.parentElement.parentElement;
				var vid = cont.insertBefore(newVid, cont.childNodes[0]);
				
				//Make Plyr the video player 
				player = new Plyr(vid, {});
				window.player = player;
				
				source.parentElement.parentElement.remove();
			}
		}
	}}, 100);
}

if(location.href == "https://www.tumblr.com/dashboard" || location.href.includes("https://www.tumblr.com/explore") || location.href.includes("https://www.tumblr.com/likes")){
	chrome.storage.local.get({volume:.4}, dashReplace); //These are done separately as these videos are not in iframes
}
else{
	chrome.storage.local.get({volume:.4}, repeat); //These videos are in iframes
}