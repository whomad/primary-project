var canvasWidth = 400;
var canvasHeight = 600;
//获取画布
var canvas = document.getElementById("canvas");
canvas.width = canvasWidth;
canvas.height = canvasHeight;
var context = canvas.getContext("2d");
//定义英雄属性
var heroW = 66;
var heroH = 82;
var herospeed = 15;
var heroIsDie = false;
var heroImage = new Image();
heroImage.src = "image/herofly.png";

//定义敌人的属性
var enemytype = 0;
var enemy1W = 190,
	enemy1H = 34,
	en1W = 38,
	enemy1speed = 6;
var enemy1Image = new Image();
enemy1Image.src = "image/enemy1.png";
var enemy2W = 1100,
	enemy2H = 164,
	en2W = 110,
	enemy2speed = 4;
var enemy2Image = new Image();
enemy2Image.src = "image/enemy2.png";
var enemy3W = 276,
	enemy3H = 64,
	en3W = 46,
	enemy3speed = 3;
var enemy3Image = new Image();
enemy3Image.src = "image/enemy3.png";

//子弹的属性
var bullet1Img = new Image();
bullet1Img.src = "image/bullet1.png";
var bullet1W = 6,
	bullet1H = 14,
	bullet1speed = 10;
//第二种子弹
var bullet2Img = new Image();
bullet2Img.src = "image/bullet2.png";
var bullet2W = 48,
	bullet2H = 14,
	bullet2speed = 10;
//奖励子弹
var propImg = new Image();
propImg.src = "image/prop.png";
var propImgW = 39,
	propImgH = 68,
	propImgspeed = 5;
//奖励子弹的存在时间
var propTimer = 0;
//创建子弹类
function bulletclass(x, y, bulletwidth, bulletheight, img, speed) {
	this.x = x;
	this.y = y;
	this.width = bulletwidth;
	this.height = bulletheight;
	this.Img = img;
	this.speed = speed;
	this.moveup = function() {
		this.y -= this.speed;
		//定义一个变量，用来标记子弹是否碰到飞机
		checkIsconflict(this);
		if (this.y + this.height <= 10) {
			//子弹从数组中移除
			//findIndexForBullet算出当前子弹的下标
			var index = findIndexForBullet(this);
			bullets.splice(index, 1);
		}
		this.draw();
	}
	this.draw = function() {
		context.drawImage(this.Img, 0, 0, this.width, this.height, this.x, this.y, this.width, this.height);
	}
} //创建子弹类方法结束
//定义一个数组
var enemys = [];
for (var i = 0; i < 15; i++) {
	var yjj = random(40, 100);
	var x = random(0, canvas.width - en1W);
	if (i > 0) {
		y = enemys[i - 1].y - yjj;
	} else {
		y = -150;
	}
	CreatRandomenemy(x, y);
} //定义一个数组方法结束
//背景图片属性
var bg1 = new Image();
bg1.src = "image/background.png";
var bg2 = new Image();
bg2.src = "image/background.png";
var bgspeed = 10;
//创建一个背景类
var backgroundclass = function(y1, y2, b1, b2, bgspeed) {
		this.y1 = y1;
		this.y2 = y2;
		this.b1 = b1;
		this.b2 = b2;
		this.moveup = function() {
			this.y1 += bgspeed;
			this.y2 += bgspeed;
			if (this.y1 >= canvas.height) {
				this.y1 = canvas.height * -1;
			}
			if (this.y2 >= canvas.height) {
				this.y2 = canvas.height * -1;
			}
			this.draw();
		}
		this.draw = function() {
			context.drawImage(this.b1, 0, this.y1, canvas.width, canvas.height);
			context.drawImage(this.b2, 0, this.y2, canvas.width, canvas.height);
		}
	} //创建一个背景类结束
var background = new backgroundclass(0, -canvas.height, bg1, bg2, bgspeed);
//创建一个飞机hero类
var heroclass = function(x, y, heroW, heroH, img) {
		this.x = x;
		this.y = y;
		this.heroW = heroW;
		this.heroH = heroH;
		//飞机移动的方法
		this.move = function(direction) {
			switch (direction) {
				case "上":
					this.y -= herospeed;
					if (this.y <= 0) {
						this.y = 0;
					}

					break;
				case "下":
					this.y += herospeed;
					if (this.y + hero1.heroH >= canvas.height) {
						this.y = canvas.height - hero1.heroH;
					}
					break;
				case "左":
					this.x -= herospeed;
					if (this.x <= 0) {
						this.x = 0;
					}
					break;
				case "右":
					this.x += herospeed;
					if (this.x + hero1.heroW >= canvasWidth) {
						this.x = canvas.width - hero1.heroW;
					}
					break;
				default:
					break;
			}
		}; //飞机移动方法结束
		this.Img = img;
		this.bullettype = 1;
		//原图的起始点
		this.startX = 0;
		this.animation = function() {}
			//飞机开火的方法
		this.fire = function() {}; //飞机开火结束
		//飞机死亡的方法
		this.checkdie = function() {
			//this和enemys的碰撞检测
			for (var i = 0; i < enemys.length; i++) {
				//检测碰撞
				var plane = this;
				var diren = enemys[i];
				var aa = plane.y <= (diren.y + diren.height);
				var bb = (plane.y + plane.heroH) >= diren.y;
				var cc = (plane.x + plane.heroW) >= diren.x;
				var dd = plane.x <= (diren.x + diren.width);
				// 开始检测碰撞
				if (aa && bb && cc && dd) {
					if (diren.width == 39) {
						hero1.bullettype = 2;
					}
				}
			}
			if (hero1.bullettype == 2) {
							setInterval(function() {
								propTimer++;
								if (propTimer == 4000) {
									hero1.bullettype = 1;
									propTimer = 0;
								}
//								console.log(propTimer);
							}, 1000);
						}
		}; //飞机死亡的方法结束
		
		//draw plane
		this.draw = function() {
			if (this.startX == 0) {
				this.startX = heroW;
			} else if (this.startX == heroW) {
				this.startX = 0;
			}
			context.drawImage(this.Img, this.startX, 0, heroW, heroH, this.x, this.y, this.heroW, this.heroH);
		}
	} //创建飞机方法结束
	//创建一个飞机
var hero1x = (canvasWidth - heroW) * 0.5;
var hero1y = canvasHeight - heroH;
var hero1 = new heroclass(hero1x, hero1y, heroW, heroH, heroImage);
hero1.draw();
//创建子弹数组
var bullets = [];

//键盘的控制方法
document.onkeydown = function() {
		switch (event.keyCode) {
			case 38:
				//上
				hero1.move("上");
				break;
			case 40:
				//下
				hero1.move("下");
				break;00
			case 37:
				//左
				hero1.move("左");
				break;
			case 39:
				//右
				hero1.move("右");
				break;
		}
	} //键盘控制方法结束
setInterval(function() {
	context.clearRect(0, 0, canvas.width, canvas.height);
	background.moveup();
	hero1.draw();
	for (var i = 0; i < enemys.length; i++) {
		enemys[i].down();
	}
	//		bullet1.moveup();一个子弹动
	//所有的子弹动
	for (var i = 0; i < bullets.length; i++) {
		bullets[i].moveup();
	}
	hero1.checkdie();
}, 50);
//创建子弹的定时器
var bullettime = 400;
setInterval(function() {
	var bullet1x = hero1.x - bullet1W / 2 + heroW / 2;
	var bullet1y = hero1.y - bullet1H;
	var bullet2x = hero1.x - bullet2W / 2 + heroW / 2;
	var bullet2y = hero1.y - bullet2H;
	if (hero1.bullettype == 1) {
		var bullet1 = new bulletclass(bullet1x, bullet1y, bullet1W, bullet1H, bullet1Img, bullet1speed);
		bullets.push(bullet1);
	}
	if (hero1.bullettype == 2) {
		var bullet2 = new bulletclass(bullet2x, bullet2y, bullet2W, bullet2H, bullet2Img, bullet2speed);
		bullets.push(bullet2);
	}
}, bullettime); //创建子弹的定时器结束
//检测子弹和飞机碰撞的方法
function checkIsconflict(bullet) {
	for (var i = 0; i < enemys.length; i++) {
		//检测子弹bullet和飞机enemys[i]是否碰撞
		if (Isconflict(bullet, enemys[i])) {
			//判断是否是奖励子弹
			if (enemys[i].width == 39) {
				enemys[i].Isconflict = false;
			} else {
				//子弹从数组中移除
				//findIndexForBullet算出当前子弹的下标
				var index = findIndexForBullet(this);
				bullets.splice(index, 1)
					//飞机从数组中移除

				//			enemys[i].die();
				//换图片
				//			changeimage()
				enemys[i].Isconflict = true;
				//			enemys[i].draw();
				//			enemys.splice(i , 1);
				//			addnewEnemys();
				break;
			}
		}
	}
}
//根据子弹求下标
function findIndexForBullet(b) {
	var myIndex = 0;
	for (var i = 0; i < bullets.length; i++) {
		if (bullets[i] == b) {
			myIndex = i
		}
	}
	return myIndex;
}
//var enemydie = false;
//检测两个东西是否碰撞
function Isconflict(a, b) {
	if (a.y <= b.y + b.height && ((a.x >= b.x && a.x <= b.x + b.width) || (a.x + a.width >= b.x && a.x + a.width <= b.x + b.width))) {
		//		enemydie = true;
		return true;
	} else {
		return false;
	}
}
//创建敌机的方法
function enemyFunction(x, y, enemyW, enemyH, img, speed) {
	this.x = x;
	this.y = y;
	this.width = enemyW;
	this.height = enemyH;
	this.speed = speed;
	this.enemydie = false;
	this.startx = 0;
	//敌机移动的方法
	this.down = function() {
			this.y += this.speed;
			if (this.y > canvasHeight + 200) {
				//移除数组中的第一个元素
				enemys.shift();
				//enemys.pop();移除数组中的最后一个元素
				//新创建一个enemy  ，并且push到数组中
				addnewEnemys();
			} else {
				this.draw();
			}
		} //敌机移动的方法结束
	this.Img = img;
	//		this.enemydie = false;		
	//绘制敌机方法
	this.draw = function() {
			if (this.Isconflict) {
				this.startx += this.width;
				if (this.startx == 5 * this.width) {
					var enemyindex = 0;
					for (var i = 0; i < enemys.length; i++) {
						if (enemys[i] == this) {
							enemyindex = i;
							break;
						}
					}
					enemys.splice(enemyindex, 1);
					addnewEnemys();
				}
			} else {
				this.startx = 0;
			}
			context.drawImage(this.Img, this.startx, 0, this.width, this.height, this.x, this.y, this.width, this.height);
			//				}
		} //绘制敌机方法结束
} //创建敌机的方法结束
//创建一个敌机
//随机数
function random(min, max) {
	return parseInt(Math.random() * (max - min)) + min;
} //随机数结束

function CreatRandomenemy(x, y) {
	enemytype = random(1, 8);
	if (enemytype == 1 || enemytype == 2 || enemytype == 3) {
		//第一类飞机
		var a = new enemyFunction(x, y, en1W, enemy1H, enemy1Image, enemy1speed);
	} else if (enemytype == 4 || enemytype == 5) {
		//第二类飞机
		var a = new enemyFunction(x, y, en3W, enemy3H, enemy3Image, enemy3speed);
	} else if (enemytype == 6) {
		//第三类飞机
		var a = new enemyFunction(x, y, en2W, enemy2H, enemy2Image, enemy2speed);
	} else if (enemytype == 7) {
		//	var x = random(0, canvas.width - en1W);
		var a = new enemyFunction(x, y, propImgW, propImgH, propImg, propImgspeed);
	}
	enemys.push(a);
}
//删除第一个后，创建新的敌机，并放到数组中
function addnewEnemys() {
	var x = random(0, canvas.width - en2W);
	var yjj = random(50, 100);
	var y = enemys[enemys.length - 1].y - yjj;
	//	console.log(enemys[enemys.length - 1].y);
	CreatRandomenemy(x, y);
	//		var a  = new enemyFunction(x , y , en1W, enemy1H , enemy1Image ,enemy1speed);
	//		enemys.push(a);
} //放到数组方法结束