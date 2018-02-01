/*右侧元素核心类*/
var right = {
	bindFunction:function(){
		$("#shapeContain").find("li").each(function(i,obj){
			$(this).attr("onmousedown","right.doMouseDown(this,event)");
		});
	},

	doMouseDown : function(obj,e) {
		e.preventDefault && e.preventDefault();
		isDown = true;
		canvasUtils.removeEventHandler(topo.variables.canvasMR, "mousedown", operatorMR.doMouseDown);
		canvasUtils.removeEventHandler(topo.variables.canvasMR, "mousemove", operatorMR.doMouseMove);
		canvasUtils.removeEventHandler(topo.variables.canvasMR, "mouseup", operatorMR.doMouseUp);
		canvasUtils.removeEventHandler(topo.variables.canvasMR, "contextmenu", operatorMR.doContextmenu);
		canvasUtils.removeEventHandler(topo.variables.canvasMR, "dblclick", operatorMR.doDblclick);

		document.onmousemove = function(e) {
			if(isDown){
				isMove = true;
			}
		};

		document.onmouseup = function(e) {
			isDown = false;
			var x = e.clientX;
			var y = e.clientY;
			var pageY = e.pageY - 250;
			var flag = topo.IsIncludeJG(x,y);
			if(isMove){
				var type = $(obj).find("img")[0].dataset.type;
				var imgsrc = right.wrapNewImgPath($(obj).find("img")[0].src);

				var widthE = $(obj).find("img")[0].dataset.width;
				var heightE = $(obj).find("img")[0].dataset.height;
				var offsetImgWidth = $(obj).find("img")[0].dataset.width/2;
				var device = new Device();
				device.setContext(topo.variables.contextMR);
				if(type != 0){
					device.setType(type);
					device.setImgsrc(imgsrc);
					device.setWidth(widthE);
					device.setHeight(heightE);
					device.setSX(x);
					device.setSY(y);
				}else{
					device.setType(type);
					device.setSX(x);
					device.setSY(y-50);
					device.setEX(x);
					device.setEY(y+50);
				}
				device.setInstanceID(topo.getUUID());
				topo.addObj(device);
				topo.draw();
			}
			isMove = false;
			document.onmousemove = null;
			document.onmouseup = null;
			canvasUtils.addEventHandler(topo.variables.canvasMR, "mousedown", operatorMR.doMouseDown);
			canvasUtils.addEventHandler(topo.variables.canvasMR, "mousemove", operatorMR.doMouseMove);
			canvasUtils.addEventHandler(topo.variables.canvasMR, "mouseup", operatorMR.doMouseUp);
			canvasUtils.addEventHandler(topo.variables.canvasMR, "contextmenu", operatorMR.doContextmenu);
			canvasUtils.addEventHandler(topo.variables.canvasMR, "dblclick", operatorMR.doDblclick);
		}

	},
	wrapNewImgPath : function(path){
		return path;
	},

	warpCustormImg : function(path){
		return path;
	}
}
$(function(){
	right.bindFunction();
});