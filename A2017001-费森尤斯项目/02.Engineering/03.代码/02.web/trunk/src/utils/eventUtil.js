/*****************************工具函数 **********/
var DEVICES={}
function addListener(device,eventName,func){
	var events = DEVICES[device];
	if(!events){
		events = {};
		DEVICES[device] = events;
	}
	
	var eventArray = events[eventName],index=0;
	if(!eventArray){
		eventArray = [];
		events[eventName]=eventArray;
	}

	if(eventArray.length > 1){
		var max = eventArray[array.length-1];
		index = max.key+1;
	}
	events[eventName].push({key:index,func:func});
	
	return index;
}

function removeListener(device,eventName,index){
	var events = DEVICES[device];
	if(!events)return;
	
	var eventArray = events[eventName];
	if(!eventArray)return;
	
	for(var i=0;i<eventArray.length;i++){
		if(eventArray[i].key == index){
			eventArray.splice(i,1);
			break;
		}
	}
}

function fireEvents(device,eventName,arg){
	var events = DEVICES[device];
	if(!events)return;
	
	var eventArray = events[eventName];
	if(!eventArray)return;
	
	for(var i=0;i<eventArray.length;i++){
		eventArray[i].func(eventName,arg);
	}
}

const event={
	on : addListener,
	un : removeListener,
	listen:addListener,
	addListener:addListener,
	removeListener:removeListener,
	fire:fireEvents,
	fireEvents:fireEvents,
}
export default event;
