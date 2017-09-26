var volume;

function save(vol){
	chrome.storage.local.set({volume:vol});
}

function place(xhr, iframes, i){
	var iframe = iframes[i];
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
	var cont = iframe.parentElement;
	cont.insertBefore(newVid, cont.childNodes[0]);
	iframes[i].remove();
}

function getSrc(iframes, i){
	var iframe = iframes[i];
	var xhr = new XMLHttpRequest();
	xhr.open("GET", iframe.src, true);
	xhr.onload = function (){place(this, iframes, i);};
	xhr.send(null);
}

function everything(){
	var iframes = document.querySelectorAll("iframe.tumblr_video_iframe");
	var numFrames = iframes.length;
	for (var i = 0; i < numFrames; i++) {
		getSrc(iframes, i);
	}
	
}

function repeat(items){
	volume = items.volume;
	everything();
	setInterval(everything, 100);
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
var hostname = location.hostname;
hostname = hostname.match(/tumblr\.com/)[0];
if(location.href == "https://www.tumblr.com/dashboard"){
	chrome.storage.local.get({volume:.4}, dashReplace);
}
else if(hostname == "tumblr.com"){
	chrome.storage.local.get({volume:.4}, repeat);
}