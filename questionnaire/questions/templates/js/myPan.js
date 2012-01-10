/*global map , tb, dojo, setTimeout, clearTimeout*/
var test;
var evn;
var myPanning = false;
var dir;
var MY_PAN_RATIO = 0.07;

//Global event listeners
var upPan;
var upPanStop;
var leftPan;
var leftPanStop;
var downPan;
var downPanStop;
var rightPan;
var rightPanStop;
var mapPanStop;


function stopMyPanMap(e) {
	//clearTimeout(test);
	clearInterval(test);
	myPanning = false;
}
function stopMyPan(e) {
	var relTarg = e.relatedTarget || e.toElement;
	//console.log("testout");
	if (relTarg) { // Stop panning when return to map
		if (relTarg.id != "footer" && relTarg.id != "header") {
//			clearTimeout(test);
			clearInterval(test);
			myPanning = false;
		}
	}
}

function myPan2(/*realEvent,*/ direction, e){
	//var relTarg = e.relatedTarget || e.toElement;
	var dx = 0;
	var dy = 0;
	//console.log("testIn " + direction +" event: " + e);
	//if (relTarg) {
		// Start pan only if coming from map container
		//if ((relTarg.id != "map_map_graphics" && relTarg.id != "navigation" && relTarg.id != "formArea" && relTarg.id != "buttonArea") && realEvent) {
			//return;
		//}
	//}
	// Check if drawing toolbar is not active. Also return if panning is on and mouseover event fires
	if (!tb._geometryType/* || (myPanning && realEvent)*/) {
		return;
	}
	else {
		switch (direction) {
			case "up":
				dx = 0;
				dy = map.height * -MY_PAN_RATIO;
				break;
			case "left":
				dx = map.width * -MY_PAN_RATIO;
				dy = 0;
				break;
			case "down":
				dx = 0;
				dy = map.height * MY_PAN_RATIO;
				break;
			case "right":
				dx = map.width * MY_PAN_RATIO;
				dy = 0;
				break;
		}
//		evn = e;
//		dir = direction;
		map._fixedPan(dx, dy, evn);
//		myPanning = true;
//		test = setTimeout(myPan, 80, false, dir, evn);
//		test = setTimeout("myPan(false, dir, evn)", 80);

	}
}
function myPan(direction, e) {
	if (!myPanning) {
		evn = e;
		dir = direction;
		//if(!myPanning) {
		test = setInterval(function(){
			myPan2(dir, evn);
		}, 80);
		myPanning = true;
		//}
	}
}

function enableMyPan() {
	upPan = dojo.connect(dojo.byId("panTop"), "onmouseenter", this, dojo.hitch(null, "myPan", "up"));
	upPanStop = dojo.connect(dojo.byId("panTop"), "onmouseleave", this, stopMyPan);
	leftPan = dojo.connect(dojo.byId("panLeft"), "onmouseenter", this, dojo.hitch(null, "myPan", "left"));
	leftPanStop = dojo.connect(dojo.byId("panLeft"), "onmouseleave", this, stopMyPan);
	downPan = dojo.connect(dojo.byId("panDown"), "onmouseenter", this, dojo.hitch(null, "myPan", "down"));
	downPanStop = dojo.connect(dojo.byId("panDown"), "onmouseleave", this, stopMyPan);
	rightPan = dojo.connect(dojo.byId("panRight"), "onmouseenter", this, dojo.hitch(null, "myPan", "right"));
	rightPanStop = dojo.connect(dojo.byId("panRight"), "onmouseleave", this, stopMyPan);
	mapPanStop = dojo.connect(map, "onMouseOver", this, stopMyPanMap);
}
function disableMyPan() {
	dojo.disconnect(upPan);
	dojo.disconnect(upPanStop);
	dojo.disconnect(leftPan);
	dojo.disconnect(leftPanStop);
	dojo.disconnect(downPan);
	dojo.disconnect(downPanStop);
	dojo.disconnect(rightPan);
	dojo.disconnect(rightPanStop);
	dojo.disconnect(mapPanStop);
}
/*
this._fixedPan(0, this.height *- this._FIXED_PAN_FACTOR, arguments[0]); }
, panUpperRight : function() {
  this._fixedPan(this.width * this._FIXED_PAN_FACTOR, this.height *- this._FIXED_PAN_FACTOR, arguments[0]); }
, panRight : function() {
  this._fixedPan(this.width * this._FIXED_PAN_FACTOR, 0, arguments[0]); }
, panLowerRight : function() {
  this._fixedPan(this.width * this._FIXED_PAN_FACTOR, this.height * this._FIXED_PAN_FACTOR, arguments[0]); }
, panDown : function() {
  this._fixedPan(0, this.height * this._FIXED_PAN_FACTOR, arguments[0]); }
, panLowerLeft : function() {
  this._fixedPan(this.width *- this._FIXED_PAN_FACTOR, this.height * this._FIXED_PAN_FACTOR, arguments[0]); }
, panLeft : function() {
  this._fixedPan(this.width *- this._FIXED_PAN_FACTOR, 0, arguments[0]); }
, panUpperLeft : function() {
  this._fixedPan(this.width *- this._FIXED_PAN_FACTOR, this.height *- this._FIXED_PAN_FACTOR, arguments[0]); }
*/                                                                       