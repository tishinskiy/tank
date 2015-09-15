var canvas, ctx, w, h, x = 0, y = 0;

var leftR = false;
var rightR = false;
var frontM = false;
var backM = false;

var plan = {
	points: [[-10, -10],[10, -10],[10, -2],[30, -2],[30, 2],[10, 2],[10, 10],[-10, 10],],
	center: [50, 50],
	angle: 0,
	bg:"#cc8800",
	speed: 5,
}
var baza = {
	points:[[15, 15],[15, 10],[10, 10],[20, 0],[10, -10],[15, -10],[15, -15],[-15, -15],[-15, -10],[-10, -10],[-10, 10],[-15, 10],[-15, 15],],
	center:[50, 50],
	angle: 0,
	bg:"#364700",
	speed: 3
}
var bulet = {
	points: [[0, 0], [5,0]],
	bg:"#FF3802",
	center:[],
	angle: 0,
	speed: 50,
	shoot :[]
}


var w = $("#canvas").width();
var h = $("#canvas").height();



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

$("#canvas").mousedown(function(event) {
	bc = plan.center;
	bulet.shoot = [x,y];
	bulet.angle = plan.angle;
	bulet.center =[plan.center[0] + 30 * (Math.cos(bulet.angle)), plan.center[1] + 30 * (Math.sin(bulet.angle))];
});

function drawShoot() {
	drawObject(bulet);
	var xpb = bulet.center[0] + bulet.speed * (Math.cos(bulet.angle));
	var ypb = bulet.center[1] + bulet.speed * (Math.sin(bulet.angle));

	bulet.center[0] =xpb;
	bulet.center[1] =ypb;
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

var drawObject = function(obj, a) {

	if (leftR == true) {baza.angle -= 3 * Math.PI / 180;}
	if (rightR == true) {baza.angle += 3 * Math.PI / 180;}
	if (frontM == true) {objectMove(baza);}
	if (backM == true) {objectMove(baza, -1);}

	if (a == "auto") {angleValue(obj)}

	objP = objectRotate(obj);

	ctx.fillStyle = obj.bg;
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
	return function(){
		ctx.clearRect(-20, -20, w+20, h+20);
		drawObject(baza);
		plan.center = baza.center;
		drawObject(plan, "auto");
		if(bulet.shoot.length > 0) {drawShoot(bulet)}
		// angle+=1;
	}

};

init();
setInterval(draw(),40);