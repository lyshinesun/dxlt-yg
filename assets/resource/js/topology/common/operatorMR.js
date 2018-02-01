/**响应事件*/
var cabIsDown = false;
var cabIsMove = false;
var cabEleIndex = 0;
var cabEle = null;
var isEleArea = false;

var operatorMR = {
	
	/**
	 * 初始化画布鼠标点击事件
	 */
	doMouseDown : function(e) {
		isEleArea = false;
		var x = e.clientX;
		var y = e.clientY;
		
		var keyID = e.keyCode ? e.keyCode : e.which;
		if (keyID === 3) { // 鼠标右键  
		    return;
		}else{
			cabIsDown = true;
			//CabMenu.removeCabMenu();
			//CabMenu.choiseElements = [];
		}
		
		ColumnPoint = canvasUtils.getPointOnCanvas(topo.variables.canvasMR, x, y);
		for(var i=topo.variables.DevElements.length-1;i>=0;i--){
		    if(topo.variables.DevElements[i].IsIncludePoint(ColumnPoint)){
		    	IsMouseDown = true;
		    	cabEle = topo.variables.DevElements[i];
		    	cabEleIndex = i;
		    	break;
		    }
		}
	},
	
	/**
	 * 初始化画布鼠标移动事件
	 */
	doMouseMove : function(e) {
		if(cabIsDown && cabEleIndex != null&&topo.variables.DevElements[cabEleIndex] != null){
			if(topo.variables.DevElements[cabEleIndex].type == 100){
				var newColumnPoint = canvasUtils.getPointOnCanvas(topo.variables.canvasMR, e.clientX, e.clientY);
				var pharsX = newColumnPoint.x - ColumnPoint.x;
				var pharsY = newColumnPoint.y - ColumnPoint.y;
				ColumnPoint.x = ColumnPoint.x +	pharsX;
				ColumnPoint.y = ColumnPoint.y +	pharsY;
				for(var i in topo.variables.DevElements){
					topo.variables.DevElements[i].centerX = topo.variables.DevElements[i].centerX + pharsX;
					topo.variables.DevElements[i].centerY = topo.variables.DevElements[i].centerY + pharsY;
				}
				topo.variables.cabX = topo.variables.DevElements[0].centerX;
				topo.variables.cabY = topo.variables.DevElements[0].centerY;
				topo.draw();
			}else{
				var newColumnPoint = canvasUtils.getPointOnCanvas(topo.variables.canvasMR, e.clientX, e.clientY);
				//单设备拖动
				var pharsX = newColumnPoint.x - ColumnPoint.x;
				var pharsY = newColumnPoint.y - ColumnPoint.y;
				ColumnPoint.x = ColumnPoint.x +	pharsX;
				ColumnPoint.y = ColumnPoint.y +	pharsY;
				var offsetImgWidth = topo.variables.DevElements[cabEleIndex].width/2;
				if(topo.variables.DevElements[cabEleIndex].type>0){
					topo.variables.DevElements[cabEleIndex].sx = topo.variables.DevElements[cabEleIndex].sx + pharsX;
					topo.variables.DevElements[cabEleIndex].sy = topo.variables.DevElements[cabEleIndex].sy + pharsY;
					for(var i=topo.variables.DevElements.length-1;i>=0;i--){
						if(topo.variables.DevElements[i].type == 0){
							if(typeof(topo.variables.DevElements[i].startElement) != "undefined" && topo.variables.DevElements[i].startElement != null){
								if(topo.variables.DevElements[i].startElement.instanceID == topo.variables.DevElements[cabEleIndex].instanceID){
									topo.variables.DevElements[i].sx = topo.variables.DevElements[cabEleIndex].sx + topo.variables.DevElements[cabEleIndex].width/2;
									topo.variables.DevElements[i].sy = topo.variables.DevElements[cabEleIndex].sy + topo.variables.DevElements[cabEleIndex].height/2;
								}
							}
							if(typeof(topo.variables.DevElements[i].endElement) != "undefined" && topo.variables.DevElements[i].endElement != null){
								if(topo.variables.DevElements[i].endElement.instanceID == topo.variables.DevElements[cabEleIndex].instanceID){
									topo.variables.DevElements[i].ex = topo.variables.DevElements[cabEleIndex].sx + topo.variables.DevElements[cabEleIndex].width/2;
									topo.variables.DevElements[i].ey = topo.variables.DevElements[cabEleIndex].sy + topo.variables.DevElements[cabEleIndex].height/2;
								}
							}
						}
					}
				}else if(topo.variables.DevElements[cabEleIndex].type==0){
					var flagS = false;
					var tempPonit = canvasUtils.getPoint(topo.variables.DevElements[cabEleIndex].sx,topo.variables.DevElements[cabEleIndex].sy);
						if(typeof(topo.variables.DevElements[cabEleIndex].startElement) == "undefined"){
							for(var i=topo.variables.DevElements.length-1;i>=0;i--){
								if(topo.variables.DevElements[i].type != 0){
									if(topo.variables.DevElements[i].IsIncludePoint(tempPonit)){
										topo.variables.DevElements[cabEleIndex].sx = topo.variables.DevElements[i].sx + topo.variables.DevElements[i].width/2;
										topo.variables.DevElements[cabEleIndex].sy = topo.variables.DevElements[i].sy + topo.variables.DevElements[i].height/2;
										topo.variables.DevElements[cabEleIndex].startElement = topo.variables.DevElements[i];
										break;
									}
								}
							}
						}else{
							for(var i=topo.variables.DevElements.length-1;i>=0;i--){
								if(topo.variables.DevElements[i].type != 0){
									if(topo.variables.DevElements[i].IsIncludePoint(tempPonit)){
										flagS = true;
										break;
									}
								}
							}
							if(!flagS){
								topo.variables.DevElements[cabEleIndex].sx = topo.variables.DevElements[cabEleIndex].sx + pharsX;
								topo.variables.DevElements[cabEleIndex].sy = topo.variables.DevElements[cabEleIndex].sy + pharsY;
								topo.variables.DevElements[cabEleIndex].startElement = null;
							}
						}
						if(typeof(topo.variables.DevElements[cabEleIndex].startElement) == "undefined"){
							topo.variables.DevElements[cabEleIndex].sx = topo.variables.DevElements[cabEleIndex].sx + pharsX;
							topo.variables.DevElements[cabEleIndex].sy = topo.variables.DevElements[cabEleIndex].sy + pharsY;
						}
					var flagE = false;
					var tempPonite = canvasUtils.getPoint(topo.variables.DevElements[cabEleIndex].ex,topo.variables.DevElements[cabEleIndex].ey);
						if(typeof(topo.variables.DevElements[cabEleIndex].endElement) == "undefined"){
							for(var i=topo.variables.DevElements.length-1;i>=0;i--){
								if(topo.variables.DevElements[i].type != 0){
									if(topo.variables.DevElements[i].IsIncludePoint(tempPonite)){
										topo.variables.DevElements[cabEleIndex].ex = topo.variables.DevElements[i].sx + topo.variables.DevElements[i].width/2;
										topo.variables.DevElements[cabEleIndex].ey = topo.variables.DevElements[i].sy + topo.variables.DevElements[i].height/2;
										topo.variables.DevElements[cabEleIndex].endElement = topo.variables.DevElements[i];
										break;
									}
								}
							}
						}else{
							for(var i=topo.variables.DevElements.length-1;i>=0;i--){
								if(topo.variables.DevElements[i].type != 0){
									if(topo.variables.DevElements[i].IsIncludePoint(tempPonite)){
										flagE = true;
										break;
									}
								}
							}
							if(!flagE){
								topo.variables.DevElements[cabEleIndex].ex = topo.variables.DevElements[cabEleIndex].ex + pharsX;
								topo.variables.DevElements[cabEleIndex].ey = topo.variables.DevElements[cabEleIndex].ey + pharsY;
								topo.variables.DevElements[cabEleIndex].endElement = null;
							}
						}
						if(typeof(topo.variables.DevElements[cabEleIndex].endElement) == "undefined"){
							topo.variables.DevElements[cabEleIndex].ex = topo.variables.DevElements[cabEleIndex].ex + pharsX;
							topo.variables.DevElements[cabEleIndex].ey = topo.variables.DevElements[cabEleIndex].ey + pharsY;
						}
				}
				topo.draw();
			}
		}
	},
	
	/**
	 * 浏览模式下执行移动悬浮曾显示
	 */
	doWarnMouseMove : function(e) {
		var x = e.clientX;
		var y = e.clientY;
		//CabMenu.choiseElements = [];
		var isChoseEle = false;
		ColumnPoint = canvasUtils.getPointOnCanvas(topo.variables.canvasMR, x, y);
		for(var i=topo.variables.DevElements.length-1;i>=0;i--){
			if(topo.variables.DevElements[i].IsIncludePoint(ColumnPoint)){
				isChoseEle = true;
				cabEle = topo.variables.DevElements[i];
				cabEleIndex = i;
				break;
			}
		}
		if(cabEleIndex > 0 && isChoseEle){
			if(cabEle.imgsrc.indexOf("room_jg-edit-03-big") > 0 || cabEle.imgsrc.indexOf("room_jg-edit-01-big") > 0 || cabEle.imgsrc.indexOf("room_jg-edit-02-big") > 0){
				topo.hide(this,"warnInfoDiv");
			}else{
				topo.show(this,"warnInfoDiv",e);
				var name = cabEle.refName;
				var ip = cabEle.refIP;
				if(!isNaN(name) || typeof(name) == "undefined"){
					name = "未关联";
				}
				if(!isNaN(ip) || typeof(ip) == "undefined"){
					ip = "未关联";
				}
				var html = "设备名称："+name+"<br/>设备IP："+ip;
				$("#warnInfoDiv").html(html);
			}
		}else{
			topo.hide(this,"warnInfoDiv");
		}
	},
	/**
	 * 初始化画布鼠标松开事件
	 */
	doMouseUp : function(e) {
		cabEle = null;
		cabEleIndex = null;
		cabIsDown = false;
	},

	/**
	 * 初始化画布双击事件
	 */
	doDblclick : function(e) {
		cabEle = null;
		var x = e.clientX;
		var y = e.clientY;
		ColumnPoint = canvasUtils.getPointOnCanvas(topo.variables.canvasMR, x, y);
		for(var i=topo.variables.DevElements.length-1;i>=0;i--){
		    if(topo.variables.DevElements[i].IsIncludePoint(ColumnPoint)){
		    	cabEle = topo.variables.DevElements[i];
		    	cabEleIndex = i;
		    	break;
		    }
		}
		if(cabEle != null){
			var id = cabEle.resourceID;
			if(id != "" && id != null && !(typeof(id) == "undefined")){
				var rootPath = operatorMR.getProjectUrl();
				newUrl = rootPath
							+ "/resourceDetail/getResDetailById.do?instanceId="
							+ id;
				window.open(newUrl, "_blank");
			}
		}
	},
	
	getProjectUrl : function() {
		var curPath = window.document.location.href;// 获取主机地址之后的目录，如：//
		var pathName = window.document.location.pathname;
		var pos = curPath.indexOf(pathName); // 获取主机地址，如：
												// http://localhost:8083
		var localhostPaht = curPath.substring(0, pos); // 获取带"/"的项目名，如：/uimcardprj
		var projectName = pathName.substring(0,
				pathName.substr(1).indexOf('/') + 1);
		// var rootPath = localhostPaht + projectName;
		return localhostPaht + "/portal";
	},
	
	/**
	 * 初始化鼠标右键
	 */
	doContextmenu : function(e) {
		e.preventDefault && e.preventDefault();
		var x = e.clientX;
		var y = e.clientY;
		var ColumnPointMenu = canvasUtils.getPointOnCanvas(topo.variables.canvasMR, x, y);
		for(var i=topo.variables.DevElements.length-1;i>=0;i--){
		    if(topo.variables.DevElements[i].IsIncludePoint(ColumnPointMenu)){
		    	isEleArea = true;
		    	break;
		    }
		}
		if(isEleArea){
			//CabMenu.show(e);
		}else{
			//CabMenu.removeCabMenu();
			//CabMenu.choiseElements = [];
		}
		return false;  
	},

	getAtanAngle: function (x1, y1, x2, y2) {
		var x = Math.abs(x1 - x2);
		var y = Math.abs(y1 - y2);
		//返回角度,不是弧度
		return 360*Math.atan(y/x)/(2*Math.PI);
	}

}