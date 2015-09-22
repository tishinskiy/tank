var canvas, ctx, x = 0, y = 0;

var leftR = false;
var rightR = false;
var frontM = false;
var backM = false;

var w = $("#canvas").width();
var h = $("#canvas").height();

var inc = 0;

var bullet = [];

var plan = {
	points: [[-10, -10],[10, -10],[10, -2],[30, -2],[30, 2],[10, 2],[10, 10],[-10, 10],],
	center: [50, 50],
	angle: 0,
	bg:"#cc8800",
	bColor: "#000",
	rPoints: [],
	draw:function(){
		a =  (Math.atan((y - this.center[1]) / (x - this.center[0])));
		if( (x - this.center[0]) < 0 ) { a = Math.PI + a; }
		this.angle = a;
		this.center = baza.center;
		objectRotate(this);
		drawObject(this);

	},
	shadow:[]
}

var baza = {
	points: [[15, 15],[15, 10],[10, 10],[20, 0],[10, -10],[15, -10],[15, -15],[-15, -15],[-15, -10],[-10, -10],[-10, 10],[-15, 10],[-15, 15],],
	center:[50, 50],
	angle: 0,
	bg:"#364700",
	bColor: "#000",
	rPoints: [],
	speedR: 5,
	draw:function(){
		if (leftR == true) {this.angle -= this.speedR * Math.PI / 180;}
		if (rightR == true) {this.angle += this.speedR * Math.PI / 180;}
		if (frontM == true) {objectMove(this);}
		if (backM == true) {objectMove(this, -1);}
		objectRotate(this);
		objectShadow(this)
		impact();
		drawObject(this);
	},
	speed: 7,
	shadow:[]

}

var boxProto = {
	points: [[-25, -25], [25, -25], [25, 25], [-25, 25]],
	// center: [250, 360],
	angle: 0,
	bg:"#FF6D1D",
	bColor: "#000",
	rPoints: [],
	speed: 0,
	draw:function(){
		objectRotate(this);
		objectShadow(this)
		drawObject(this);
	},
	constructor: function(center) {
		this.center = center;
		return this;
	},
	shadow:[]

}


var bulletProto = {
	points: [[-10, -1], [-10, 1], [10,1], [10,-1]],
	// grad: 'red',
	bg: "red",
	bColor: "transparent",
	speed: 20,
	shoot:[],
	steps: 0,
	shadow:[],
	rPoints: [],
	draw:function(){
		objectMove(this);
		objectRotate(this);
		drawObject(this);
		bulletDell(this);
		this.steps++;
	},
	constructor: function(center, angle) {
		this.center = center;
		this.angle = angle;
		return this;
	},

}

var box = [];

boxes = [
	[100, 100],
	[100, 200],
	[100, 300],
	[100, 400],
	[100, 500],
	[100, 600],
	[300, 100],
	[300, 150],
	[300, 200],
	[300, 250],
	[300, 300],
	[300, 370],
];

boxes.forEach(function(item, i, arr) {
	box[i] = Object.create(boxProto).constructor(item);
});




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
	bullet[inc] = Object.create(bulletProto).constructor([plan.center[0] + 30 * (Math.cos(plan.angle)), plan.center[1] + 30 * (Math.sin(plan.angle))], plan.angle);
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

function bulletDell(obj) {
	if(obj.steps > 50) {
		objectDel(bullet, bullet.indexOf(obj));
	}
}

function objectDel(arr, id) {
		arr.splice(id, 1);
}

var impact = function () {

	box.forEach(function(item, i, arr) {
		
		if (
			(
				(arr[i].shadow[0][0] < baza.shadow[0][1]) && (arr[i].shadow[0][1] > baza.shadow[0][1]) ||
				(arr[i].shadow[0][1] > baza.shadow[0][0]) && (arr[i].shadow[0][0] < baza.shadow[0][0])
			)
			&& (
				(arr[i].shadow[1][0] < baza.shadow[1][1]) && (arr[i].shadow[1][1] > baza.shadow[1][1]) ||
				(arr[i].shadow[1][1] > baza.shadow[1][0]) && (arr[i].shadow[1][0] < baza.shadow[1][0])
				)
			)
		{

			a =  (Math.atan((baza.center[1] - arr[i].center[1]) / (baza.center[0] - arr[i].center[0])));
			if( (baza.center[0] - arr[i].center[0]) < 0 ) { a = Math.PI + a; }

			if ((a >= -0.7854) && (a < 0.7854)) {//right
				baza.center[0] = baza.center[0] + baza.speed * Math.cos(a);
				} 

			if ((a >= 0.7854) && (a < 2.3562)) { //bottom
				baza.center[1] = baza.center[1] + baza.speed * Math.sin(a);
			}

			if ((a >= 2.3562) && (a < 3.9270)) { //left
				baza.center[0] = baza.center[0] + baza.speed * Math.cos(a);
			}

			if (((a >= 3.9270) && (a < 4.7124)) || (a >= -1.5708) && (a < -0.7854) ) { //top
				baza.center[1] = baza.center[1] + baza.speed * Math.sin(a);
			}
		}
	});

}

function objectMove(obj, course) {

	if(!course) {course = 1;}

	xp = obj.center[0] + (obj.speed * course) * (Math.cos(obj.angle));
	yp = obj.center[1] + (obj.speed * course) * (Math.sin(obj.angle));

	if (obj.center[0] > w) {xp = 0;}
	if (obj.center[1] > h) {yp = 0;}
	if (obj.center[0] < 0) {xp = w;}
	if (obj.center[1] < 0) {yp = h;}

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

	obj.rPoints = objR;

}

function objectShadow(obj){
	xMin = 0;
	xMax = 0;
	yMin = 0;
	yMax = 0;
	obj.rPoints.forEach(function(item, i, arr) {
		if (item[0] < xMin) {xMin = item[0]}
		if (item[0] > xMax) {xMax = item[0]}
		if (item[1] < yMin) {yMin = item[1]}
		if (item[1] > yMax) {yMax = item[1]}
	});
	obj.shadow = [[xMin + obj.center[0], xMax + obj.center[0]], [yMin + obj.center[1], yMax + obj.center[1]]];
}

var drawObject = function(obj, a) {


	ctx.fillStyle = obj.bg;
	ctx.strokeStyle = obj.bColor;
	ctx.lineWidth = 0.5;
	ctx.beginPath();

	obj.rPoints.forEach(function(item, i, arr) {
		ctx.lineTo(obj.center[0] + item[0], obj.center[1] + item[1]);
	});

	ctx.lineTo(obj.center[0] + obj.rPoints[0][0], obj.center[1] + obj.rPoints[0][1]);
	ctx.fill();
	ctx.stroke();
	ctx.closePath();

	// obj.shadow = objectShadow(objP, obj.center);
}


var draw = function() {
	return function(){
		ctx.clearRect(-20, -20, w+20, h+20);
		if (box.length > 0) {
			box.forEach(function(item, i, arr) {
				arr[i].draw();
			});
		}
		baza.draw();
		plan.draw();
		if (bullet.length > 0) {
			bullet.forEach(function(item, i, arr) {
				arr[i].draw();
			});
		}
	}
};

init();
console.log(box);
setInterval(draw(),35);