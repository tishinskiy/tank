var canvas, ctx, w, h, x = 0, y = 0, plan;

var leftR = false;
var rightR = false;
var frontM = false;
var backM = false;

plan = {
	points: [
		[-10, -10],
		[10, -10],
		[10, -2],
		[30, -2],
		[30, 2],
		[10, 2],
		[10, 10],
		[-10, 10],
	],
	center: [50, 50],
	angle: 0,
	speed: 5
}
baza = {
	points:[
		[15, 15],
		[15, 10],
		[10, 10],
		[15, 0],
		[10, -10],
		[15, -10],
		[15, -15],
		[-15, -15],
		[-15, -10],
		[-10, -10],
		[-10, 10],
		[-15, 10],
		[-15, 15],
	],
	center:[50, 50],
	angle: 0,
	speed: 5
}
var w = $("#canvas").width();
var h = $("#canvas").height();
console.log(h);
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

window.onkeydown = function(e){
	e = e ? e : window.event;
	if(e.keyCode == 65) {leftR = true};
	if(e.keyCode == 68) {rightR =true};
	if(e.keyCode == 87) {frontM = true};
	if(e.keyCode == 83) {backM =true};
}
window.onkeyup = function(e){
	e = e ? e : window.event;
	if(e.keyCode == 65) {leftR = false};
	if(e.keyCode == 68) {rightR =false};
	if(e.keyCode == 87) {frontM = false};
	if(e.keyCode == 83) {backM =false};
}


function init() {
	canvas = document.getElementById("canvas");
	ctx = canvas.getContext('2d');
	canvas.width = w;
	canvas.height = h;
}

function angleValue(obj) {
	a =  (Math.atan((y - obj.center[1]) / (x - obj.center[0])));
	if( (x - obj.center[0]) < 0 ) { a = Math.PI + a; }
	obj.angle = a;
}

function objectMove(obj, course) {

	if(!course) {course = 1;}

	xp = obj.center[0] + (obj.speed * course) * (Math.cos(obj.angle));
	yp = obj.center[1] + (obj.speed * course) * (Math.sin(obj.angle));

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


	// if (mouseWhere == true) {objectMove(obj);}

	if (leftR == true) {baza.angle -= 3 * Math.PI / 180;}
	if (rightR == true) {baza.angle += 3 * Math.PI / 180;}
	if (frontM == true) {objectMove(baza);}
	if (backM == true) {objectMove(baza, -1);}

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
		drawObject(baza, "#cc8800");
		drawObject(plan, "#364700", "auto");
		plan.center = baza.center;
		// angle+=1;
	}

};

init();
setInterval(draw(),40);