var ctx, x = 0, y = 0;

var leftR = false;
var rightR = false;
var frontM = false;
var backM = false;

var w = $("#canvas").width();
var h = $("#canvas").height();

var inc = 0;


var planProto = {
		points: [[-10, -10],[10, -10],[10, -2],[30, -2],[30, 2],[10, 2],[10, 10],[-10, 10]],
		angle: 0,
		bg:"#cc8800",
		bColor: "#000",
		rPoints: [],
		center: [50, 50],

		draw:function(){
			a =  (Math.atan((y - this.center[1]) / (x - this.center[0])));
			if( (x - this.center[0]) < 0 ) { a = Math.PI + a; }
			this.angle = a;
			objectRotate(this);
			drawObject(this);

		},
		shadow:[]
	};

var tank = {
	name: "tank",
	center: [50, 50],
	points: [[15, 15],[15, 10],[10, 10],[20, 0],[10, -10],[15, -10],[15, -15],[-15, -15],[-15, -10],[-10, -10],[-10, 10],[-15, 10],[-15, 15],],
	angle: 0,
	bg:"#364700",
	bColor: "#000",
	rPoints: [],
	speedR: 5,
	speed: 0,
	maxSpeed: 10,
	minSpeed: -7,
	kd: 20,
	shootTime: 20,
	shadow: [],
	bullet: [],
	kill: 0,


	draw: function() {
		if (this.center == [NaN, NaN]) {
			this.center = [0, 0];
		}
		this.shootTime++;
		objectShadow(this)
		objectRotate(this);
		a = impact(this, [bots, box]);
		if(a.length) {
			pushTank(a, this);
		};
		drawObject(this);
		this.plan.draw();
		a = this;
		if (this.bullet.length) {
			this.bullet.forEach(function(item, i, arr) {
				arr[i].draw(a);
			});
		}
	},
	constructor:function(name, center, angle, bg) {
		this.plan = Object.create(planProto),
		this.bullet = [];
		this.name = name;
		this.center = center;
		this.bg = bg;
		this.angle = angle;
		this.plan.center = center;
		return this;
	},

	tankShoot:function() {
		if (this.shootTime >= this.kd) {
			this.bullet.push(Object.create(bulletProto).constructor([this.plan.center[0] + 30 * (Math.cos(this.plan.angle)), this.plan.center[1] + 30 * (Math.sin(this.plan.angle))], this.plan.angle, this));
			this.shootTime = 0;
		}
	},
}

var botProto = {

	create: function(x, y, name){
		bot = Object.create(tank).constructor(name, [x, y], 0, "red");
		bot.kd = 50;

		bot.draw = function(){
			tank.draw.apply(this, arguments);
			botMove(this);
			if (this.shootTime >= this.kd) {
				this.tankShoot();
			
			}
		};
		return bot;
	},
}

var bots = [];

for (var i = 0; i <5; i++) {
	bots[i] = botProto.create(getRandomInt(50, w-50), getRandomInt(50, h-50), "bot_"+i);

};


user = Object.create(tank).constructor("user", [50, 50], 0, "green");
user.bullet = [];
user.draw = function(){
	tank.draw.apply(this, arguments);
	objectMove(this);
	if (leftR == true) {this.angle -= this.speedR * Math.PI / 180;}
	if (rightR == true) {this.angle += this.speedR * Math.PI / 180;}
	if (frontM == true) {
		this.speed += (this.maxSpeed - this.speed) / 20;
	}
	else {this.speed += (0 - this.speed) / 20;}
	if (backM == true) {this.speed += (this.minSpeed - this.speed) / 10;}
}


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
	shoot: [],
	steps: 30,
	shadow: [],
	rPoints: [],

	draw:function(obj){
		objectMove(this);
		objectRotate(this);
		objectShadow(this)
		a = impact(this, [box]);
		if (a.length) {
			this.parent.kill += a.length;
			objectDel(obj.bullet, obj.bullet.indexOf(this));
			a.forEach(function(item, i, arr) {
				objectDel(box, box.indexOf(item));
			});
		};
		drawObject(this);
		bulletDell(obj, this);
		this.steps--;
	},
	constructor: function(center, angle, parent) {
		this.center = center;
		this.parent = parent;
		this.angle = angle;
		return this;
	},

}

function bulletDell(tankModel, obj) {
	if(obj.steps <= 0) {
		objectDel(tankModel.bullet, tankModel.bullet.indexOf(obj));
	}
}

function objectDel(arr, id) {
	arr.splice(id, 1);
}

var box = [];

boxes = [[100, 100], [100, 200], [100, 300], [100, 400], [100, 500], [100, 600], [300, 100], [300, 150], [300, 200], [300, 250], [300, 300], [300, 370],];

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
	user.tankShoot();
});

function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function botMove(obj) {
	a = obj.center[0];
	b = obj.center[1];
	
	if (a < b) {c = a / b / 10;} else {c = (b+10) / a / 10 * -1;}
	obj.angle += Math.sin(c);

	obj.speed += ((obj.maxSpeed-2 + Math.sin(c)*10 - obj.speed) / 10 );
	objectMove(obj);

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

var impact = function (obj, imp) {

	impArr = [];

	imp.forEach(function(itemA, j, arrA) {

		arrA[j].forEach(function(item, i, arr) {

			if (arr[i].shadow.length) {

				if (
						(
							(arr[i].shadow[0][0] < obj.shadow[0][1]) && (arr[i].shadow[0][1] > obj.shadow[0][1]) ||
							(arr[i].shadow[0][1] > obj.shadow[0][0]) && (arr[i].shadow[0][0] < obj.shadow[0][0])
						)
					&& (
						(arr[i].shadow[1][0] < obj.shadow[1][1]) && (arr[i].shadow[1][1] > obj.shadow[1][1]) ||
						(arr[i].shadow[1][1] > obj.shadow[1][0]) && (arr[i].shadow[1][0] < obj.shadow[1][0])
						)
					){

					impArr.push(arr[i]);

				}
			}
		});
	});

	return (impArr);

}

function pushTank(boxes, tank) {

	boxes.forEach(function(item, i, arr) {

		a =  (Math.atan((tank.center[1] - item.center[1]) / (tank.center[0] - item.center[0])));

		tank.center[0] = tank.center[0] - (tank.speed) * (Math.cos(tank.angle));
		tank.center[1] = tank.center[1] - (tank.speed) * (Math.sin(tank.angle));
		

		// if( (tank.center[0] - item.center[0]) < 0 ) { a = Math.PI + a; }

		// if ((a >= -0.7854) && (a < 0.7854)//right
		// 	|| (a >= 2.3562) && (a < 3.9270)) { //left
		// 	tank.center[0] = tank.center[0] - (tank.speed) * (Math.cos(tank.angle));
		// 	}

		// if ((a >= 0.7854) && (a < 2.3562) //bottom
		// || ((a >= 3.9270) && (a < 4.7124)) || (a >= -1.5708) && (a < -0.7854) ) { //top
		// 	tank.center[1] = tank.center[1] - (tank.speed) * (Math.sin(tank.angle));
		// }

		tank.speed = 0;
	});
}

function objectMove(obj) {

	xp = obj.center[0] + (obj.speed) * (Math.cos(obj.angle));
	yp = obj.center[1] + (obj.speed) * (Math.sin(obj.angle));

	if (obj.center[0] > w) {xp = 0;}
	if (obj.center[1] > h) {yp = 0;}
	if (obj.center[0] < 0) {xp = w;}
	if (obj.center[1] < 0) {yp = h;}

	obj.center[0] =xp;
	obj.center[1] =yp;
}

function objectRotate(obj) {
	objR = [];

	a = Math.cos(obj.angle);
	b = Math.sin(obj.angle);

	obj.points.forEach(function(item, i, arr) {

		itemR0 = item[0] * a - item[1] * b;
		itemR1 = item[0] * b + item[1] * a;

		objR[i] = [itemR0, itemR1]

	});

	obj.rPoints = objR;

}

function objectShadow(obj){
	xMin = xMax = yMin = yMax = 0;
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
		for (key in bots) {
			bots[key].draw();
		}

		if (boxes.length > box.length) {
			for (var i = boxes.length - box.length - 1; i >= 0; i--) {
				box.push(Object.create(boxProto).constructor([getRandomInt(50, w-50), getRandomInt(50, h-50)]));
				
			};
		}

	}

};

console.log(bots);
console.log(box);

init();

setInterval(draw(),30);
