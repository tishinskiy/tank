var canvas, ctx, w, h, x = 0, y = 0, plan;

plan = {
	points: [[-30, -15],[30, 0],[-30, 15],[-15, 0]],
	center: [150, 150],
	angle: 0
}
baza = {
	points:[[-15, -15],[-15, 15],[15, 15],[15, 10],[10, 10],[15, 0],[10, -10],[15, -10],[15, -15]],
	center:[50, 50],
	angle: 0
}
var w = $("#canvas").width();
var h = $("#canvas").height();
var xPos = w/2;
var yPos = h/2;
var mouseWhere = false;
var tSpeed = 5;

$("#canvas").mousedown(function(event) {mouseWhere = true;});
$("#canvas").mouseup(function(event) {mouseWhere = false;});

$("#canvas").mousemove(function(event) {
	x = event.pageX - $(this).offset().left;
	y = event.pageY - $(this).offset().top;
});


function init() {
	canvas = document.getElementById("canvas");
	ctx = canvas.getContext('2d');
}

function angleValue(obj) {
	a =  (Math.atan((y - obj.center[1]) / (x - obj.center[0])));
	if( (x - obj.center[0]) < 0 ) { a = Math.PI + a; }
	obj.angle = a;
}

function objectMove(obj) {
	xp = obj.center[0] + tSpeed * (Math.cos(obj.angle));
	yp = obj.center[1] + tSpeed * (Math.sin(obj.angle));
	obj.center[0] =xp;
	obj.center[1] =yp;

}

function objectRotate(obj) {

	objR = [];

	obj.points.forEach(function(item, i, arr) {

		itemR0 = item[0] * Math.cos(obj.angle) - item[1] * Math.sin(obj.angle);
		itemR1 = item[0] * Math.sin(obj.angle) + item[1] * Math.cos(obj.angle);

		objR[i] = [itemR0, itemR1]

	});

	return objR;

}

var drawObject = function(obj, bg, a) {


	if (mouseWhere == true) {objectMove(obj);}

	if (a == "auto") {angleValue(obj)}

	objP = objectRotate(obj);

	ctx.fillStyle = bg;
	ctx.beginPath();

	objP.forEach(function(item, i, arr) {
		ctx.lineTo(obj.center[0] + item[0], obj.center[1] + item[1]);
	});

	ctx.lineTo(obj.center[0] + objP[0][0], obj.center[1] + objP[0][1]);
	ctx.fill();
	ctx.stroke();
	ctx.closePath();

}


var draw = function() {

	var angle = 0;

	console.log(22);

	function inRad(num) {
		return num * Math.PI / 180;
	}

	return function(){
		ctx.clearRect(-20, -20, w+20, h+20);
		drawObject(baza, "#cc8800", "auto");
		drawObject(plan, "#364700", "auto");
		angle+=1;
	}

};

init();
setInterval(draw(),100);