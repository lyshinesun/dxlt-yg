/*拓扑核心js*/

var topo = {
	/**
	 * 变量
	 */
	variables : {
		isChange : false,		//是否移动
		canvasMR : null, 		//机柜画布
		contextMR : null,		//机柜上下文
		mrWidth : 1400,			//宽
		mrHeight : 1080,		//高
		DevElements : [],		//设备
		cabX : 0,
		cabY : 0,
		dcID : 1,         //机房id
		isEdit :false
	},

	/**
	 * 初始化
	 */
	init : function(){
		//单例canvas
		topo.variables.canvasMR = canvasUtils.getCanvas("canvas");
		//topo.variables.mrHeight=820;
		//topo.variables.mrWidth=$(window).width()-240;
		topo.setCanvasSize();
		topo.variables.contextMR = topo.variables.canvasMR.getContext("2d");

		topo.eventInit();
	},

	eventInit : function(){
		//注册若干响应事件
		canvasUtils.addEventHandler(topo.variables.canvasMR, "mousedown", operatorMR.doMouseDown);
		canvasUtils.addEventHandler(topo.variables.canvasMR, "mousemove", operatorMR.doMouseMove);
		canvasUtils.addEventHandler(topo.variables.canvasMR, "mouseup", operatorMR.doMouseUp);
		canvasUtils.addEventHandler(topo.variables.canvasMR, "contextmenu", operatorMR.doContextmenu);
	},


	getUUID:function(){
		var s = [];
		var hexDigits = "0123456789abcdef";
		for (var i = 0; i < 36; i++) {
			s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
		}
		s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
		s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
		s[8] = s[13] = s[18] = s[23] = "-";

		var uuid = s.join("");
		return uuid;
	},
	/**
	 * 获取机柜信息
	 * @param id 机房id
	 */
	getTopoData : function(){
		leftList.getCabById(aeCabId);
	},
	addText : function(e){
		
	},
	/**
	 * 保存机柜拓扑
	 */
	save : function(){
		var jsonDataStr = {
			topoId : aeCabId,
			jsonData : topo.variables.DevElements
		};
		jsonDataStr = JSON.stringify(jsonDataStr);
		$.ajax({
			url : '/portal/topo/element/relation/add',
			type : 'post',
			data : {
				topoId : aeCabId,
				jsonData : jsonDataStr
			},
			async:false,
			success: function(data){
				confirmPopuplayer.init({
					"title":"提示",
					"mes":"保存成功!",
					"popType":0,
					"type":1
				});
				leftList.getCabById(aeCabId);
			},
			failure : function(data){
				console.log("添加机柜元素失败:"+data);
				leftList.warnWindow("添加机柜元素失败");
			}
		});
	},

	/**
	 * 点击编辑响应事件
	 * @param obj 当前按钮对象
	 */
	edit : function(obj){
		var str = $(obj).html();
		if(str == '编辑'){
			$(obj).html('退出编辑');
			topo.variables.isEdit = true;
			$("#cab_save_btn").css('display','block');
			//注册若干响应事件
			canvasUtils.removeEventHandler(topo.variables.canvasMR, "mousemove", operatorMR.doWarnMouseMove);
			canvasUtils.addEventHandler(topo.variables.canvasMR, "mousedown", operatorMR.doMouseDown);
			canvasUtils.addEventHandler(topo.variables.canvasMR, "mousemove", operatorMR.doMouseMove);
			canvasUtils.addEventHandler(topo.variables.canvasMR, "mouseup", operatorMR.doMouseUp);
			canvasUtils.addEventHandler(topo.variables.canvasMR, "contextmenu", operatorMR.doContextmenu);
			//canvasUtils.addEventHandler(topo.variables.canvasMR, "dblclick", operatorMR.doDblclick);
			canvasUtils.removeEventHandler(topo.variables.canvasMR, "dblclick", operatorMR.doDblclick);
			$(".imgPlot").css("display","block");
		}else{
			$(obj).html('编辑');
			topo.variables.isEdit = false;
			leftList.getCabById(aeCabId);
			$("#cab_save_btn").css('display','none');
			//注册若干响应事件
			canvasUtils.removeEventHandler(topo.variables.canvasMR, "mousedown", operatorMR.doMouseDown);

			canvasUtils.removeEventHandler(topo.variables.canvasMR, "mousemove", operatorMR.doMouseMove);
			canvasUtils.removeEventHandler(topo.variables.canvasMR, "mouseup", operatorMR.doMouseUp);
			canvasUtils.removeEventHandler(topo.variables.canvasMR, "contextmenu", operatorMR.doContextmenu);
			//canvasUtils.removeEventHandler(topo.variables.canvasMR, "dblclick", operatorMR.doDblclick);
			canvasUtils.addEventHandler(topo.variables.canvasMR, "mousemove", operatorMR.doWarnMouseMove);
			canvasUtils.addEventHandler(topo.variables.canvasMR, "dblclick", operatorMR.doDblclick);
			$(".imgPlot").css("display","none");
		}
	},

	/**
	 * 添加设备到数组
	 * @param obj 设备
	 */
	addObj : function(obj){
		topo.variables.DevElements.push(obj);
	},

	/**
	 *清空数据
	 */
	empty : function(){
		topo.variables.DevElements = [];
	},

	/**
	 * 设置画布尺寸
	 */
	setCanvasSize : function(){
		//TODO  x y 的获取
		topo.variables.canvasMR.setAttribute('width', topo.variables.mrWidth);
		topo.variables.canvasMR.setAttribute('height', topo.variables.mrHeight);
	},

	/**
	 * 画图
	 */
	draw : function(){
		topo.variables.contextMR.clearRect(0, 0, topo.variables.mrWidth, topo.variables.mrHeight);
		if(topo.variables.DevElements.length>0){
			topo.variables.DevElements = topo.sortA(topo.variables.DevElements);
			for(var i = 0;i<topo.variables.DevElements.length;i++){
				topo.variables.DevElements[i].draw();
			}
		}
	},
	sortA : function(arr){
		for(var i=0;i<arr.length-1;i++){
			for(var j=i+1;j<arr.length;j++){
						  //获取第一个值和后一个值比较
				var cur = arr[i];
				if(cur.type>arr[j].type){
						  // 因为需要交换值，所以会把后一个值替换，我们要先保存下来
					var index = arr[j];
							// 交换值
					arr[j] = cur;
					arr[i] = index;
				}
			}
		}
		return arr;
	},
	warpCusColor : function(statu){
		if(statu == "normalStatus"){
			return "#20e500";
		}else if(statu == "warnStatus"){
			return "#fafd02";
		}else if(statu == "badStatus"){
			return "#ff9900";
		}else if(statu == "deadStatus"){
			return "red";
		}else if(statu == "noStatus"){
			return "#929292";
		}else{
			return "#929292";
		}
	},


	/**
	 * 坐标是否在机柜内
	 */
	IsIncludeJG : function(x,y){
		var cabX = topo.variables.cabX;
		var cabY = topo.variables.cabY;
		var cabW = 192;
		var cabH = 800;
		if(x > cabX && x < cabX+ cabW &&
			y>cabY && y < cabY + cabH){
			return true
		}
		return false;
	},

	show : function (obj,id,e) {
		var objDiv = $("#"+id+"");
		$(objDiv).css("display","block");
		$(objDiv).css("left", e.pageX);
		$(objDiv).css("top", e.pageY + 10);
	} ,

	hide : function (obj,id) {
		var objDiv = $("#"+id+"");
		$(objDiv).css("display", "none");
	}

}

$(function(){
	topo.init();
});