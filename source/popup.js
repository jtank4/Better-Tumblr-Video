//Set all inputs to correct value and to update values.

function listen(opRef, prop){
	var sets = {};
	sets[opRef.id] = opRef[prop];
	chrome.storage.local.set(sets);
}
function setToListen(opRef, prop){
	opRef.addEventListener("click", nothing => listen(opRef, prop));
}
function update(items, opRef, prop){
	opRef[prop] = items[opRef.id];
	setToListen(opRef, prop);
}

//Add to this object for every option. Key is option id, value is property to save.
//Also must request the value in var reqs in content.js.
var options = {
	"usePlyr":"checked"
};
for(var opId in options){//optionId
	var prop = options[opId]; //property
	var opRef = document.getElementById(opId); //optionReference
	var reqs = {};
	reqs[opId] = opRef[prop];
	chrome.storage.local.get(reqs, items => update(items, opRef, prop));
}
