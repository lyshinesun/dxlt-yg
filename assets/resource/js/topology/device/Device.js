/**
 * 元素对象
 * @param context 上下问
 * @param resourceID 实例ID
 * @param imgsrc  图片路劲
 * @param sx 横坐标
 * @param sy 纵坐标
 * @param type  设备类型
 * @param warnContent 告警内容
 * @param statu  状态
 * @param isDel  是否删除 默认false
 * @param ex 结束x
 * @param ey 结束y
 * @constructor
 */

function Device(context,imgsrc,instanceID ,sx, sy,type,warnContent,resourceID,statu,isDel,width,height,ex,ey,startElement,endElement) {
	this.context = context;
	this.instanceID = instanceID;
	this.imgsrc = imgsrc;
	this.sx = sx;
	this.sy = sy;
	this.width = width;
	this.height = height;
	this.type = type;
	this.warnContent = warnContent;
	this.resourceID = resourceID;
	this.statu = statu;
	this.isDel = isDel;
	this.ex = ex;
	this.ey = ey;
	if(this.type > 0){
		this.img = new Image();
		this.img.src = imgsrc;
	}
	this.startElement = startElement;
	this.endElement = endElement;
}
Device.prototype.setContext = function(context){
	this.context = context;
};
Device.prototype.setImgWidth = function(width){
	this.img.width = width;
};
Device.prototype.setImgsrc = function(imgsrc){
	this.imgsrc = imgsrc;
	if(this.type > 0){
		this.img = new Image();
		this.img.src = imgsrc;
	}
};
Device.prototype.setImgHeight = function(height){
	this.img.height = height;
};

Device.prototype.setInstanceID = function(instanceID){
	this.img.instanceID = instanceID;
};

Device.prototype.setIsDel = function(isDel){
	this.img.isDel = isDel;
};

Device.prototype.setType = function(type){
	this.type = type;
};
Device.prototype.setInstanceID = function(instanceID){
	this.instanceID = instanceID;
};
Device.prototype.setWarnContent = function(warnContent){
	this.img.warnContent = warnContent;
};

Device.prototype.setResourceID = function(resourceID){
	this.img.resourceID = resourceID;
};

Device.prototype.setEX = function(ex){
	this.ex = ex;
};

Device.prototype.setEY = function(ey){
	this.ey = ey;
};

Device.prototype.setSX = function(sx){
	this.sx = sx;
};

Device.prototype.setSY = function(sy){
	this.sy = sy;
};

Device.prototype.setWidth = function(width){
	this.width = width;
};

Device.prototype.setHeight = function(height){
	this.height = height;
};

Device.prototype.draw = function(){
	var context = this.context;
	context.beginPath();
	context.save();

	//x,y坐标
    var x = this.sx ;//- this.width / 2;
    var y = this.sy ;//- this.height / 2;
    var width = this.width;
    var height = this.height;
	if(this.type > 0){
		if(!this.img.complete){
			this.img.addEventListener('load',function(){
				context.drawImage(this,x,y,width,height);
			});}
		else{/*已加载完*/
			context.drawImage(this.img,x,y,width,height);
		}
		this.context.restore();
	}else if(this.type == 0){
		context.moveTo(this.sx, this.sy);
		context.lineTo(this.ex, this.ey);
		//context.lineTo(this.ex, this.ey);
		//this.ctx.lineWidth = this.lineWidth;
		//this.ctx.strokeStyle = this.strokeStyle;
		//this.ctx.globalAlpha = this.opacity;
		context.lineWidth=2;                //设置或返回当前的线条宽度
		context.lineCap="round";       	 	//向线条的每个末端添加圆形线帽。
		context.strokeStyle="yellow";
		context.stroke();
	}else{
		if(!this.img.complete){
			this.img.addEventListener('load',function(){
				context.drawImage(this,x,y,width,height);
			});
		}
		else{/*已加载完*/
			context.drawImage(this.img,x,y,width,height);
		}
		this.context.restore();
	}
};

/**
 * 坐标是否包含在图片中
 */
Device.prototype.IsIncludePoint = function (Point) {
	var x = Point.x;
	var y = Point.y;
	var w = this.width;
	var h = this.height;

	if(this.type > 0){
		if(x>this.sx && x < (this.sx + parseInt(w)) && y>this.sy && y < (this.sy + parseInt(h))){
			return true
		}
	}else{
		if ((Point.x > this.sx) && (Point.y > this.sy) && (Point.x > this.ex) && (Point.y > this.ey)) {
			return false;
		}
		if ((Point.x < this.sx) && (Point.y < this.sy) && (Point.x < this.ex) && (Point.y < this.ey)) {
			return false;
		}
		if ((Point.x > this.sx) && (Point.y < this.sy) && (Point.x > this.ex) && (Point.y < this.ey)) {
			return false;
		}
		if ((Point.x < this.sx) && (Point.y > this.sy) && (Point.x < this.ex) && (Point.y > this.ey)) {
			return false;
		}

		if ((Point.x > this.sx) && (Point.y < this.sy) && (Point.x > this.ex) && (Point.y > this.ey)) {
			return false;
		}

		//( endY - beginY ) / ( endX - beginX )计算斜率，然后计算( Y - beginY ) / ( X - beginX )，若两斜率相等，（ X, Y )必在该直线上。
		var startAngle = operatorMR.getAtanAngle(this.sx, this.sy, this.ex, this.ey);
		var startAngle_1 = operatorMR.getAtanAngle(this.sx, this.sy, Point.x, Point.y);
		//console.log(Math.abs(startAngle - startAngle_1));
		if (Math.abs(startAngle - startAngle_1) <= 15) {
			var endAngle = operatorMR.getAtanAngle(this.ex, this.ey, this.sx, this.sy);
			var endAngle_1 = operatorMR.getAtanAngle(this.ex, this.ey, Point.x, Point.y);
			//console.log(Math.abs(endAngle - endAngle_1));
			if (Math.abs(endAngle - endAngle_1) <= 10) {
				return true;
			}
		}
		//Math.pow(this.ex-this.sx,2) + Math.pow(this.ey-this.sy,2)
		//return true;
	}

    return false;
};

Device.prototype.getObject = function () {
	var object = new Object();
	
	object.imgsrc = this.imgsrc;
	object.centerX = this.centerX;
	object.centerY = this.centerY;
    
  //x,y坐标
    object.x = this.x;
    object.y = this.y;
	
	object.type=this.type;
    return object;
};