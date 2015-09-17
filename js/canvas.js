var canvas, ctx, x = 0, y = 0;

var leftR = false;
var rightR = false;
var frontM = false;
var backM = false;

var w = $("#canvas").width();
var h = $("#canvas").height();

var inc = 0;

var bulet = [];

var plan = {
	points: [[-10, -10],[10, -10],[10, -2],[30, -2],[30, 2],[10, 2],[10, 10],[-10, 10],],
	center: [50, 50],
	angle: 0,
	bg:"#cc8800",
	draw:function(){
		a =  (Math.atan((y - this.center[1]) / (x - this.center[0])));
		if( (x - this.center[0]) < 0 ) { a = Math.PI + a; }
		this.angle = a;
		this.center = baza.center;

		drawObject(this);

	},
}

var baza = {
	points:[[15, 15],[15, 10],[10, 10],[20, 0],[10, -10],[15, -10],[15, -15],[-15, -15],[-15, -10],[-10, -10],[-10, 10],[-15, 10],[-15, 15],],
	center:[50, 50],
	angle: 0,
	bg:"#364700",
	speedR: 5,
	draw:function(){
		if (leftR == true) {this.angle -= this.speedR * Math.PI / 180;}
		if (rightR == true) {this.angle += this.speedR * Math.PI / 180;}
		if (frontM == true) {objectMove(this);}
		if (backM == true) {objectMove(this, -1);}
		drawObject(this);
	},
	speed: 10,

}
var buletProto = {
	points: [[0, 0], [8,0]],
	bg:"#FF3802",
	draw:function(){
		objectMove(this);
		drawObject(this);
		buletDell(this);
	},
	speed: 20,
	shoot :[],
	constructor: function(startP, center, angle) {
		this.startP = startP;
		this.center = center;
		this.angle = angle;
		return this;
	}
}




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
	bulet[inc] = Object.create(buletProto).constructor([plan.center[0], plan.center[1]], [plan.center[0] + 30 * (Math.cos(plan.angle)), plan.center[1] + 30 * (Math.sin(plan.angle))], plan.angle);
	inc++;
});

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

function buletDell(obj) {
	if(Math.sqrt(Math.pow(Math.abs(obj.center[0] - obj.startP[0]), 2) + Math.pow(Math.abs(obj.center[1] - obj.startP[1]), 2)) > 500) {
		bulet.splice(bulet.indexOf(obj), 1);

	}
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
		baza.draw();
		plan.draw();
		if (bulet.length > 0) {
			bulet.forEach(function(item, i, arr) {
				arr[i].draw();
			});
		}
	}
};

init();
setInterval(draw(),35);