/*画布响应事件*/

var canvasUtils = {
		
	data : {
		r : 200
	},
	/* 
	 * addEventListener:监听Dom元素的事件 
	 *   
	 *  target：监听对象 
	 *  type：监听函数类型，如click,mouseover 
	 *  func：监听函数 
	 */
	addEventHandler : function(target, type, func) {
		if (target.addEventListener) {
			//监听IE9，谷歌和火狐  
			target.addEventListener(type, func, false);
		} else if (target.attachEvent) {
			target.attachEvent("on" + type, func);
		} else {
			target["on" + type] = func;
		}
	},
	/* 
	 * removeEventHandler:移除Dom元素的事件 
	 *   
	 *  target：监听对象 
	 *  type：监听函数类型，如click,mouseover 
	 *  func：监听函数 
	 */
	removeEventHandler : function(target, type, func) {
		if (target.removeEventListener) {
			//监听IE9，谷歌和火狐  
			target.removeEventListener(type, func, false);
		} else if (target.detachEvent) {
			target.detachEvent("on" + type, func);
		} else {
			delete target["on" + type];
		}
	},
	/*
	         获取Canvas在屏幕上 相对坐标位置
	 */
	getPointOnCanvas : function(canvas, x, y) {
		var _box = canvas.getBoundingClientRect();
		return {
			x : x - _box.left * (canvas.width / _box.width),
			y : y - _box.top * (canvas.height / _box.height)
		};
	},

	/*
	 * 获取Canvas在屏幕上中心点的位置
	 *
	 *
	 * 
	 */
	getCenterPointOnCanvas : function(canvas) {
		var _box = canvas.getBoundingClientRect();
		return {
			x : _box.width / 2,
			y : _box.height / 2
		}
	},
	/*
	   获取角度
	 */
	getAngle : function(x1, y1, x2, y2) {
		// 直角的边长
		var x = Math.abs(x1 - x2);
		var y = Math.abs(y1 - y2);
		// 斜边长
		var z = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
		// 余弦
		var cos = y / z;
		// 弧度
		var radina = Math.acos(cos);
		// 角度
		var angle = 180 / (Math.PI / radina);
		return angle;
	},

	getPoint: function(x,y){
		return {
			x : x,
			y : y
		};
	},
	getRadius : function(x1, y1, x2, y2) {
		var radius = Math.atan2(y2 - y1, x2 - x1);

		return 180 * radius / Math.PI;
	},

	getAtanAngle : function(x1, y1, x2, y2) {
		var x = Math.abs(x1 - x2);
		var y = Math.abs(y1 - y2);
		//返回角度,不是弧度
		return 360 * Math.atan(y / x) / (2 * Math.PI);
	},
	/*
	  克隆对象
	 */
	cloneObj : function(obj) {
		var newObj = [];
		for ( var i in obj) {
			newObj[i] = obj[i];
		}
		return newObj;
	},
	/*
	  克隆对象数组
	 */
	cloneArr : function(arr) {
		var newArr = [];
		for (var i = 0; i < arr.length; i++) {
			if (typeof arr[i] === 'object') {
				newArr.push(this.cloneObj(arr[i]));
			} else {
				newArr.push(this[i]);
			}
		}
		return newArr;
	},

	getCanvas : function(canvas) {
		var canvas = document.getElementById(canvas);
		return canvas
	},

	getCanvasContext : function() {
		return utils.getCanvas().getContext("2d");
	},

	Trim : function(str, is_global) {
		var result;
		result = str.replace(/(^\s+)|(\s+$)/g, "");
		if (is_global.toLowerCase() == "g") {
			result = result.replace(/\s/g, "");
		}
		return result;
	},

	getPosition : function(x, y, angle) {
		var radian = (angle * Math.PI) / 180;
		var px = x + this.data.r * Math.cos(radian);
		var py = y - this.data.r * Math.sin(radian);
		return {
			x : px,
			y : py
		};
	},
	
	/**
	 * 去重复数组
	 * @param arr 需要处理重复的数组
	 * @returns {Array} 不重复的数组
	 */
	uniqueArr : function(arr){
		var res = [];
		var json = {};
		for(var i = 0; i < arr.length; i++){
			if(!json[arr[i]]){
				res.push(arr[i]);
				json[arr[i]] = 1;
			}
		}
		return res;
	},
	
	/**
	 * @returns uuid
	 */
	uuid : function() {
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
	
	compare : function (prop) {
		 return function (obj1, obj2) {
			var val1 = obj1[prop];
			var val2 = obj2[prop];if (val1 < val2) {
				return -1;
			} else if (val1 > val2) {
				return 1;
			} else {
				return 0;
			}            
		} 

	}
}