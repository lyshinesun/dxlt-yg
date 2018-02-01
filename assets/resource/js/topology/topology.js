new Vue({
  el: '#stationTopology',
  data: {
  	stationList:[],
  	stationId:'',
	layerIndex: 0,
    contextMenus: [{
      option: '绑定点名',
      disabled : true
    },{
      option: '删除',
      disabled : true
    }],
    contextMenuVisible: 'hidden',
    contextMenuPos: {
      top: '0px',
      left:'0px'
    },
	targetName:"",
	diagVisible:false,
	nodeInfo:'',
	dia_title:'绑定点名',
    isBindNode: false,
	sx:0,
	sy:0

  },
  methods: {
  	 /*获取电站列表*/
    getStations: function (res) {
        var _this = this
        _this.stationList = res.list
        _this.stationId = _this.stationList[0].fdStationCode
    },

    /*阻止浏览器的右单击事件*/
    showContextMenu (e) {
		cabEleIndex = null;
		var x = e.clientX;
		var y = e.clientY;
		this.sx = x;
		this.sy = y;
		ColumnPoint = canvasUtils.getPointOnCanvas(topo.variables.canvasMR, x, y);
		for(var i=topo.variables.DevElements.length-1;i>=0;i--){
		    if(topo.variables.DevElements[i].IsIncludePoint(ColumnPoint)){
		    	IsMouseDown = true;
		    	cabEle = topo.variables.DevElements[i];
		    	cabEleIndex = i;
		    	break;
		    }
		}
		if(cabEleIndex == null){
			this.contextMenus = [{
			  option: '此处输入文本',
			  disabled : true
			}];
			$("#contextMenu").css("height","28px");
			this.dia_title="输入文本";
			//$("#title_div").html("输入文本");
			this.isBindNode = false;
		}else{
			this.contextMenus = [{
			  option: '绑定点名',
			  disabled : true
			},{
			  option: '删除',
			  disabled : true
			},{
			  option: '更改文本',
			  disabled : true
			}];
			$("#contextMenu").css("height","80px");
			this.dia_title="绑定点名";
			this.isBindNode = true;
			//$("#title_div").html("绑定点名");
		}
      // console.log(e.clientX, e.clientY)
      this.contextMenuPos.top = e.clientY + 'px'
      this.contextMenuPos.left = e.clientX + 'px'
      document.oncontextmenu = function(){
        return false;
      } 
      this.contextMenuVisible = 'visible'
    },
    stopContextMenu () {
      this.contextMenuVisible = 'hidden'
    },
    selectOption (e,index) {
		if(e.target.innerHTML == "绑定点名"){
			this.bindInfoPop();
		}else if(e.target.innerHTML == "删除"){
			this.deleted();
		}else if(e.target.innerHTML == "此处输入文本"){
			this.addText(e);
		}else if(e.target.innerHTML == "更改文本"){
			this.isBindNode = false;
			this.updateText();
			console.log()
			this.dia_title="更改文本";
			console.log(this.dia_title)
			//$("#title_div").html("更改文本");
			var text = topo.variables.DevElements[cabEleIndex].content
			console.log(text);
			
			$("#content").val(text);
			var a = $("#content").val()
			console.log(a)
			console.log($("#content"))
			console.log($("#content").text())
			$("#size").val(topo.variables.DevElements[cabEleIndex].size);
			
			
		}
      this.contextMenuVisible = 'hidden'
    },
	updateText:function(){
		this.diagVisible = true;
	},
	deleted:function(){
	  for(var i in  topo.variables.DevElements){
		  if(topo.variables.DevElements[i].type == 0){
			  if(topo.variables.DevElements[i].startElement !=null){
				  if(topo.variables.DevElements[i].startElement.instanceID == topo.variables.DevElements[cabEleIndex].instanceID){
					  topo.variables.DevElements[i].startElement = undefined;
				  }
			  }
			  if(topo.variables.DevElements[i].endElement !=null){
				  if(topo.variables.DevElements[i].endElement.instanceID == topo.variables.DevElements[cabEleIndex].instanceID){
					  topo.variables.DevElements[i].endElement = undefined;
				  }
			  }
		  }
	  }
	  topo.variables.DevElements.splice(cabEleIndex, 1);
	  topo.draw();
	},
	addTag:function(){
	},
	addText:function(e){
		this.diagVisible = true;
	},
	bindInfoPop () {
		var tmp = topo.variables.DevElements[cabEleIndex].resourceID;
		this.diagVisible = true;
		$("#targetName").val(tmp);
	},
	confirmBind () {
		this.diagVisible = false;
		var html = $("#title_div").html();
		if(html == "绑定点名"){
			topo.variables.DevElements[cabEleIndex].resourceID = $("#targetName").val();	
		}else if(html == "输入文本"){
			var content = $("#content").val();
			if(content == null || content == "" || typeof(content) =="undefined"){
				layer.alert('输入内容不能为空');
				return;
			}
			
			var color = $("#color").val();
			var size=$("#size_text option:selected").text();
			
			var textObj = new Text();
			textObj.setContext(topo.variables.contextMR);
			textObj.setContent(content);
			textObj.setSize(size);
			textObj.setColor(color);
			textObj.setSX(this.sx);
			textObj.setHeight(30);
			textObj.setSY(this.sy);
			textObj.setInstanceID(topo.getUUID());
			textObj.setType(20);
			
			textObj.setWidth(70);
			
			topo.addObj(textObj);
			topo.draw();
		}else if(html == "更改文本"){
			var content = $("#content").val();
			if(content == null || content == "" || typeof(content) =="undefined"){
				layer.alert('输入内容不能为空');
				return;
			}
			
			var color = $("#color").val();
			var size=$("#size_text option:selected").text();
			
			var textObj = new Text();
			textObj.setContext(topo.variables.contextMR);
			textObj.setContent(content);
			textObj.setSize(size);
			textObj.setColor(color);
			textObj.setSX(this.sx);
			textObj.setHeight(30);
			textObj.setSY(this.sy);
			textObj.setInstanceID(topo.getUUID());
			textObj.setType(20);
			
			textObj.setWidth(70);
			
			topo.addObj(textObj);
			topo.draw();
		}
		
	},
	getHeight:function(){
        var h = topo.variables.contextMR.measureText('M').width;
        return h+h/6;
    },
	cancelBind () {
		this.diagVisible = false;
		cabEleIndex = null;
	}
	/*bindInfoPop () {
		var _this = this
		_this.flag = true
		
      parent.layer.open({
        type: 1,
        title: '绑定点名',
        shadeClose: false,
        shade: 0,
        maxmin: false, //开启最大化最小化按钮
        area: ['280px', '180px'],
        btn: ['确定', '取消'],
        yes:function (index, layero) {
			_this.flag = false
            parent.layer.close(index);
			if(topo.variables.DevElements[cabEleIndex].type>0){
				console.log(_this)
				console.log($('#targetName'))
				
				topo.variables.DevElements[cabEleIndex].resourceID = "xxxx";
			}else{
				alert("连线不支持绑定点名");
			}
        },
        btn2: function (index, layero) {
			_this.flag = false
            parent.layer.close(index)
        },
        btnAlign: 'c',
        content:  $('#target'),
        success:function (layero, index) {
			_this.layerIndex = index
        } 
      }); 
	  $('.layui-layer-btn0').click(function () {
		console.log(_this.layerIndex)
		layer.close(_this.layerIndex)
		console.log($('#targetName').val())
	  })
	 
    }*/
  },
  
  created:function () {
      
  },
  mounted: function () {
      vlm.getConnectedStations(this.getStations)
  }
})