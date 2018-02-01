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

function Text(context,instanceID ,sx, sy,type,content,resourceID,statu,isDel,size,color) {
	this.context = context;
	this.instanceID = instanceID;
	this.sx = sx;
	this.sy = sy;
	
	this.height = null;
	this.type = type;
	this.resourceID = resourceID;
	this.statu = statu;
	this.isDel = isDel;
	this.content = content;

	this.width = null;
	this.size = size;
}
Text.prototype.setContext = function(context){
	this.context = context;
};

Text.prototype.setIsDel = function(isDel){
	this.isDel = isDel;
};

Text.prototype.setType = function(type){
	this.type = type;
};
Text.prototype.setInstanceID = function(instanceID){
	this.instanceID = instanceID;
};
Text.prototype.setResourceID = function(resourceID){
	this.resourceID = resourceID;
};

Text.prototype.setSX = function(sx){
	this.sx = sx;
};

Text.prototype.setSY = function(sy){
	this.sy = sy;
};

Text.prototype.setWidth = function(width){
	this.width = width;
};

Text.prototype.setHeight = function(height){
	this.height = height;
};
Text.prototype.setContent = function(content){
	this.content = content;
};
Text.prototype.setSize = function(size){
	this.size = size;
};
Text.prototype.setColor = function(color){
	this.color = color;
};
Text.prototype.draw = function(){
	var context = this.context;

	//x,y坐标
    var x = this.sx ;//- this.width / 2;
    var y = this.sy ;//- this.height / 2;
	
	if(this.color == null || typeof(this.color)=="undefined" || this.color == ""){
		this.color = "red";
	}
	if(this.size == null || typeof(this.size)=="undefined" || this.size == ""){
		this.size = 30;
	}
	
	context.font=this.size+"px 微软雅黑";
	context.fillStyle = this.color;
	context.fillText(this.content,x,y);
};

/**
 * 坐标是否包含在图片中
 */
Text.prototype.IsIncludePoint = function (Point) {
	var x = Point.x;
	var y = Point.y;
	var w = this.width;
	var h = this.height;
	var x2 = this.sx;
	var y2 = this.sy;
	if(x>this.sx && x < (this.sx + parseInt(w)) && y<this.sy && y > (this.sy - parseInt(h))){
		return true;
	}
    return false;
};

Text.prototype.getObject = function () {
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