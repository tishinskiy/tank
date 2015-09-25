var canvas, ctx, x = 0, y = 0;

var leftR = false;
var rightR = false;
var frontM = false;
var backM = false;

var w = $("#canvas").width();
var h = $("#canvas").height();

var inc = 0;

var bullet = [];

var tank = {
	center: [50, 50],
	points: [[15, 15],[15, 10],[10, 10],[20, 0],[10, -10],[15, -10],[15, -15],[-15, -15],[-15, -10],[-10, -10],[-10, 10],[-15, 10],[-15, 15],],
	angle: 0,
	bg:"#364700",
	bColor: "#000",
	rPoints: [],
	speedR: 5,
	speed: 7,
	shadow:[],

	plan: {
		points: [[-10, -10],[10, -10],[10, -2],[30, -2],[30, 2],[10, 2],[10, 10],[-10, 10],],
		angle: 0,
		bg:"#cc8800",
		bColor: "#000",
		rPoints: [],
		draw:function(){
			this.center = tank.center;
			a =  (Math.atan((y - this.center[1]) / (x - this.center[0])));
			if( (x - this.center[0]) < 0 ) { a = Math.PI + a; }
			this.angle = a;
			objectRotate(this);
			drawObject(this);

		},
		shadow:[]
	},

	draw: function() {
		this.center = tank.center;
		if (leftR == true) {this.angle -= this.speedR * Math.PI / 180;}
		if (rightR == true) {this.angle += this.speedR * Math.PI / 180;}
		if (frontM == true) {objectMove(this);}
		if (backM == true) {objectMove(this, -1);}
		objectShadow(this)
		objectRotate(this);
		a = impact(this)
		if(a.length) {
			pushTank(a, this);
		};
		drawObject(this);
		this.plan.draw();
	},
}

user = Object.create(tank)


var boxProto = {
	points: [[-25, -25], [25, -25], [25, 25], [-25, 25]],
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
	bg: "red",
	bColor: "transparent",
	speed: 20,
	shoot:[],
	steps: 30,
	shadow:[],
	rPoints: [],
	draw:function(){
		objectMove(this);
		objectRotate(this);
		objectShadow(this)
		a = impact(this);
		if (a.length) {
			objectDel(bullet, bullet.indexOf(this));
			objectDel(box, a);
			box.push(Object.create(boxProto).constructor([getRandomInt(50, w-50), getRandomInt(50, h-50)]));
		};
		drawObject(this);
		bulletDell(this);
		this.steps--;
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
	box.push(Object.create(boxProto).constructor(item));
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
	bullet.push(Object.create(bulletProto).constructor([tank.plan.center[0] + 30 * (Math.cos(tank.plan.angle)), tank.plan.center[1] + 30 * (Math.sin(tank.plan.angle))], tank.plan.angle));
});

function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
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

function bulletDell(obj) {
	if(obj.steps <= 0) {
		objectDel(bullet, bullet.indexOf(obj));
	}
}

function objectDel(arr, id) {
		arr.splice(id, 1);
}

var impact = function (obj) {
	boxArr = [];

	box.forEach(function(item, i, arr) {

		if (
				(
					(arr[i].shadow[0][0] < obj.shadow[0][1]) && (arr[i].shadow[0][1] > obj.shadow[0][1]) ||
					(arr[i].shadow[0][1] > obj.shadow[0][0]) && (arr[i].shadow[0][0] < obj.shadow[0][0])
				)
			&& (
				(arr[i].shadow[1][0] < obj.shadow[1][1]) && (arr[i].shadow[1][1] > obj.shadow[1][1]) ||
				(arr[i].shadow[1][1] > obj.shadow[1][0]) && (arr[i].shadow[1][0] < obj.shadow[1][0])
				)
			)

			boxArr.push(i);

	});
	return (boxArr);

}

function pushTank(boxes, tank) {

	boxes.forEach(function(item, i, arr) {

		a =  (Math.atan((tank.center[1] - box[item].center[1]) / (tank.center[0] - box[item].center[0])));

		if( (tank.center[0] - box[item].center[0]) < 0 ) { a = Math.PI + a; }

		if ((a >= -0.7854) && (a < 0.7854)) {//right
			tank.center[0] = tank.center[0] + tank.speed * Math.abs(Math.cos(tank.angle));
			}

		if ((a >= 0.7854) && (a < 2.3562)) { //bottom
			tank.center[1] = tank.center[1] + tank.speed * Math.abs(Math.sin(tank.angle));
		}

		if ((a >= 2.3562) && (a < 3.9270)) { //left
			tank.center[0] = tank.center[0] - tank.speed * Math.abs(Math.cos(tank.angle));
		}

		if (((a >= 3.9270) && (a < 4.7124)) || (a >= -1.5708) && (a < -0.7854) ) { //top
			tank.center[1] = tank.center[1] - tank.speed * Math.abs(Math.sin(tank.angle));
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
		if (box.length) {
			box.forEach(function(item, i, arr) {
				arr[i].draw();
			});
		}
		user.draw();
		if (bullet.length) {
			bullet.forEach(function(item, i, arr) {
				arr[i].draw();
			});
		}
	}
};

init();

setInterval(draw(),35);